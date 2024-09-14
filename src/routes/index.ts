import { Route } from '#Api/types';
import UsersRoutes from './users/users.routes';

const RootApiRoutes = { '/api': UsersRoutes };

export default RootApiRoutes;
