import { ApiResponseInputs, ControllerResult, ErrorObject, HttpMethod, Route, Validator } from '#Api/types';
import { Request, Response, Router } from 'express';
import joi from 'joi';
import apiResponse, { controllerResponse } from './outputs';
import createErrorObj from './createErrorObj';
import { APIError, UnknownServerError, ValidationError } from '#Api/errors';
import paginator from './paginator';

const applyRouteToRouter = (route: Route, expressRouter: Router): Router => {
    // check if route has protector middleware functions and execute them
    if (route.middlewares && route.middlewares.length > 0) route.middlewares.forEach(mw => expressRouter.use(mw));

    // iterate over all defined endpoints
    Object.entries(route.endpoints).forEach(([httpMethod, endpoint]) => {
        if (endpoint.controller.length === 0) {
            throw new Error('Controllers not set');
        }
        const methodLowerCase = httpMethod.toLowerCase() as Lowercase<HttpMethod>;
        expressRouter[methodLowerCase](endpoint.path, async (req: Request, res: Response) => {
            const requestValidator = endpoint.validator;
            if (requestValidator) {
                const errors: ErrorObject[] = [];

                for (const [requestProperty, validator] of Object.entries(requestValidator)) {
                    try {
                        await validator.validateAsync(req[requestProperty as keyof Validator]);
                    } catch (err) {
                        if (err instanceof joi.ValidationError) {
                            const { name, message } = new ValidationError(`Error in request ${requestProperty} field for ${route.entity.name}`, err.details[0].message);
                            errors.push(createErrorObj(name, message));
                        }
                    }
                }

                console.log('validation err', errors);

                if (errors.length > 0) {
                    return res.status(400).send(
                        apiResponse({
                            hasErrors: false,
                            data: errors,
                        }),
                    );
                }
            }

            if (req.query) {
                req.paginator = paginator(req.query);
            }

            let result: ApiResponseInputs;

            for (const controller of endpoint.controller) {
                try {
                    result = await controller(req, res);
                } catch (err) {
                    if (err instanceof APIError) {
                        return res.status(err.statusCode).send(
                            apiResponse({
                                hasErrors: true,
                                data: createErrorObj(err.name, err.message),
                            }),
                        );
                    } else if (err instanceof Error || typeof err === 'string') {
                        const unknownError = new UnknownServerError('An unexpected error occurred.', (err as Error).message || err as string);
                        return res.status(unknownError.statusCode).send(
                            apiResponse({
                                hasErrors: true,
                                data: createErrorObj(unknownError.name, unknownError.message),
                            }),
                        );
                    }
                }
            }

            const response: ControllerResult = controllerResponse(result!);

            return res.status(response.statusCode).send(
                apiResponse({
                    hasErrors: false,
                    data: response!.data,
                }),
            );
        });
    });

    if (route.subRoutes) {
        Object.entries(route.subRoutes).forEach(([path, subRoute]) => {
            const subRouter = Router();
            applyRouteToRouter(subRoute, expressRouter);
            expressRouter.use(path, subRouter);
        });
    }

    return expressRouter;
};

export default applyRouteToRouter;
