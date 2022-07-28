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

app.post('/download', createTables, getS3File, unzipFiles, sortCsv, insertData, getDataPython, (req, res) => {
    res.locals.exists == true
        ? res.download(`./files/toSend/report.csv`)
        : res.send('Files do not exist')
})

app.get('/rows', getS3File, unzipFiles, countRows, (req, res) => {
    const rows = res.locals.rows;
    console.log(rows, ' rows');
    res.send({
        "rows": rows
    })
})

app.post('/cluster', getCluster, (req, res) => {
    const results = res.locals.results
    res.send({results});
})

app.listen(process.env.PORT, () => {
    console.log(`listening @ ${process.env.PORT}`);
});

