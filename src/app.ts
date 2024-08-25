import express, { Application, Request, Response, Router } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import pino from 'pino';
import { pinoHttp } from 'pino-http';

import RootApiRoutes from './routes';
import { applyRouteToRouter } from '#Api/helpers';
import { handleNotFound } from '#Api/middlewares';
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

// only log warning levels and above
export const appLogger = pino({ level: 'info' });

// create express app
const app: Application = express();

// Middleware to help secure HTTP headers
app.use(helmet());

app.use(cors());

app.use(
    pinoHttp({
        logger: appLogger,
        customLogLevel: (_: Request, res: Response, err) => {
            if (res.statusCode >= 400 && res.statusCode < 500) return 'warn';
            if (res.statusCode >= 500 || err) return 'error';
            return 'silent';
        },
    }),
);

app.use(express.json({ limit: '50mb' }));

const router: Router = express.Router({ mergeParams: true });

app.use('/health', (req, res) => res.status(200).send('Ok'));

app.use('/api', RootApiRoutes.map(route => applyRouteToRouter(route, router)));

app.use('*', (req: Request, res: Response) => !req.route && handleNotFound(req, res));

export default app;
