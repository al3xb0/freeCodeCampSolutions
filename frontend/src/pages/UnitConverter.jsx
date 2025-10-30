import React, { useState } from 'react';
import Converter from '../components/Converter';
import UnitHelp from '../components/UnitHelp'

function UnitConverter() {
    const [result, setResult] = useState('');

    const handleConvert = async (input) => {
        try {
            const res = await fetch(`/api/convert?input=${encodeURIComponent(input)}`);
            const data = await res.json();

            if (data.error) {
                setResult(`Error: ${data.error}`)
            } else {
                setResult(data.string)
            }
        } catch (err) {
            setResult('Error: Unable to reach the server.')
        }
    };

    return (
        <div className="container">
            <h1>Unit Converter</h1>
            <Converter onConvert={handleConvert} />
            {result && <div className="result" style={{
                marginTop: '10px',
                padding: '10px',
                borderRadius: '6px',
                fontWeight: 'bold',
                color: result.startsWith('Error') ? '#b00020' : '#000',
                backgroundColor: result.startsWith('Error') ? '#fdecea' : '#f0f0f0'
            }}>{result}</div>}
            <UnitHelp />
        </div>
    );
}

export default UnitConverter;
