import React from 'react';
import './Sidebar.css';

function Sidebar() {

    return (
        <div id="sidebar-Container">
            <button onClick={() => setActivePage('home')}>Home</button>
            <button onClick={() => setActivePage('settings')}>Settings</button>
            <button onClick={() => setActivePage('forecast')}>Weekly Forecast</button>
            <button onClick={() => setActivePage('compare')}>Compare Statistics</button>
        </div>
        
    );
}

export default Sidebar;

