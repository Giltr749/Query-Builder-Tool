import 'dotenv/config';
import express from 'express';
import { getS3File, listAllFiles } from './middleware/awsMiddleware.js';
import { unzipFiles } from './middleware/unzipMiddleware.js';
import { sortCsv } from './middleware/parseMiddleware.js';
// import { createTables, getData } from './middleware/databaseMiddleware.js';
import { createTables, insertData, getData } from './middleware/newDatabaseMiddleware.js';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();

app.use(bodyParser.json());

app.use(cors());

app.get('/download',createTables, getS3File, unzipFiles, sortCsv, insertData, (req, res) => {
    res.locals.exists == true
        ? res.send('downloaded!')
        : res.send('Files do not exist')
})

app.get('/unzip', unzipFiles, (req, res) => {
    res.send('unzipped!');
})

app.get('/sort', sortCsv, (req, res) => {
    res.send('done!');
});

app.get('/table', insertData, (req, res) => {
    res.send('done!');
})

app.post('/data', getData, (req, res) => {
    res.send(res.locals.result);
})

app.get('/list', (req, res) => {
    res.locals.result = listAllFiles();
    res.send(res.locals.result);
});

app.listen(process.env.PORT, () => {
    console.log(`listening @ ${process.env.PORT}`);
});