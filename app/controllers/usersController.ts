import { HTTPMethod } from '../constants/enum';
import { route, fromRoute, fromBody, fromQuery } from '../decorators/routeDecorators';
import { BaseController } from './baseController';

class User {
    username: string;
}

class UserFilter {
    page: number;
    pageSize: number;
}

export class UsersController extends BaseController {
    
    @route()
    all(@fromQuery() userFilter: UserFilter) {
        console.log(`Fetching ${userFilter.pageSize} users of Page ${userFilter.page}`);
        return 'success';
    }
    
    @route('/:id')
    byId(@fromRoute('id') id: number) {
        console.log(`method byId() called with id: ${id}`);
        return 'success';
    }
    
    @route('/:id/profile/post/:profileId')
    getPosts(@fromRoute('id') id: number, @fromRoute('profileId') profileId: number) {
        console.log(`method getPosts() called with id: ${id} and profileId: ${profileId}`);
        return 'success';
    }

    @route('', HTTPMethod.Post)
    createUser(@fromBody() user: User) {
        console.log('Creating user...', user.username);
        return 'user created';
    }
    
}