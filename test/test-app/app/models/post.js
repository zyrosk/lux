import { Model } from 'LUX_LOCAL';

class Post extends Model {
  static belongsTo = {
    author: {
      inverse: 'posts'
    }
  };

  static scopes = {
    drafts() {
      return this.where({
        isPublic: false
      });
    },

    isPublic() {
      return this.where({
        isPublic: true
      });
    }
  };
}

export default Post;
