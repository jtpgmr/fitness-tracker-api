import express, { application, Application, IRouterHandler, NextFunction, Request, Response, Router } from 'express';
import { Route } from '#Api/types';
import createRouter from './createRouter';
import { handleNotFound } from '#Api/middlewares';

const createApp = (
    { routes, setupMiddleware }: 
    { routes?: Record<string, Route>, setupMiddleware: ((req: Request, res: Response, next: NextFunction) => void)[]},
): Application => {
    const app: Application = express();

    app.use('/health', (req, res) => res.status(200).send('Ok'));

    if (setupMiddleware && setupMiddleware.length > 0) {
        for (const mw of setupMiddleware) app.use(mw);
    }

    Object.entries(routes || []).map(([path, route]: [string, Route]) => {
        const router: Router = createRouter(route);
        return app.use(path, router);
    });
    
    app.use('*', (req: Request, res: Response) => !req.route && handleNotFound(req, res));

    return app;
};

export default createApp;