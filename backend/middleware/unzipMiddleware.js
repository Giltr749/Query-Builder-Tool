import * as fs from 'fs';
import * as unzipper from 'unzipper';
import { sortCsv } from './parseMiddleware.js';

const unzip = (files) => {
    for (let file of files) {
        const fileStream = fs.createReadStream(`./files/downloads/${file}`);
        const writeStream = unzipper.Extract({path: `./files/unzipped`});

        fileStream.on('data', chunk => {
            writeStream.write(chunk);
        });
        fileStream.on('end', () => {
            // sortCsv();
            writeStream.end();
        })

    }
};

export const unzipFiles = (req, res, next) => {
    fs.readdir('./files/downloads', (err, files) => {
        if (err) {
            return console.log(err);
        } else {
           unzip(files);
        }
    })
    console.log('Done unzipping');
    next();
}
