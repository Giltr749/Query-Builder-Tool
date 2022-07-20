import * as fs from 'fs';
import * as unzipper from 'unzipper';

const unzip = async (files) => {
    const promises = []
    for await (let file of files) {
        // console.log(`in ${file}`);
        
        const fileStream = fs.createReadStream(`./files/downloads/${file}`);
        const writeStream = unzipper.Extract({ path: `./files/unzipped` });

        fileStream.on('data', chunk => {
            writeStream.write(chunk);
        });
        await new Promise(resolve => {
            fileStream.on('end', () => {
                writeStream.end();
                resolve();
            })
        })
        await new Promise(resolve => fileStream.on('finish', resolve()));
    }
};

export const unzipFiles = (req, res, next) => {
    fs.readdir('./files/downloads', async (err, files) => {
        if (err) {
            return console.log(err);
        } else {
            await unzip(files);
        }
    })
    console.log('Done unzipping');
    next();
}

const test = () => {
    console.log(fs.readFileSync(`./files/downloads/4.zip`));
}

// test();