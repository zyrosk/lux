import { Serializer } from 'lux-framework';

class FriendshipsSerializer extends Serializer {
  attributes = [
    'createdAt',
    'updatedAt'
  ];
}

export default FriendshipsSerializer;
