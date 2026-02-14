import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ value, max = 100, label }) => {
    const percentage = (value / max) * 100;
    const getColor = () => {
        if (percentage < 50) return 'success';
        if (percentage < 80) return 'warning';
        return 'danger';
    };

    return (
        <div className="progress-bar-container">
            {label && (
                <div className="progress-bar-label">
                    <span>{label}</span>
                    <span>{percentage.toFixed(1)}%</span>
                </div>
            )}
            
            <div className="progress-bar">
                <div 
                    className={`progress-bar-fill progress-bar-${getColor()}`} 
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

export default ProgressBar;