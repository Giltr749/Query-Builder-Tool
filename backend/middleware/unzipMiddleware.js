import * as fs from 'fs';
import * as unzipper from 'unzipper';
import { sortCsv } from './parseMiddleware.js';

const unzip = async (files) => {
    const promises = []
    for await (let file of files) {
        console.log('unzipping', file);
        const fileStream = fs.createReadStream(`./files/downloads/${file}`);
        const writeStream = unzipper.Extract({ path: `./files/unzipped` });

        fileStream.on('data', chunk => {
            writeStream.write(chunk);
        });
        await new Promise(resolve => {
            fileStream.on('end', () => {
                writeStream.end();
                resolve();
            })
        })
        await new Promise(resolve => fileStream.on('close', () => {
            console.log('unzipped', file);
            resolve();
        }))

    }
};

export const unzipFiles = (req, res, next) => {
    console.log('in unzipFiles');
    fs.readdir('./files/downloads', async (err, files) => {
        if (err) {
            return console.log(err);
        } else {
            await new Promise(resolve => {
                unzip(files);
                console.log('done unzipping');
                resolve();
            })
        }
    })

    next();
}

const test = () => {
    console.log(fs.readFileSync(`./files/downloads/4.zip`));
}

// test();