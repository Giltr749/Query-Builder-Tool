import React from 'react';
import '../styles/Results.css';

function Results({results, loading}) {
    return (
        <div>
            {
                loading && <div className='loader'>Loading...</div>
            }
            {
                results.map((result, index) => (
                    <div key={index}>{JSON.stringify(result)}</div>
                ))
            }
        </div>
    );
}

export default Results;