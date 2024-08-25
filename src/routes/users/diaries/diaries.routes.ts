import * as joi from 'joi';
import { Route } from '#Api/types';
import { uuidValidator } from '#Api/helpers';
import { deleteOne, getAll, getOne } from '../../../lib/genericControllers';
import { MealType, Objects } from '#Api/enums';
import { diariesRepository, usersRepository } from '#Api/DataSource';
import { checkValidParentRecord } from '#Api/middlewares';
import { app } from '#Api/config/uuidSegments.json';
import { createOne } from './diaries.controllers';
import Diary from './diaries.entities';

const diariesRoutePath = '/diaries';
export const diariesSubRoutePath = diariesRoutePath + '/:dId';

const Routes: Route = {
    subRoutes: {},
    middlewares: [
        checkValidParentRecord({
            dbObj: {
                repository: usersRepository,
                name: Objects.USER,
                uuidSegment: app.users.id,
            },
            paramField: 'id',
        }),
    ],
    endPoints: [
        {
            method: 'get',
            path: diariesRoutePath,
            controller: getAll(diariesRepository),
            validator: {},
        }, {
            method: 'get',
            path: diariesSubRoutePath,
            controller: getOne({
                repository: diariesRepository,
                whereObj: {
                    id: 'dId',
                    userId: 'id',
                },
                dbObject: Objects.DIARY,
            }),
            validator: {
                params: joi.object({
                    id: uuidValidator({ objectType: Objects.DIARY, uuidSegment: app.users.diary.id }).required(),
                }),
            },
        }, {
            method: 'post',
            path: diariesRoutePath,
            controller: createOne,
            validator: {
                body: joi
                    .object({
                        mealType: joi
                            .number()
                            .valid(...Object.values(MealType))
                            .required(),
                        meal: joi
                            .array()
                            .items(uuidValidator({ objectType: Objects.FOOD, uuidSegment: app.food.id }).required())
                            .allow(null)
                            .optional(),
                    })
                    .unknown(),
            },
        }, {
            method: 'put',
            path: diariesSubRoutePath,
            controller: getAll(diariesRepository),
            validator: {
                body: joi
                    .object({
                        firstName: joi.string().empty('').optional(),
                        lastName: joi.string().empty('').optional(),
                    })
                    .unknown(),
            },
        }, {
            method: 'delete',
            path: diariesSubRoutePath,
            controller: deleteOne({
                Entity: Diary,
                whereObj: { id: 'dId', userId: 'id' },
                dbObject: Objects.DIARY,
            }),
            validator: {
                params: joi.object({
                    id: uuidValidator({ objectType: Objects.DIARY, uuidSegment: app.users.diary.id }).required(),
                }),
            },
        },
    ],
};

export default Routes;
