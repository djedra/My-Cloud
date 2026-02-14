import React from 'react';
import './Input.css';

const Input = ({ 
    id, 
    name, 
    type = 'text', 
    value, 
    onChange, 
    placeholder = '', 
    error = '', 
    className = '',
    ...props 
}) => {
    const baseClasses = 'input';
    const errorClasses = error ? 'input-error' : '';
    
    return (
        <div className={`input-wrapper ${className}`}>
            <input
                id={id}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`${baseClasses} ${errorClasses}`}
                {...props}
            />
            {error && <span className="input-error-message">{error}</span>}
        </div>
    );
};

export default Input;