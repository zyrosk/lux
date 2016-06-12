import { Serializer } from 'lux-framework';

class FriendshipsSerializer extends Serializer {
  hasOne = [
    'followee',
    'follower'
  ];
}

export default FriendshipsSerializer;
