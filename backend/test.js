import parse from 'csv-parser';
import fs from 'fs';
import sqlite3 from 'sqlite3'
import csvHeaders from 'csv-headers';

const dbfn = './database.db';
const tblnm = 'events';
const csvfn = './files/parsed/btEvents.csv';

const headers = await new Promise((resolve, reject) => {
    csvHeaders({
        file      : csvfn,
        delimiter : ','
    }, function(err, headers) {
        if (err) reject(err);
        else {
            resolve(headers.map(hdr => {
                // Sometimes header names are :- "Long Header Name"
                // We need to remove the "-marks
                return hdr.replace(/["]/g, '');
            }));
        }
    });
});

const db = new sqlite3.Database(dbfn);
db.on('error', err => { 
    console.log(err);
    process.exit(-1);
});
// db.on('trace', sql => {
//     console.log(sql);
// });

await new Promise((resolve, reject) => {
    db.run(`DROP TABLE IF EXISTS ${tblnm}`,
    [ ],
    err => {
        if (err) reject(err);
        else resolve();
    })
});

const fixfieldnm = (nm) => { return nm.replace(/[ "]/g, '_'); }

// Convert header names into names suitable for database schema
const fields = headers.map(hdr => {
    return fixfieldnm(hdr);
});
// console.log(fields);

// Convert fields array into one with TEXT data type
const schema = headers.map(field => {
    return `${fixfieldnm(field)} TEXT`;
});
// console.log(schema);
// console.log(schema.join(', '));

// Generate an array of question markes for use in prepared statements
const questionMarks = headers.map(field => {
    return '?';
});
// console.log(questionMarks);
// console.log(questionMarks.join(', '));

await new Promise((resolve, reject) => {
    // console.log(`about to create CREATE TABLE IF NOT EXISTS ${tblnm} ( ${fields} )`);
    db.run(`CREATE TABLE IF NOT EXISTS ${tblnm} ( ${schema.join(', ')} )`,
    [ ],
    err => {
        if (err) reject(err);
        else resolve();
    })
});

// Read the CSV file using Node.js streaming
const parser = fs.createReadStream(csvfn).pipe(parse({
    delimiter: ',',
    columns: true,
    relax_column_count: true
}));

// Receive each row of the CSV file, insert into database
for await (const row of parser) {

    // Possibly there is custom processing required,
    // For example you might know of certain fields, and
    // of certain constraints.  In this case we might know
    // that certain records are to be skipped.
    if (row['Email'] === '(Not disclosed)') continue;

    let d = [];
    headers.forEach(hdr => {
        d.push(row[hdr]);
    });
    await new Promise((resolve, reject) => {
        db.run(`INSERT INTO ${tblnm} ( ${fields.join(', ')} )
                VALUES ( ${questionMarks.join(', ')} )`, d,
        err => {
            if (err) {
                console.log(`${fields.join(', ')}`, d);
                console.error(err);
                /* reject(err); */ resolve();
            }
            else resolve();
        });
    });
}

db.close(); 