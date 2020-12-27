import { HTTPResponse } from '../constants/enum';
import { 
    Get, Post, Put, // HTTPMethods based route handlers
    FromRoute, FromBody, FromQuery // Parameters
} from '../decorators/routingDecorator';
import { Response } from '../models/response';
import { User } from '../models/user';
import { UserFilter } from '../models/userFilter';
import { BaseController } from './baseController';

export class UsersController extends BaseController {
    
    @Get()
    all(@FromQuery(UserFilter) userFilter: UserFilter) {
        console.log(`Fetching ${userFilter.limit} users of Page ${userFilter.page}`);
        return new Response(HTTPResponse.Success, { Success: true });
    }
    
    @Get('/:id')
    byId(@FromRoute('id') id: number) {
        console.log('Type of Id: ', typeof id);
        console.log(`method byId() called with id: ${id}`);
        return 'success';
    }
    
    @Get('/:id/profile/post/:profileId')
    getPosts(@FromRoute('id') id: number, @FromRoute('profileId') profileId: number) {
        console.log(`method getPosts() called with id: ${id} and profileId: ${profileId}`);
        return 'success';
    }

    @Post()
    createUser(@FromBody(User) user: User) {
        console.log(`Received info...\n${user}`);
        console.log('Creating user...', user.name);
        return new Response(HTTPResponse.Created, { id: Math.round(Math.random() * 10) });
    }

    @Put('/:id/:username')
    weird(@FromRoute('id') id: number, 
        @FromBody(User) user: User, 
        @FromQuery(UserFilter) filter: UserFilter, 
        @FromRoute('username') name: string) {
        
        console.log('This is one hell of a weird route.');
        console.log(`Lets checkout passed in user: ${user}`);
        console.log(`Now lets checkout passed in filter: ${filter}`);
        console.log(`Oh, almost forget the route params. Here is the id: ${id} and the name: ${name}`);
    }
    
}