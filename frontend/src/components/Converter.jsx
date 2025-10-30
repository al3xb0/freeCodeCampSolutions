import React, { useState } from 'react';

function Converter({ onConvert }) {
    const [input, setInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onConvert(input);
    };

    return (
        <form className="converter-form" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Enter value (e.g., 10L)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="converter-input"
            />
            <button type="submit" className="converter-button">Convert</button>
        </form>
    );
}

export default Converter;
