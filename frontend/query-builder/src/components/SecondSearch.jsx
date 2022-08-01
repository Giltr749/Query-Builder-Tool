import React from 'react';
import QueryBuilder from './QueryBuilder.jsx';
import '../styles/SecondSearch.css';

function SecondSearch({ type, subQuery, setSubQuery, wifi, setWifi, wifiQuery, setWifiQuery, bleQuery, setBleQuery }) {

    const clickAdd = () => {
        if (subQuery.length != 0) {
            if (type === 'wifi') {
                const tempQuery = [...wifiQuery];
                tempQuery.push(subQuery);
                setWifiQuery(tempQuery);
            }
            else {
                const tempQuery = [...bleQuery];
                tempQuery.push(subQuery);
                setBleQuery(tempQuery);
            }
        }
    }

    return (
        <div className='querybuilder-div'>
            <QueryBuilder type={type} subQuery={subQuery} setSubQuery={setSubQuery} wifi={wifi} setWifi={setWifi} wifiQuery={wifiQuery} setWifiQuery={setWifiQuery} bleQuery={bleQuery} setBleQuery={setBleQuery} />
            <button className='button' onClick={clickAdd}>Add</button>
            {
                type === 'wifi' 
                ? wifiQuery.map((item, index) => (
                    <div key={index}>{item}</div>
                ))
                : bleQuery.map((item, index) => (
                    <div key={index}>{item}</div>
                ))
            }
        </div>
    );
}

export default SecondSearch;