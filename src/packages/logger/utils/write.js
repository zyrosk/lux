import ansiRegex from 'ansi-regex';

import fs from '../../fs';

import tryCatch from '../../../utils/try-catch';

export default function write(path, message) {
  tryCatch(async () => {
    message = message.replace(ansiRegex(), '');
    await fs.appendFileAsync(path, message, 'utf8');
  }, err => {
    console.error(err);
  });
}
