import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="container">
            <h1>My microservices</h1>
            <div className="links">
                <Link to="/unit-converter" className="service-link">
                    Unit Converter
                </Link>
                <Link to="/issue-tracker" className="service-link">
                    Issue Tracker
                </Link>
                <Link to="/personal-library" className="service-link">
                    Personal Library
                </Link>
                <Link to="/stock-checker" className="service-link">
                    Stock Checker
                </Link>
                <Link to="/message-board" className="service-link">
                    Message Board
                </Link>
            </div>
        </div>
    );
}

export default Home;
