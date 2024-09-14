import AppDataSource from '#Api/DataSource';
import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import pino from 'pino';
import { pinoHttp } from 'pino-http';

import RootApiRoutes from './src/routes';
import { createApp } from '#Api/helpers';
import { verifyJwt } from '#Api/middlewares';
import { PaginationResult } from '#Api/types';

// declare global {
//     namespace Express {
//         interface Request {
//             paginator: PaginationResult
//         }
//     }
// }

// ES2015 module syntax of above
declare module 'express-serve-static-core' {
    interface Request { 
        paginator: PaginationResult;
    }
}

const { JWT_ALGORITHMS, JWT_ISSUER, JWT_JWKS_URI, SERVER_PORT } = process.env;

if (!JWT_ALGORITHMS || !JWT_ISSUER || !JWT_JWKS_URI) throw new Error('verifyJwt configs not properly set');

let port: number = Number.parseInt(SERVER_PORT || '', 10);
port = !Number.isNaN(port) ? port : 9000;

// only log warning levels and above
export const appLogger = pino({ level: 'info' });
const pinoConfig = pinoHttp({
    logger: appLogger,
    customLogLevel: (_: Request, res: Response, err) => {
        if (res.statusCode >= 400 && res.statusCode < 500) return 'warn';
        if (res.statusCode >= 500 || err) return 'error';
        return 'silent';
    },
});

const app: Application = createApp({
    routes: RootApiRoutes,
    setupMiddleware: [
        helmet(),
        cors(),
        pinoConfig,
        express.json({ limit: '50mb' }),
        verifyJwt({
            algorithms: JWT_ALGORITHMS,
            issuer: JWT_ISSUER,
            jwksUri: JWT_JWKS_URI,
        }),
    ],
});

AppDataSource.initialize()
    .then(() => {
        app.listen(port);

        console.clear();

        appLogger.info(`Server is operating on port ${port}`);
    })
    .catch(error => appLogger.error(error));
