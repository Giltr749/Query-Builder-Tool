export const AnalyticsQueries = {
    GetSubClassAmountsBetweenTimes: `
    SELECT main_class, sub_class, scene_related, JSON_ARRAYAGG(devices), (bucket_time - bucket_time mod ?) as ts
    FROM device_counter_v2
    WHERE bucket_time <= ? AND bucket_time > ? AND cluster_id = ? AND sensor_id = ?
    GROUP BY ts, main_class, sub_class, scene_related
    `,
    GetMainClassAmountsBetweenTimes: `
    SELECT main_class, scene_related, JSON_ARRAYAGG(devices), (bucket_time - bucket_time mod ?) as ts
    FROM device_counter_v2
    WHERE bucket_time <= ? AND bucket_time > ? AND cluster_id = ? AND sensor_id = ?
    GROUP BY ts, main_class, scene_related
    `,

    GetAmountsBetweenTimes: `
    SELECT scene_related, JSON_ARRAYAGG(devices), (bucket_time - bucket_time mod ?) as ts
    FROM device_counter_v2
    WHERE bucket_time <= ? AND bucket_time > ? AND cluster_id = ? AND sensor_id = ?
    GROUP BY ts, scene_related
    `,

    GetClustersAndSensors: `
    SELECT cluster_id, sensor_id
    FROM device_counter_v2
    GROUP BY cluster_id, sensor_id`
}