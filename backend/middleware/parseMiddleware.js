import { createRequire } from "module";
const require = createRequire(import.meta.url);

import * as fs from 'fs';
import { stringify } from 'csv-stringify/sync';

const indexes = require('../event_indexes.json');
const csv = require('csv-parser');
const spawn = require('child_process').spawn;


const createDbs = (resultWifi, resultBt) => {
    const wifiKeys = [];
    const btKeys = [];
    for (let i in indexes.wifi) {
        wifiKeys.push(indexes.wifi[i]);
    }
    for (let i in indexes.bluetooth) {
        btKeys.push(indexes.bluetooth[i]);
    }
    console.log('creating dbs');
    resultWifi.unshift(wifiKeys);
    resultBt.unshift(btKeys);
    const stringifiedWifi = stringify(resultWifi);
    const stringifiedBt = stringify(resultBt);
    fs.appendFileSync(`files/parsed/wifiEvents.csv`, stringifiedWifi, err => {
        return
    });
    fs.appendFileSync(`files/parsed/btEvents.csv`, stringifiedBt, err => {
        return
    })
}

const filterCsv = async (fileName) => {
    const resultWifi = [];
    const resultBt = [];
    const fileStream = fs.createReadStream(`./files/unzipped/${fileName}`);

    fileStream
        .pipe(csv({ headers: false }))
        .on('data', row => {
            if (row['2'] === 'True') {
                // let newRow = [];
                // for (let col in row) {
                //     newRow.push(row[col]);
                //     console.log('added row to wifi');
                console.log(row);

                // }
                // resultWifi.push(newRow);
            } else {
                // let newRow = [];
                // for (let col in row) {
                //     newRow.push(row[col]);
                //     console.log('added row to bt');
                console.log(row);
            }
            // resultBt.push(newRow);
            // }
        })
        .on('end', () => {
            createDbs(resultWifi, resultBt);
        })
}

export const sortCsv = (req, res, next) => {
    console.log('in sortcsv');
    const pythonProcess = spawn('python3', ['middleware/parse.py']);
    pythonProcess.stdout.on('data', data => {
        console.log(data);
    })
    pythonProcess.stderr.on('close', code => {
        console.log('python process exited with code ' + code);
        next();
    });
}
