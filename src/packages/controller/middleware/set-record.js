import tryCatch from '../../../utils/try-catch';

export default async function setRecord(req, res) {
  await tryCatch(async () => {
    const { params, method } = req;

    if (params.id) {
      const options = {};
      const { modelName } = this;

      if (method === 'GET') {
        let fields = params.fields[modelName];

        if (!fields) {
          fields = this.serializedAttributes;
        }

        options.only = fields;
      }

      req.record = await this.store.findRecord(modelName, params.id, options);
    }
  }, err => {
    if (err.literalCode === 'NOT_FOUND') {
      req.record = null;
    }
  });
}
