import 'reflect-metadata';
import { config } from '@dotenvx/dotenvx';
import { DataSource } from 'typeorm';
import User from './routes/users/users.entities';
import Diary from './routes/users/diaries/diaries.entities';

config();

const { DB_NAME, DB_SCHEMA, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_SYNC, DB_LOGGING } = process.env;

let port: number = Number.parseInt(DB_PORT || '', 10);
port = !Number.isNaN(port) ? port : 9000;

const AppDataSource = new DataSource({
    database: DB_NAME,
    schema: DB_SCHEMA,
    username: DB_USER,
    password: DB_PASSWORD,
    type: 'postgres',
    host: DB_HOST,
    port,
    synchronize: (DB_SYNC || '').toLowerCase() === 'true',
    logging: (DB_LOGGING || '').toLowerCase() === 'true',
    // try adding "rootDir" config to jest config
    // entities: [path.join(__dirname, '/routes/**/*.entities.{js,ts}')], // conflicts with jest
    entities: [User],
    migrations: [],
    subscribers: [],
});

export const usersRepository = AppDataSource.getRepository(User);
export const diariesRepository = AppDataSource.getRepository(Diary);

export default AppDataSource;