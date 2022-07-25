import 'dotenv/config';
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const fs = require('fs');

const jsonFile = require('./event_indexes.json');

const asdf = process.env.EVENTINDEXES;

const dsa = JSON.parse(asdf);

// console.log(dsa);

for (let i in dsa.wifi) {
    fs.writeFile('./event_indexes.json', asdf)
}
for (let i in dsa.bluetooth) {
    jsonFile.writeFile(i);
}