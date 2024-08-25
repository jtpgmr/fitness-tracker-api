import { Request, Response } from 'express';
import apiResponse from '../helpers/outputs';
import { ApiResponse } from '../types';
import { PageNotFoundError } from '../errors';
import { createErrorObj } from '../helpers';

const handleNotFound = (req: Request, res: Response): Response<ApiResponse> => {
    const err = new PageNotFoundError(`${req.protocol}://${req.hostname}${req.originalUrl}`);
    return res.status(err.statusCode).send(
        apiResponse({
            hasErrors: true,
            data: createErrorObj(err.name, err.message),
        }),
    );
};

export default handleNotFound;
