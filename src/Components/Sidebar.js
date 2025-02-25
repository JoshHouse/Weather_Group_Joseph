import React from "react";
import "./Sidebar.css";

function Sidebar() {
    return (
        <div className="sidebar">
            <h2>Weather App</h2>
            <nav>
                <ul>
                    <li><a href="#">Home</a></li>
                    <li><a href="#">Forecast</a></li>
                    <li><a href="#">Compare Statistics</a></li>
                </ul>
            </nav>
        </div>
    );
}

export default Sidebar;
