import Logger from "../middlewares/logger/winston";
import { checkAuthenticated } from "../middlewares/authentication/authentication.middleware";
import { getAmountsBetweenTimes, getClustersAndSensors, getMainClassAmountsBetweenTimes, getSubClassAmountsBetweenTimes } from "../services/analytics.service";
import { getPermissionNamesByUserEmail } from "../services/permission.service";
import { hasAutorisation } from "../middlewares/autorisation/autorisation.middleware";
import { createTables, insertData, getDataPython } from '../middlewares/functionality/newDatabaseMiddleware';
import { getS3File, getCluster } from '../middlewares/functionality/awsMiddleware';
import { unzipFiles } from '../middlewares/functionality/unzipMiddleware';
import { sortCsv, countRows } from '../middlewares/functionality/parseMiddleware';


var express = require('express');
var router = express.Router();

router.post('/sensor', createTables, getS3File, unzipFiles, sortCsv, insertData, getDataPython, (req, res) => {
    res.locals.exists == true
        ? res.download(`./src/files/toSend/report.csv`)
        : res.send('Files do not exist')
})

router.post('/cluster', createTables, getCluster, unzipFiles, sortCsv, insertData, getDataPython, (req, res) => {
    res.locals.exists == true
        ? res.download(`./src/files/toSend/report.csv`)
        : res.send('Files do not exist')
})

router.get('/sensorrows', getS3File, unzipFiles, countRows, (req, res) => {
    const rows = res.locals.rows;
    console.log(rows, ' rows');
    res.send({
        "rows": rows
    })
})

router.post('/clusterrows', getCluster, unzipFiles, countRows, (req, res) => {
    const rows = res.locals.rows
    res.send({
        "rows": rows
    });
})

// EXAMPLE AS SET UP IN THE ANALYTICS DASHBOARD

// router.get('/buckets/sub_classes', checkAuthenticated, hasAutorisation, (req: any, res: any) => {
//     const endtime = req.query.endtime;
//     const interval = req.query.interval;
//     const amount = req.query.amount;
//     const cluster_id = req.query.cluster_id;
//     const sensor_id = req.query.sensor_id;


//     try {
//         getSubClassAmountsBetweenTimes(endtime, interval, amount, cluster_id, sensor_id).then(result => {
//             res.send(result);
//         });
//     } catch (error) {
//         Logger.error("Couldn't get sub class buckets");
//     }
// });

// router.get('/buckets/main_classes', checkAuthenticated, hasAutorisation, (req: any, res: any) => {
//     const endtime = req.query.endtime;
//     const interval = req.query.interval;
//     const amount = req.query.amount;
//     const cluster_id = req.query.cluster_id;
//     const sensor_id = req.query.sensor_id;

//     try {
//         getMainClassAmountsBetweenTimes(endtime, interval, amount, cluster_id, sensor_id).then(result => {
//             res.send(result);
//         });
//     } catch (error) {
//         Logger.error("Couldn't get main class buckets");
//     }
// });

// router.get('/buckets', checkAuthenticated, hasAutorisation, (req: any, res: any) => {
//     const endtime = req.query.endtime;
//     const interval = req.query.interval;
//     const amount = req.query.amount;
//     const cluster_id = req.query.cluster_id;
//     const sensor_id = req.query.sensor_id;

//     try {
//         getAmountsBetweenTimes(endtime, interval, amount, cluster_id, sensor_id).then(result => {
//             res.send(result);
//         });
//     } catch (error) {
//         Logger.error("Couldn't get buckets");
//     }
// });

// router.get('/get_clusters_and_sensors', checkAuthenticated, (req: any, res: any) => {
//     try {
//         getClustersAndSensors().then(result => {
//             let permissions = [];
//             const filteredResult = {};

//             getPermissionNamesByUserEmail(req.session.passport.user).then(perm => {
//                 for(const permission of perm){
//                     permissions.push(permission.permission_name)
//                 }                
//                 Object.entries(result).filter(x => {
//                     if (permissions.includes(x[0])) {
//                         filteredResult[x[0]] = x[1];
//                     }
//                 });
//                 res.send(filteredResult);
//             });
//         });
//     } catch (error) {
//         Logger.error("Couldn't get clusters and sensors");
//     }
// });

module.exports = router;