import { fromRoute } from '../decorators/fromRoute';
import { route } from '../decorators/route';
import { BaseController } from './baseController';

export class UsersController extends BaseController {
    
    @route('/api/users')
    all() {
        console.log('method all() called.');
        return 'success';
    }
    
    @route('/api/users/:id')
    byId(@fromRoute('id') id: number) {
        console.log(`method byId() called with id: ${id}`);
        return 'success';
    }
    
    @route('/api/users/:id/profile/post/:profileId')
    getPosts(@fromRoute('id') id: number, @fromRoute('profileId') profileId: number) {
        console.log(`method getPosts() called with id: ${id} and profileId: ${profileId}`);
        return 'success';
    }
    
}