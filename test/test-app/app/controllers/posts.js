import { Controller } from 'LUX_LOCAL';

class PostsController extends Controller {
  params = [
    'title',
    'body',
    'isPublic'
  ];

  beforeAction = [
    function (req, res) {
      res.setHeader('X-Controller', 'Posts');
    }
  ];

  index(req, res) {
    return super.index(req, res).isPublic();
  }
}

export default PostsController;
