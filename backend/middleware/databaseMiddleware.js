import parse from 'csv-parser';
import fs from 'fs';
import sqlite3 from 'sqlite3';
import csvHeaders from 'csv-headers';

const tblnm = 'events';
let csvfn;

const dbWifi = new sqlite3.Database('./files/databases/dbWifi.sqlite3');
dbWifi.on('error', err => {
    console.log(err);
    process.exit(-1);
});

const dbBt = new sqlite3.Database('./files/databases/dbBt.sqlite3');
dbBt.on('error', err => {
    console.log(err);
    process.exit(-1);
});

export const createTables = async (req, res, next) => {
    fs.readdir('./files/parsed', (err, files) => {
        if (err) throw err;
        else {
            createTable(files[1], dbWifi)
            createTable(files[0], dbBt);
        }
    });
    next();
}





const createTable = async (file, db) => {
    csvfn = `./files/parsed/${file}`
    const headers = await new Promise((resolve, reject) => {
        csvHeaders({
            file: csvfn,
            delimiter: ','
        },
            function (err, headers) {
                if (err) reject(err);
                else {
                    resolve(headers.map(hdr => {
                        return hdr.replace(/["]/g, '');
                    }));
                }
            });
    });

    // await new Promise((resolve, reject) => {
    //     db.run(`DROP TABLE IF EXISTS ${tblnm}`,
    //         [],
    //         err => {
    //             if (err) reject(err);
    //             else resolve();
    //         })
    // });

    const fixFieldName = (nm) => { return nm.replace(/["]/g, '_'); }

    const fields = headers.map(hdr => {
        return fixFieldName(hdr);
    });

    const schema = headers.map(field => {
        return `${fixFieldName(field)} TEXT`;
    });

    const questionMarks = headers.map(field => {
        return '?';
    });

    await new Promise((resolve, reject) => {
        db.run(`CREATE TABLE IF NOT EXISTS ${tblnm} ( ${schema.join(', ')} )`,
            [],
            err => {
                if (err) reject(err);
                else resolve();
            })
    });

    const parser = fs.createReadStream(csvfn).pipe(parse({
        delimiter: ',',
        columns: true,
        relax_column_count: true
    }));

    for await (const row of parser) {
        if (row['Email'] === '(Not Disclosed)') continue;

        let d = [];
        headers.forEach(hdr => {
            d.push(row[hdr]);
        });

        await new Promise((resolve, reject) => {
            db.run(`INSERT INTO ${tblnm} ( ${fields.join(', ')} ) VALUES ( ${questionMarks.join(', ')} )`, d,
                err => {
                    if (err) {
                        console.log(`${fields.join(', ')}`, d);
                        console.log(err);
                    }
                    else resolve();
                });
        });
    }
};

