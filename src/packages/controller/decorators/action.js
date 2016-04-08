import sanitizeParams from '../middleware/sanitize-params';
import setRecord from '../middleware/set-record';

export default function action(target, key, desc) {
  const { value } = desc;

  return {
    get() {
      return () => [
        sanitizeParams,
        setRecord,

        ...this.middleware,

        async function (req, res) {
          let { data, links } = await value.call(this, req, res);

          if (data && typeof data !== 'object') {
            return data;
          }

          if (data) {
            data = this.serializer.stream({
              data,
              links
            }, req.params.include, req.params.fields);
          }

          return data;
        }
      ].map(handler => {
        return (req, res) => handler.call(this, req, res);
      });
    }
  };
}
