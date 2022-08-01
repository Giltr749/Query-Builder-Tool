import React, { useState } from 'react';
import QueryBuilder from './QueryBuilder.jsx';
import axios from 'axios';
import FileDownload from 'js-file-download';
import '../styles/Main.css';
import FirstSearch from './FirstSearch.jsx';
import SecondSearch from './SecondSearch.jsx';


function Main(props) {

    const [wifiQuery, setWifiQuery] = useState([]);
    const [bleQuery, setBleQuery] = useState([]);
    const [subQuery, setSubQuery] = useState('');
    const [cluster, setCluster] = useState('');
    const [sensor, setSensor] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [wifi, setWifi] = useState('wifi');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [second, setSecond] = useState(false);


    const submitSensor = async (fileString, wifi = [], ble = []) => {
        console.log('downloading...');
        const response = await axios({
            method: 'post',
            url: `http://localhost:8080/app/sensor/?fileKey=${fileString}`,
            data: {
                wifiQuery: wifi,
                bleQuery: ble
            },
            responseType: 'blob'
        });
        if (response.data) {
            FileDownload(response.data, 'report.csv');
        }
    }

    const submitCluster = async (fileString, wifi = [], ble = []) => {
        console.log('getting rows...');
        const response = await axios({
            method: 'post',
            url: `http://localhost:8080/app/cluster`,
            data: {
                fileString: fileString,
                cluster: cluster,
                wifiQuery: wifi,
                bleQuery: ble
            },
            responseType: 'blob'
        });
        if (response.data) {
            FileDownload(response.data, 'report.csv');
        }
    }

    const clickSubmit = async () => {
        if (startDate.length == 0 || endDate.length == 0 || cluster.length == 0) {
            console.log('invalid input');
        }
        else {
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
                if (sensor.length > 0) {
                    rows[i] = `${cluster}/${sensor}/${rows[i]}`
                }
            }
            if (sensor.length > 0) {
                const fileString = rows.join('.zip,') + '.zip';
                if (wifiQuery.length > 0 || bleQuery.length > 0) {
                    submitSensor(fileString, wifiQuery, bleQuery);
                }
                else {
                    submitSensor(fileString);
                }
            }
            else {
                const fileString = rows;
                console.log('rows');
                console.log(fileString);
                if (wifiQuery.length > 0 || bleQuery.length > 0) {
                    submitCluster(fileString, wifiQuery, bleQuery);
                }
                else {
                    submitCluster(fileString);
                }
            }
            setLoading(false);
        }
    }


    return (
        <div className='main-div'>
            <FirstSearch startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} cluster={cluster} setCluster={setCluster} sensor={sensor} setSensor={setSensor} results={results} setResults={setResults} setSecond={setSecond} />
            <div>
                <label>WiFi</label>
                <SecondSearch type={'wifi'} subQuery={subQuery} setSubQuery={setSubQuery} wifi={wifi} setWifi={setWifi} wifiQuery={wifiQuery} setWifiQuery={setWifiQuery} bleQuery={bleQuery} setBleQuery={setBleQuery} />
                <label>BLE</label>
                <SecondSearch type={'ble'} subQuery={subQuery} setSubQuery={setSubQuery} wifi={wifi} setWifi={setWifi} wifiQuery={wifiQuery} setWifiQuery={setWifiQuery} bleQuery={bleQuery} setBleQuery={setBleQuery} />
            </div>
            <button className='button' onClick={clickSubmit}>Submit</button>
        </div>
    );
}

export default Main;