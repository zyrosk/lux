import { Transform } from 'stream';

class ContentStream extends Transform {
  constructor(): ContentStream {
    super({
      encoding: 'utf8',
      writableObjectMode: true
    });

    process.nextTick(() => {
      this.emit('ready', this);
    });

    return this;
  }

  _transform(chunk: ?Object, encoding: string, done: () => void): void {
    if (chunk && typeof chunk === 'object') {
      this.push(JSON.stringify(chunk));
    }

    done(null);
  }
}

export default ContentStream;
