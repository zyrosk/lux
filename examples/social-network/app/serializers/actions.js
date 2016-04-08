import { Serializer } from 'lux-framework';

class ActionsSerializer extends Serializer {
  attributes = [
    'trackableId',
    'trackableType',
    'createdAt',
    'updatedAt'
  ];

  hasOne = [
    'user'
  ];
}

export default ActionsSerializer;
