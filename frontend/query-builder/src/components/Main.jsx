import React, { useState } from 'react';
import QueryBuilder from './QueryBuilder.jsx'
import axios from 'axios'


function Main(props) {

    const [query, setQuery] = useState('');
    const [cluster, setCluster] = useState('');
    const [sensor, setSensor] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [dateArr, setDatesArr] = useState([]);

    const startChange = (e) => {
        // const dateString = e.target.value.substring(0, 10)
        // const timeString = e.target.value.substring(11, 13)
        // const dateTimeString = (dateString + 'T' + timeString + ':00:00.000')
        setStartDate(e.target.value);

    }

    const endChange = (e) => {
        // const dateString = e.target.value.substring(0, 10)
        // const timeString = e.target.value.substring(11, 13)
        // const dateTimeString = (dateString + 'T' + timeString + ':00:00.000')
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
        await submit(rows)
    }

    const submit = async (rows) => {
        const fileString = rows.join('.zip,') + '.zip';
        const response = await axios.get(`http://localhost:8080/download/?fileKey=${fileString}`);
        console.log(response.data);
        // await axios.get('http://localhost:8080/sort')
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
            <QueryBuilder query={query} setQuery={setQuery} />
            <button onClick={clickSubmit}>Submit</button>
        </div>
    );
}

export default Main;