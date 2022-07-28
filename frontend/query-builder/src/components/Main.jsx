import React, { useState } from 'react';
import QueryBuilder from './QueryBuilder.jsx';
import axios from 'axios';
import FileDownload from 'js-file-download';
import '../styles/Main.css';
import FirstSearch from './FirstSearch.jsx';
import SecondSearch from './SecondSearch.jsx';


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
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [second, setSecond] = useState(false);

    const clickSubmit = async () => {
        setLoading(true);
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
        setLoading(false);
    }

    const submit = async (rows) => {
        const fileString = rows.join('.zip,') + '.zip';
        console.log('downloading...');
        const response = await axios({
            method: 'post',
            url: `http://localhost:8080/download/?fileKey=${fileString}`,
            data: query,
            responseType: 'blob'
        });
        if (response.data) {
            FileDownload(response.data, 'report.csv');
        }
    }

    const clickAdd = () => {
        if (subQuery.length != 0) {
            const tempQuery = structuredClone(query);
            tempQuery.queries.push(subQuery);
            setQuery(tempQuery);
        }
    }

    return (
        <div className='main-div'>
            <FirstSearch startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} cluster={cluster} setCluster={setCluster} sensor={sensor} setSensor={setSensor} results={results} setResults={setResults} setSecond={setSecond}/>
            {
                second > 0 &&
                <SecondSearch query={query} setQuery={setQuery} subQuery={subQuery} setSubQuery={setSubQuery} wifi={wifi} setWifi={setWifi} clickAdd={clickAdd} clickSubmit={clickSubmit}/>
            }
        </div>
    );
}

export default Main;