import BaseEntity from '#Api/BaseEntity';
import AppDB from '../../dbModel';
import { DataSource } from 'typeorm';

// Function to get data from the DB tables
const getDBTableRecords = async ({
    dataSource,
    tableName,
}: {
	dataSource: DataSource;
	tableName: (typeof AppDB.healthApp.tables)[keyof typeof AppDB.healthApp.tables];
}): Promise<BaseEntity[]> => {
    const items = await dataSource.query(
		`select * from "${AppDB.healthApp.schemaName}"."${tableName}" order by "serialId";`,
    );

    return items;
};

export default getDBTableRecords;
