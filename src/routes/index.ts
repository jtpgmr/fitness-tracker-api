import { Route } from '#Api/types';
import UsersRoutes from './users/users.routes';

const RootApiRoutes: Route[] = [UsersRoutes];

export default RootApiRoutes;
