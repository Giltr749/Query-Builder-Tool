import parse from 'csv-parser';
import fs from 'fs';
import sqlite3 from 'sqlite3';
// import csvHeaders from 'csv-headers';
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const indexes = require('../event_indexes.json');
const spawn = require('child_process').spawn;

const wifiHeaders = Object.keys(indexes.wifi).map(key => {
    return indexes.wifi[key]
});
const btHeaders = Object.keys(indexes.bluetooth).map(key => {
    return indexes.bluetooth[key]
});


const db = new sqlite3.Database('./files/databases/db.sqlite3');
db.on('error', err => {
    console.log(err);
    process.exit(-1);
});

export const createTables = async (req, res, next) => {
    await createTable();
    next();
}

const createTable = async () => {
    const fixFieldName = (nm) => { return nm.replace(/["]/g, '_'); }

    const wifiFields = wifiHeaders.map(hdr => {
        return fixFieldName(hdr)
    })
    const btFields = btHeaders.map(hdr => {
        return fixFieldName(hdr)
    })

    const wifiSchema = wifiHeaders.map(field => {
        return `${fixFieldName(field)} TEXT`
    })
    const btSchema = btHeaders.map(field => {
        return `${fixFieldName(field)} TEXT`
    })

    await new Promise((resolve, reject) => {
        db.run(`CREATE TABLE IF NOT EXISTS wifiEvents (${wifiSchema.join(', ')})`, [], err => {
            if (err) reject(err);
            else resolve();
        })
    });

    await new Promise((resolve, reject) => {
        db.run(`CREATE TABLE IF NOT EXISTS btEvents (${btSchema.join(', ')})`, [], err => {
            if (err) reject(err);
            else resolve();
        })
    });


}

export const insertData = async (req, res, next) => {
    const pythonProcess = spawn('python3', ['middleware/insert.py']);
    pythonProcess.stdout.on('data', data => {
        console.log(data);
    });
    pythonProcess.stderr.on('close', code => {
        console.log('python process exited with code ' + code);
    });
    
    next();
}

export const getData = async (req, res, next) => {
    res.locals.result = [];
    for (let queryElement of req.body.queries) {
        let query = '';
        if (req.body.queries.type === 'wifi') {
            query = `SELECT * FROM wifiEvents WHERE ${queryElement}`;
        }
        else {
            query = `SELECT * FROM btEvents WHERE ${queryElement}`;
        }
            await new Promise((resolve, reject) => {
                db.all(query, (err, rows) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                        res.send(err);
                    }
                    else {
                        res.locals.result.push(rows);
                        resolve(rows);
                    }
                })
            });
    }
    next();
};
