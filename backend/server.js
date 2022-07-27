import 'dotenv/config';
import express from 'express';
import { getS3File, listAllFiles } from './middleware/awsMiddleware.js';
import { unzipFiles } from './middleware/unzipMiddleware.js';
import { sortCsv } from './middleware/parseMiddleware.js';
import { createTables, insertData, getData, getDataPython } from './middleware/newDatabaseMiddleware.js';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';

const app = express();

app.use(bodyParser.json());

app.use(cors());

app.post('/download',createTables, getS3File, unzipFiles, sortCsv, insertData, getDataPython, (req, res) => {
    res.locals.exists == true
        ?  res.download(`./files/toSend/report.csv`)
        : res.send('Files do not exist')
})

app.post('/data', getDataPython, (req, res) => {
    fs.readdir('./files/toSend', (err, files) => {
        if (err) {
            console.log(err);
            res.send(err);
        }
        else {
            if (files.length > 0) {
                res.download(`./files/toSend/${files[0]}`);
            }
            else {
                res.send('problem creating report')
            }
        }
    })
})

app.listen(process.env.PORT, () => {
    console.log(`listening @ ${process.env.PORT}`);
});

