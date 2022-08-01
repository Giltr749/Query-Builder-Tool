import { indexes } from "../../event_indexes";
import { spawn } from "child_process";

export const sortCsv = (req, res, next) => {
    console.log('in sortcsv');
    const pythonProcess = spawn('python3', ['middleware/parse.py', indexes]);
    pythonProcess.stdout.on('data', data => {
        console.log(data.toString());
    })
    pythonProcess.stderr.on('close', code => {
        console.log('python process exited with code ' + code);
        next();
    });
}

export const countRows = (req, res, next) => {
    console.log('counting rows');
    const pythonProcess = spawn('python3', ['middleware/countRows.py', 'files/unzipped']);
    pythonProcess.stdout.on('data', data => {
        res.locals.rows = +data.toString();
        console.log('number of rows:', data.toString());
    })
    pythonProcess.stderr.on('close', code => {
        console.log('python process exited with code ' + code);
        next();
    });
}
