import BaseEntity from '#Api/BaseEntity';
import AppDataSource from '#Api/DataSource';
import { ApiResponse } from '#Api/types';
import AppDB from '../../dbModel';
import { DataSource } from 'typeorm';
import app from '#Api/app';
import request from 'supertest';
import getDBTableRecords from './getDbTableRecords';
import { APIError, RecordNotFoundError } from '#Api/errors';
import { generateUuid } from '#Api/helpers';

const getOne = async ({
    Entity,
    dataSource = AppDataSource,
    tableName,
    id,
}: {
	Entity: typeof BaseEntity;
	tableName: (typeof AppDB.healthApp.tables)[keyof typeof AppDB.healthApp.tables];
	dataSource?: DataSource;
	id: string;
}): Promise<void> => {
    let apiRecords: ApiResponse & { data: BaseEntity[] };
    let dbRecords: BaseEntity[];
    let err: APIError;
    const fakeId = generateUuid(tableName);

    describe(`GET /api/${tableName}`, () => {
        it('Find record from DB for the given ID and table name/endpoint', async () => { });

        it('Attempts to retrieve information for a valid product type ID that does not exist in the DB', async () => {
            err = new RecordNotFoundError();

            await request(app)
                .get(`/api/${tableName}/${fakeId}`)
                .expect(err.statusCode)
                .then(res => expect(res.body.data[0].exceptionType).toEqual(err.name));
        });

        it('Get info for a test product that was made', async () => {
            await request(app)
                .get(`/api/${tableName}/${fakeId}`)
                .expect(200)
                .then(res => expect(res.body.data).toEqual(newProduct));
        });
    });
};

export default getOne;
