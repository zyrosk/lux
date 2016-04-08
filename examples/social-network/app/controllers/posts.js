import { Controller } from 'lux-framework';

import setUser from '../middleware/set-user';

class PostsController extends Controller {
  params = [
    'body',
    'isPublic',
    'userId'
  ];

  beforeAction = [
    setUser
  ];
}

export default PostsController;
