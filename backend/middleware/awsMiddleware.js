import 'dotenv/config'
import { createRequire } from "module";
const require = createRequire(import.meta.url);

import * as fs from 'fs';

const AWS = require('aws-sdk');

export const getS3File = async (req, res, next) => {
    console.log(req.query);
    if (req.query['fileKey'] === '.zip') {
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
        const downloaded = fs.readdirSync('./files/downloads')
        for await (let key of fileKeys) {
            if (!downloaded.includes(key.replaceAll('/', '_'))) {
                console.log('included');
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

        }
    } catch (err) {
        throw (err);
    }
    next();
};

export const getCluster = async (req, res, next) => {
    try {
        const files = req.body.files;
        const cluster = req.body.cluster;
        console.log(cluster);
        console.log(files);
        AWS.config.update({
            accessKeyId: process.env.ACCESSKEYID,
            secretAccessKey: process.env.SECRETACCESSKEY,
            region: process.env.REGION
        });
        const s3 = new AWS.S3();
        const filesList = await listAllFiles(req.body.cluster);
        console.log(filesList);
        const downloaded = fs.readdirSync('./files/downloads');
        const re = `${new RegExp('.')}`
        const toDownload = []
        for (let file of filesList) {
            for (let key of files) {
                if (file.endsWith(`${key}.zip`)) {
                    toDownload.push(file);
                }
            }
        }
        console.log(toDownload);
        for await (let file of toDownload) {
            if (!downloaded.includes(file.replaceAll('/', '_'))) {
                const options = {
                    Bucket: process.env.BUCKET,
                    Key: file
                }
                    console.log('downloading', file);
                    const fileStream = s3.getObject(options).createReadStream();
                    const writeStream = fs.createWriteStream(`./files/downloads/${file.replaceAll('/', '_')}`);

                    fileStream.on('data', chunk => {
                        writeStream.write(chunk);
                    })
                    await new Promise(resolve => {
                        fileStream.on('close', async () => {
                            writeStream.end();
                            resolve();
                        })
                    })  
            }
        }

    }
    catch (err) {
        throw (err);
    }
    next();
}

export const listAllFiles = async (prefix = null) => {
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
        if (prefix)
            params.Prefix = prefix;
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
    // console.log(elements);
    console.log(elements.length, ' files found');
    return elements;
}
