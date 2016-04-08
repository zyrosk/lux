import { Serializer } from 'lux-framework';

class CommentsSerializer extends Serializer {
  attributes = [
    'commentableId',
    'commentableType',
    'edited',
    'message',
    'createdAt',
    'updatedAt'
  ];

  hasOne = [
    'user'
  ];
}

export default CommentsSerializer;
