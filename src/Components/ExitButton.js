import React from 'react';
import './ExitButton.css';

function ExitButton({ onExit }) {
    return (
        <button className="exit-button" onClick={onExit}>Exit</button> // Pass On Exit to app.js
    );

};

export default ExitButton;