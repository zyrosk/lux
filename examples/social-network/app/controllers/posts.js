import { Controller } from 'lux-framework';

class PostsController extends Controller {
  params = [
    'body',
    'title',
    'isPublic'
  ];
}

export default PostsController;
