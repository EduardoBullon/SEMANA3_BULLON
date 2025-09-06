const { Transform } = require('stream');
const fs = require('fs');

const transformStream = new Transform({
  transform(chunk, _enc, cb) {
    cb(null, chunk.toString().toUpperCase());
  }
});

const readStream = fs.createReadStream('texto.txt', { encoding: 'utf8' });
const writeStream = fs.createWriteStream('texto_mayusculas.txt');

readStream.pipe(transformStream).pipe(writeStream);

writeStream.on('finish', () => console.log('Listo: texto_mayusculas.txt generado'));
readStream.on('error', console.error);
transformStream.on('error', console.error);
writeStream.on('error', console.error);
