import { HTTPMethod } from '../constants/enum';
import { route, fromRoute, fromBody, fromQuery } from '../decorators/routingDecorator';
import { User } from '../models/user';
import { BaseController } from './baseController';


class BaseModel {
    public stringify() {
        console.log(JSON.stringify(this));
    }
    public toString() {
        return JSON.stringify(this);
    }
}

class UserFilter extends BaseModel {
    page: number;
    pageSize: number;
}

export class UsersController extends BaseController {
    
    @route()
    all(@fromQuery(UserFilter) userFilter: UserFilter) {
        console.log(`Fetching ${userFilter.pageSize} users of Page ${userFilter.page}`);
        return 'success';
    }
    
    @route('/:id')
    byId(@fromRoute('id') id: number) {
        console.log('Type of Id: ', typeof id);
        console.log(`method byId() called with id: ${id}`);
        return 'success';
    }
    
    @route('/:id/profile/post/:profileId')
    getPosts(@fromRoute('id') id: number, @fromRoute('profileId') profileId: number) {
        console.log(`method getPosts() called with id: ${id} and profileId: ${profileId}`);
        return 'success';
    }

    @route('', HTTPMethod.Post)
    createUser(@fromBody(User) user: User) {
        console.log(`Received info...\n${user}`);
        console.log('Creating user...', user.name);
        return 'user created';
    }

    @route('/:id/:username', HTTPMethod.Put)
    weird(@fromRoute('id') id: number, 
        @fromBody(User) user: User, 
        @fromQuery(UserFilter) filter: UserFilter, 
        @fromRoute('username') name: string) {
            
            console.log('This is one hell of a weird route');
            console.log(`Lets checkout passed in user: ${user}`);
            console.log(`Now lets checkout passed in filter: ${filter}`);
            console.log(`Oh, almost forget the route params. Here is the id: ${id} and the name: ${name}`);
        }
    
}