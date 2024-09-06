import joi from 'joi';
import * as U from './users.controllers';
import User from './users.entities';
import { PaginationResult, Route } from '#Api/types';
import { getAll } from '../../lib/genericControllers';
// import { Objects } from '#Api/enums';
import DiariesRoutes from './diaries/diaries.routes';
import { app } from '#Api/config/uuidSegments.json';
import { apiResponse, uuidValidator, controllerResponse } from '#Api/helpers';
import Joi from 'joi';
import { ValidationError } from '#Api/errors';

const userRoutePath = '/users';
export const userSubRoutePath = userRoutePath + '/:id';

const Routes: Route = {
    entity: User,
    subRoutes: {
        // [userSubRoutePath]: DiariesRoutes,
    },
    middlewares: [],
    endpoints: {
        GET: {
            path: userRoutePath,
            controller: [async (req, res) => {
                const { limit, offset, order }: PaginationResult = req.paginator;
                const data = await U.getUsers({ limit, offset, order });

                // return controllerResponse({ statusCode: res.statusCode, data, hasErrors: false })
                return { statusCode: res.statusCode, data, hasErrors: false };
            }],
            // requestValidator: {},
        },
        POST: {
            path: userRoutePath,
            controller: [async (req, res) => {
                const { firstName, lastName, email, cognitoId, createdBy } = req.body;
                const data = await U.createUser({ firstName, lastName, email, cognitoId, createdBy });

                return controllerResponse({ statusCode: 201, data, hasErrors: false });
            }],
            validator: {
                body: joi.object({
                    firstName: joi.string().required(),
                    lastName: joi.string().required(),
                    email: joi.string().required(),
                    cognitoId: joi.string().required(),
                }).required().empty({}).label('Request body data').unknown(),
            },
        },
    },
};

export default Routes;
