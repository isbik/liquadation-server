import * as fs from 'fs';
import { EOL } from 'os';

export const writeToFile = (message) => {
  const folder = 'logs';

  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }

  const date = new Date().toLocaleDateString().split('.').reverse().join('');

  const filePath = `${folder}/` + date;

  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(filePath);
  }

  fs.appendFileSync(
    filePath + '.log',
    new Date().toLocaleString() + ' - ' + message + EOL,
  );
};
