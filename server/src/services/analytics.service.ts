import { AnalyticsQueries } from "../queries/analytics.queries";
import { execute } from "../utils/mysql.connector";

//change input and type
export const getSubClassAmountsBetweenTimes = async (end_time: number, interval: number, bucket_amount: number, cluster_id: any, sensor_id: any) => {
    let result_dict = {};
    const bucket_size = interval * 60;
    const start_time = end_time - (bucket_amount * bucket_size);

    await execute<any>(AnalyticsQueries.GetSubClassAmountsBetweenTimes, [bucket_size, end_time, start_time, cluster_id, sensor_id]).then(result_list => {
        for (const row of result_list) {
            const ts = row.ts;
            const main_class = row.main_class;
            const sub_class = row.sub_class;
            const scene_related = row.scene_related;
            const device_set = new Set();
            const devices = JSON.parse(row['JSON_ARRAYAGG(devices)']);

            for (const device of devices) {
                device.forEach(item => device_set.add(item));
            }

            if (result_dict[ts]) {
                if (result_dict[ts][main_class]) {
                    if (result_dict[ts][main_class][sub_class]) {
                        result_dict[ts][main_class][sub_class][scene_related] = device_set.size;
                    } else {
                        result_dict[ts][main_class][sub_class] = {
                            [scene_related]: device_set.size
                        }
                    }
                } else {
                    result_dict[ts][main_class] = {
                        [sub_class]: {
                            [scene_related]: device_set.size
                        }
                    }
                }
            } else {
                result_dict[ts] = {
                    [main_class]: {
                        [sub_class]: {
                            [scene_related]: device_set.size
                        }
                    }
                }
            }

            const start = Math.floor(start_time / bucket_size) * bucket_size;
            const end = Math.floor(end_time / bucket_size) * bucket_size;

            for (let ts = start; ts <= end; ts = ts + bucket_size) {
                if (!result_dict[ts]) {
                    result_dict[ts] = {
                        [main_class]: {}
                    };
                }
            }
        };
    })
    return result_dict;
};

export const getMainClassAmountsBetweenTimes = async (end_time: number, interval: number, bucket_amount: number, cluster_id: any, sensor_id: any) => {
    let result_dict = {};
    const bucket_size = interval * 60;
    const start_time = end_time - (bucket_amount * bucket_size);

    await execute<any>(AnalyticsQueries.GetMainClassAmountsBetweenTimes, [bucket_size, end_time, start_time, cluster_id, sensor_id]).then(result_list => {
        for (const row of result_list) {
            const ts = row.ts;
            const main_class = row.main_class;
            const scene_related = row.scene_related;
            const device_set = new Set();
            const devices = JSON.parse(row['JSON_ARRAYAGG(devices)']);

            for (const device of devices) {
                device.forEach(item => device_set.add(item));
            }

            if (result_dict[ts]) {
                if (result_dict[ts][main_class]) {
                    result_dict[ts][main_class][scene_related] = device_set.size;
                } else {
                    result_dict[ts][main_class] = {
                        [scene_related]: device_set.size
                    }
                }

            } else {
                result_dict[ts] = {
                    [main_class]: {
                        [scene_related]: device_set.size
                    }
                }
            }

            const start = Math.floor(start_time / bucket_size) * bucket_size;
            const end = Math.floor(end_time / bucket_size) * bucket_size;

            for (let ts = start; ts <= end; ts = ts + bucket_size) {
                if (!result_dict[ts]) {
                    result_dict[ts] = {};
                }
            }
        };
    })
    return result_dict;
};

export const getAmountsBetweenTimes = async (end_time: number, interval: number, bucket_amount: number, cluster_id: any, sensor_id: any) => {
    let result_dict = {};
    const bucket_size = interval * 60;
    const start_time = end_time - (bucket_amount * bucket_size);

    await execute<any>(AnalyticsQueries.GetAmountsBetweenTimes, [bucket_size, end_time, start_time, cluster_id, sensor_id]).then(result_list => {
        for (const row of result_list) {
            const ts = row.ts;
            const scene_related = row.scene_related;
            const device_set = new Set();

            const devices = JSON.parse(row['JSON_ARRAYAGG(devices)']);

            for (const device of devices) {
                device.forEach(item => device_set.add(item));
            }
            if (result_dict[ts]) {
                result_dict[ts][scene_related] = [device_set.size];

            } else {
                result_dict[ts] = {
                    [scene_related]: [device_set.size]
                }
            }

            const start = Math.floor(start_time / bucket_size) * bucket_size;
            const end = Math.floor(end_time / bucket_size) * bucket_size;

            for (let ts = start; ts <= end; ts = ts + bucket_size) {
                if (!result_dict[ts]) {
                    result_dict[ts] = {};
                }
            }
        };
    });
    return result_dict;
};

export const getClustersAndSensors = async () => {
    let result_dict = {};
    await execute<any>(AnalyticsQueries.GetClustersAndSensors, []).then(result_list => {
        for (const row of result_list) {
            const cluster_id: string = row.cluster_id;
            const sensor_id: string = row.sensor_id;

            if (result_dict[cluster_id]) {
                let sensors = result_dict[cluster_id];
                sensors.push(sensor_id);
                result_dict[cluster_id] = sensors;
            } else {
                result_dict[cluster_id] = [sensor_id];
            }
        }
    });
    return result_dict;
};

