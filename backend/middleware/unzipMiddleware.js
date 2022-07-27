import * as fs from 'fs';
import * as unzipper from 'unzipper';
import { sortCsv } from './parseMiddleware.js';

import { createRequire } from "module";
const require = createRequire(import.meta.url);

const spawn = require('child_process').spawn;


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
    // fs.readdir('./files/downloads', async (err, files) => {
    //     if (err) {
    //         return console.log(err);
    //     } else {
    //         await new Promise(resolve => {
    //             unzip(files);
    //             console.log('done unzipping');
    //             resolve();
    //         })
    //     }
    // })

    const pythonProcess = spawn('python3', ['middleware/unzip.py']);
    pythonProcess.stdout.on('data', data => {
        console.log(data.toString());
    })
    pythonProcess.stderr.on('close', code => {
        console.log('python process exited with code ' + code);
        next();
    })

}
