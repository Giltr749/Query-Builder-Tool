import { createRequire } from "module";
const require = createRequire(import.meta.url);
const spawn = require('child_process').spawn;

export const createReport = async (req, res, next) => {
    const searchResults = res.locals.result;
    console.log(searchResults);
    const resultStrings = [];
    searchResults.forEach(result => {
        resultStrings.push(Object.values(result).join(','));
    });

    if (res.locals.result.length !== 0) {
        const pythonProcess = spawn('python3', ['middleware/createFile.py', searchResults]);
        console.log('creating report');
        pythonProcess.stdout.on('data', data => {
            console.log(data.toString());
        })
        pythonProcess.stderr.on('close', code => {
            console.log('python process exited with code ' + code);
            next();
        });
    }
    else {
        res.send('No data found');
    }
}
