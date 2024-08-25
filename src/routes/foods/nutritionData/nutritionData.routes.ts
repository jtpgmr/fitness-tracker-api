import { UserController } from '../users/users.controllers';

const Routes = [
    {
        method: 'get',
        route: '/foods',
        controller: UserController,
        action: 'all',
    }, {
        method: 'get',
        route: '/foods/:id',
        controller: UserController,
        action: 'one',
    }, {
        method: 'post',
        route: '/foods',
        controller: UserController,
        action: 'save',
    }, {
        method: 'delete',
        route: '/foods/:id',
        controller: UserController,
        action: 'remove',
    },
];

export default Routes;
