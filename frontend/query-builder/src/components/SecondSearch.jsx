import React from 'react';
import QueryBuilder from './QueryBuilder.jsx';

function SecondSearch({ query, setQuery, subQuery, setSubQuery, wifi, setWifi, clickAdd, clickSubmit }) {
    return (
        <div>
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

export default SecondSearch;