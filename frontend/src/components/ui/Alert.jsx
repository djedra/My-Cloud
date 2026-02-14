import React from 'react';
import './Alert.css';

const Alert = ({ type = 'info', message }) => {
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };

    return (
        <div className={`alert alert-${type}`}>
            <span className="alert-icon">{icons[type]}</span>
            <span className="alert-message">{message}</span>
        </div>
    );
};

export default Alert;