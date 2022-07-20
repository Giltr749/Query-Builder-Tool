import { createRequire } from "module";
const require = createRequire(import.meta.url);

import * as fs from 'fs';
import { stringify } from 'csv-stringify/sync';

const indexes = require('../event_indexes.json');
const csv = require('csv-parser');

const createDbs = (resultWifi, resultBt) => {
    const wifiKeys = [];
    const btKeys = [];
    for (let i in indexes.wifi) {
        wifiKeys.push(indexes.wifi[i]);
    }
    for (let i in indexes.bluetooth) {
        btKeys.push(indexes.bluetooth[i]);
    }
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

const filterTest = async (fileName) => {
    const resultWifi = [];
    const resultBt = [];
    const fileStream = fs.createReadStream(`./files/unzipped/${fileName}`);

    fileStream
        .pipe(csv({ headers: false }))
        .on('data', row => {
            if (row['2'] === 'True') {
                let newRow = [];
                for (let col in row) {
                    newRow.push(row[col]);
                }
                resultWifi.push(newRow);
            } else {
                let newRow = [];
                for (let col in row) {
                    newRow.push(row[col]);
                }
                resultBt.push(newRow);
            }
        })
        .on('end', () => {
            createDbs(resultWifi, resultBt);
        })
}

// const filterCsv = async (fileName) => {
//     const resultWifi = [];
//     const resultBt = [];
//     const fileStream = fs.createReadStream(`./files/unzipped/${fileName}`)
//     const rl = readline.createInterface({
//         input: fileStream,
//         crlfDelay: Infinity
//     });
//     for await (let line of rl) {
//         let row = line.split(',')
//         row[2] === "True"
//             ? resultWifi.push(row)
//             : resultBt.push(row)
//     }

//     createDbs(resultWifi, resultBt);
// };

export const sortCsv = (req, res, next) => {
    console.log('in sortcsv');
    const resultWifi = [];
    const resultBt = [];
    fs.readdir('./files/unzipped', (err, files) => {
        console.log('sortCsv' + files);
        files.forEach(async (file) => {
            await filterTest(file);
        });
    });
    next();
};

