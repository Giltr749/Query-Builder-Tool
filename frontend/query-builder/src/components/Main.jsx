import React, { useState } from 'react';
import QueryBuilder from './QueryBuilder.jsx'
import axios from 'axios'


function Main(props) {

    const [query, setQuery] = useState({
        queries: [],
        type: 'wifi'
    });
    const [subQuery, setSubQuery] = useState('');
    const [cluster, setCluster] = useState('');
    const [sensor, setSensor] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [wifi, setWifi] = useState('wifi');


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

    const clickSubmit = async () => {
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
            rows[i] = `${cluster}/${sensor}/${rows[i]}`
        }
        console.log(query);
        await submit(rows)
    }

    const submit = async (rows) => {
        const fileString = rows.join('.zip,') + '.zip';
        console.log('downloading...');
        const responseGet = await axios.get(`http://localhost:8080/download/?fileKey=${fileString}`);
        console.log(responseGet.data);
        if (responseGet.data === 'downloaded!') {
            console.log('creating table');
            const responseTable = await axios.get(`http://localhost:8080/table`);
            console.log(responseTable.data);

            // if (responseTable.data === 'done!') {
            //     console.log('getting data');
            //     const responseQuery = await axios.post(`http://localhost:8080/data`, {
            //         queries: query
            //     });
            //     console.log(responseQuery.data);
            // }
        }
        // }
        // else{
        //     console.log('ERROR');
        // }
    }

    const clickAdd = () => {
        if (subQuery.length != 0) {
            const tempQuery = structuredClone(query);
            tempQuery.queries.push(subQuery);
            setQuery(tempQuery);
        }
    }

    return (
        <div>
            <label>Start Date</label>
            <input type='datetime-local' onChange={startChange} />
            <label>End Date</label>
            <input type='datetime-local' onChange={endChange} />
            <label>Cluster</label>
            <input type='text' onChange={clusterChange} />
            <label>Sensor ID</label>
            <input type='text' onChange={sensorChange} />
            <QueryBuilder query={query} setQuery={setQuery} subQuery={subQuery} setSubQuery={setSubQuery} wifi={wifi} setWifi={setWifi} />
            <button onClick={clickAdd}>Add</button>
            <button onClick={clickSubmit}>Submit</button>
            {
                query.queries.map((item, index) => (
                    <div key={index}>{item}</div>
                ))
            }
        </div>
    );
}

export default Main;