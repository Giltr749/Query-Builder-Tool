import sqlite3 from 'sqlite3';
import { createRequire } from "module";
import { spawn } from 'child_process';
import {indexes} from '../../event_indexes'
// const requires = createRequire(import.meta.url);
// const indexes = requires('../event_indexes.json');


const wifiHeaders = Object.keys(indexes.wifi).map(key => {
    return indexes.wifi[key]
});
const btHeaders = Object.keys(indexes.bluetooth).map(key => {
    return indexes.bluetooth[key]
});

const db = new sqlite3.Database('./src/files/databases/db.sqlite3');
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
    console.log('inserting data to database');
    const pythonProcess = spawn('python3', ['middleware/insert.py']);
    pythonProcess.stdout.on('data', data => {
        console.log(data.toString());
    });
    pythonProcess.stderr.on('close', code => {
        console.log('python process exited with code ' + code);
        next();
    });

}

export const getDataPython = async (req, res, next) => {
    console.log('getting data from database');
    let wifiQuery = '';
    let bleQuery = '';
    let wifiKeys = '';
    let bleKeys = '';
    if (req.body.wifiQuery.length > 0) {
        const wifiConcatQuery = req.body.wifiQuery.join(' OR ');
        wifiQuery = `SELECT * FROM wifiEvents WHERE ${wifiConcatQuery}`;
        wifiKeys = Object.values(indexes['wifi']).join(',');
        console.log(wifiKeys);
    }
    if (req.body.bleQuery.length > 0) {
        const bleConcatQuery = req.body.bleQuery.join(' OR ');
        bleQuery = `SELECT * FROM btEvents WHERE ${bleConcatQuery}`;
        bleKeys = Object.values(indexes['bluetooth']).join(',');
        console.log(bleKeys);
    }
    // console.log('query:', query);
    const pythonProcess = spawn('python3', ['middleware/getData.py', wifiQuery, bleQuery, wifiKeys, bleKeys]);
    console.log('creating report');
    pythonProcess.stdout.on('data', data => {
        console.log(data.toString());
    })
    pythonProcess.stderr.on('close', code => {
        console.log('python process exited with code ' + code);
        next();
    });
}

export const getData = async (req, res, next) => {
    console.log('getting data from database');
    res.locals.result = [];
    const concatQuery = req.body.queries.join(' OR ')
    let query = '';
    if (req.body.queries.type === 'wifi') {
        query = `SELECT * FROM wifiEvents WHERE ${concatQuery}`;
    }
    else {
        query = `SELECT * FROM btEvents WHERE ${concatQuery}`;
    }
    await new Promise((resolve, reject) => {
        db.all(query, (err, rows) => {
            if (err) {
                console.log(err);
                reject(err);
                res.send(err);
            }
            else {
                res.locals.result = rows;
                resolve(rows);
            }
        })
    });
    next();

};
