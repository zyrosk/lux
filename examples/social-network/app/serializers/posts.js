import { Serializer } from 'lux-framework';

class PostsSerializer extends Serializer {
  attributes = [
    'body',
    'isPublic',
    'createdAt',
    'updatedAt'
  ];

  hasOne = [
    'user'
  ];

  hasMany = [
    'likes',
    'comments'
  ];
}

export default PostsSerializer;
