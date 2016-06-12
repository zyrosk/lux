import { Serializer } from 'lux-framework';

class CategorizationsSerializer extends Serializer {
  hasOne = [
    'post',
    'tag'
  ];
}

export default CategorizationsSerializer;
