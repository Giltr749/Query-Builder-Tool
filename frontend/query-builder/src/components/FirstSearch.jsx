import React, { useState } from 'react';
import axios from 'axios';

function FirstSearch({ startDate, setStartDate, endDate, setEndDate, cluster, setCluster, sensor, setSensor, results, setResults, setSecond }) {

    const [valid, setValid] = useState(true);

    const startChange = (e) => {
        setStartDate(e.target.value);
    }

    const endChange = (e) => {
        setEndDate(e.target.value);
    }

    const clusterChange = (e) => {
        setCluster(e.target.value);
    }

    const sensorChange = (e) => {
        setSensor(e.target.value);
    }

    const clickSearch = () => {
        if (startDate.length != 0 || endDate.length != 0 || cluster.length != 0) {
            setValid(true);
            const start = new Date(startDate).getTime();
            const end = new Date(endDate).getTime();
            const numOfRows = (end - start) / 3600000;
            const rows = [];
            for (let i = 0; i < numOfRows; i++) {
                rows[i] = new Date(start + i * 3600000 - 10800000)
                    .toISOString()
                    .substring(0, 13)
                    .replaceAll('-', '/')
                    .replaceAll('T', '/')
                    .replaceAll('/0', '/')
                if (sensor.length > 0) {
                    rows[i] = `${cluster}/${sensor}/${rows[i]}`
                }
            }
            if (sensor.length > 0) {
                const fileString = rows.join('.zip,') + '.zip';
                submitSensor(fileString);
            }
            else {
                submitCluster(cluster, rows);
            }
        }
        else {
            setValid(false);
            console.log('invalid input');
        }

    }

    const submitSensor = async (fileString) => {
        console.log('getting rows...');
        const response = await axios.get(`http://localhost:8080/sensorrows/?fileKey=${fileString}`);
        console.log(response.data);
        setResults(response.data.rows);

    }

    const submitCluster = async (cluster, rows) => {
        console.log('getting rows...');
        const response = await axios.post(`http://localhost:8080/clusterrows`, {
            cluster: cluster,
            files: rows
        });
        console.log(response.data);
        setResults(response.data.rows);
    }

    const toBuild = () => {
        setSecond(false);
    }

    return (
        <div>
            <div className='input-div'>
                <div>
                    <label>Start Date</label>
                    <input type='datetime-local' onChange={startChange} className='input' />
                </div>
                <div>
                    <label>End Date</label>
                    <input type='datetime-local' onChange={endChange} className='input' />
                </div>
            </div>
            <div className='input-div'>
                <div>
                    <label>Cluster</label>
                    <input type='text' onChange={clusterChange} className='input' />
                </div>
                <div>
                    <label>Sensor ID</label>
                    <input type='text' onChange={sensorChange} className='input' />
                </div>
            </div>
            {
                !valid &&
                <div style={{ color: 'red' }}>INVALID INPUT</div>
            }
            {
                results > 0 &&
                <>
                    <div>{`Found ${results} rows`}</div>
                    <button className='button' onClick={toBuild}>Build a query</button>
                </>
            }
            <button className='button' onClick={clickSearch}>Search</button>
        </div>
    );
}

export default FirstSearch;