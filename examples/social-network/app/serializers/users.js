import { Serializer } from 'lux-framework';

class UsersSerializer extends Serializer {
  attributes = [
    'name',
    'email'
  ];

  hasMany = [
    'comments',
    'posts',
    'followees',
    'followers',
    'reactions'
  ];
}

export default UsersSerializer;
