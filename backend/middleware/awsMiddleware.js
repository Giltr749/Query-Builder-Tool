import 'dotenv/config'
import { createRequire } from "module";
const require = createRequire(import.meta.url);

import * as fs from 'fs';

const AWS = require('aws-sdk');

export const getS3File = async (req, res, next) => {
    console.log(req.query);
    if(req.query['fileKey'] === '.zip') {
        res.send('did not receive file key');
    }

    try {
        res.locals.exists = true;
        const fileKeys = req.query['fileKey'].split(',');
        AWS.config.update({
            accessKeyId: process.env.ACCESSKEYID,
            secretAccessKey: process.env.SECRETACCESSKEY,
            region: process.env.REGION
        });
        const s3 = new AWS.S3();
        const filesList = await listAllFiles();
        for await (let key of fileKeys) {
            const options = {
                Bucket: process.env.BUCKET,
                Key: key
            }
            if (filesList.includes(key)) {
                console.log('downloading', key);
                const fileStream = s3.getObject(options).createReadStream();
                const writeStream = fs.createWriteStream(`./files/downloads/${key.replaceAll('/', '_')}`);

                fileStream.on('data', chunk => {
                    writeStream.write(chunk);
                })
                await new Promise(resolve => {
                    fileStream.on('close', async () => {
                        writeStream.end();
                        resolve();
                    })
                })


            } else {
                console.log(`${key} does not exist`);
                res.locals.exists = false;
                continue
            }
        }
    } catch (err) {
        throw (err);
    }
    next();
};

export const listAllFiles = async () => {
    const s3 = new AWS.S3({
        region: process.env.REGION,
        accessKeyId: process.env.ACCESSKEYID,
        secretAccessKey: process.env.SECRETACCESSKEY
    });
    let isTruncated = true;
    let marker;
    const elements = [];
    while (isTruncated) {
        let params = {
            Bucket: process.env.BUCKET
        };
        if (marker)
            params.Marker = marker;
        try {
            const response = await s3.listObjects(params).promise();
            response.Contents.forEach(item => {
                elements.push(item.Key);
            });
            isTruncated = response.IsTruncated;
            if (isTruncated) {
                marker = response.Contents.slice(-1)[0].Key;
            }
        } catch (err) {
            throw err;
        }
    }
    console.log(elements);
    console.log(elements.length);
    return elements;
}
