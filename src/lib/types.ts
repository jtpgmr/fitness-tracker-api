import { NextFunction, Request, Response, IRouterMatcher } from 'express';
import { Schema } from 'joi';
import { APIError, ValidationError } from './errors';
import BaseEntity from '#Api/BaseEntity';
import { FindManyOptions, FindOneOptions, FindOptionsOrder, Repository } from 'typeorm';
import APIBaseEntity from '#Api/BaseEntity';

export type ErrorObject = {
	exceptionType: string;
	message: string;
};

export type ApiResponseInputs<T = APIBaseEntity> = {
	hasErrors: boolean;
	statusCode?: number;
	data: T | T[] | ErrorObject | ErrorObject[] | ValidationError[];
};

export type ApiResponse<T = APIBaseEntity> = ApiResponseInputs<T> & { count: number };

export type ControllerResult = ApiResponseInputs & { statusCode: number }

export type Validator = {
	params?: Schema;
	body?: Schema;
};


export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';


export type EndpointConfig = {
	path: string;
	controller: ((req: Request, res: Response) => Promise<ControllerResult>)[]
	validator?: Validator;
};

export type Endpoints = {
	[method in HttpMethod]?: EndpointConfig;
};

export type Route = {
	subRoutes?: Record<string, Route>;
	middlewares?: ((req: Request, res: Response, next: NextFunction) => Promise<NextFunction>)[];
	endpoints: Endpoints;
	entity: typeof APIBaseEntity
};

export type PaginateOptions = {
	page?: string | number;
	count?: string | number;
	order?: string;
};

export type OrderType = 'ASC' | 'DESC';

export type PaginationResult = {
	limit?: number;
	offset?: number;
	order?: OrderType;
};

export type ApiRepository<T extends APIBaseEntity> = Repository<T>;
