import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import UnitConverter from './pages/UnitConverter';
import IssueTracker from "./pages/IssueTracker.jsx";
import PersonalLibrary from "./pages/PersonalLibrary.jsx";
import StockChecker from "./pages/StockChecker.jsx";
import MessageBoard from "./pages/MessageBoard.jsx";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/unit-converter" element={<UnitConverter />} />
            <Route path="/issue-tracker" element={<IssueTracker />} />
            <Route path="/personal-library" element={<PersonalLibrary />} />
            <Route path="/stock-checker" element={<StockChecker />} />
            <Route path="/message-board" element={<MessageBoard />} />
        </Routes>
    );
}

export default App;
