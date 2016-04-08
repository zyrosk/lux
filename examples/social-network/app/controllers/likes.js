import { Controller } from 'lux-framework';

import setUser from '../middleware/set-user';

class LikesController extends Controller {
  params = [
    'likeableId',
    'likeableType'
  ];

  beforeAction = [
    setUser
  ];
}

export default LikesController;
