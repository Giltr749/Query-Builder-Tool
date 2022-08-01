import 'dotenv/config';
import express from 'express';
import { getS3File, getCluster } from './middleware/awsMiddleware.js';
import { unzipFiles } from './middleware/unzipMiddleware.js';
import { countRows, sortCsv } from './middleware/parseMiddleware.js';
import { createTables, insertData, getData, getDataPython } from './middleware/newDatabaseMiddleware.js';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';

const app = express();

app.use(bodyParser.json());

app.use(cors());

app.post('/sensor', createTables, getS3File, unzipFiles, sortCsv, insertData, getDataPython, (req, res) => {
    res.locals.exists == true
        ? res.download(`./files/toSend/report.csv`)
        : res.send('Files do not exist')
})

app.post('/cluster', createTables, getCluster, unzipFiles, sortCsv, insertData, getDataPython, (req, res) => {
    res.locals.exists == true
        ? res.download(`./files/toSend/report.csv`)
        : res.send('Files do not exist')
})

app.get('/sensorrows', getS3File, unzipFiles, countRows, (req, res) => {
    const rows = res.locals.rows;
    console.log(rows, ' rows');
    res.send({
        "rows": rows
    })
})

app.post('/clusterrows', getCluster, unzipFiles, countRows, (req, res) => {
    const rows = res.locals.rows
    res.send({
        "rows": rows
    });
})

app.listen(process.env.PORT, () => {
    console.log(`listening @ ${process.env.PORT}`);
});

