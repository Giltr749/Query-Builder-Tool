import * as fs from 'fs';

import { createRequire } from "module";
const require = createRequire(import.meta.url);

const express = require('express')
const { spawn } = require('child_process');
const app = express()
const port = 3000
app.get('/', (req, res) => {

    const pythonProcess = spawn('python3', ['middleware/parse.py']);
    pythonProcess.stdout.on('data', data => {
        // console.log(data);
    })
        .on('close', code => {
            console.log('done', code);
        })

})
app.listen(port, () => console.log(`Example app listening on port 
${port}!`))