import BaseEntity from '#Api/BaseEntity';
import AppDataSource from '#Api/DataSource';
import { ApiResponse } from '#Api/types';
import AppDB from '../../dbModel';
import { DataSource } from 'typeorm';
import app from '#Api/app';
import request from 'supertest';
import getDBTableRecords from './getDbTableRecords';

const getAll = async ({
    Entity,
    dataSource = AppDataSource,
    tableName,
}: {
	Entity: typeof BaseEntity;
	tableName: (typeof AppDB.healthApp.tables)[keyof typeof AppDB.healthApp.tables];
	dataSource?: DataSource;
}): Promise<void> => {
    let apiRecords: ApiResponse & { data: BaseEntity[] };
    let dbRecords: BaseEntity[];

    describe(`GET /api/${tableName}`, () => {
        it(`Successfully gets all ${tableName} via a request to the API, and stores the response body in a variable`, async () => {
            apiRecords = await request(app)
                .get(`/api/${tableName}`)
            // .set('Authorization', 'Bearer ' + accessToken)
                .expect(200)
                .then(res => res.body);
        });

        it(`Get all ${tableName} present in the DB using a query to "${tableName}" table`, async () => {
            dbRecords = await getDBTableRecords({ dataSource, tableName });

            dbRecords = dbRecords.filter(dbR => dbR.deletedAt === null);
        });

        it(`Check that all the ${tableName} retrieved by the API call are what is present in the database`, async () => {
            expect(apiRecords.count).toEqual(dbRecords.length);

            apiRecords.data.map((r: BaseEntity) => expect(dbRecords.filter(dbR => dbR.id === r.id).length).toBe(1));
        });
    });
};

export default getAll;
