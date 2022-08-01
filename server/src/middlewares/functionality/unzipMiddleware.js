import spawn from 'child_process'

export const unzipFiles = (req, res, next) => {
    console.log('in unzipFiles');
    const pythonProcess = spawn('python3', ['middleware/unzip.py']);
    pythonProcess.stdout.on('data', data => {
        console.log(data.toString());
    })
    pythonProcess.stderr.on('close', code => {
        console.log('python process exited with code ' + code);
        next();
    })
}


