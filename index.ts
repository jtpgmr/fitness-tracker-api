import AppDataSource from '#Api/DataSource';
import app, { appLogger } from '#Api/app';

let port: number = Number.parseInt(process.env.SERVER_PORT || '', 10);
port = !Number.isNaN(port) ? port : 9000;

AppDataSource.initialize()
    .then(() => {
        app.listen(port);

        console.clear();

        appLogger.info(`Server is operating on port ${port}`);
    })
    .catch(error => appLogger.error(error));
