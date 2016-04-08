import { Model } from 'lux-framework';

class Action extends Model {
  static attributes = {
    trackableId: {
      type: 'integer',
      size: 4
    },

    trackableType: {
      type: 'text'
    }
  };

  static hasOne = {
    user: {
      model: 'user',
      reverse: 'actions'
    }
  };
}

export default Action;
