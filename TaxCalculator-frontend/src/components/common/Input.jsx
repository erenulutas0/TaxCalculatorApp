import React from 'react';

const Input = React.forwardRef(({ label, error, type = 'text', className = '', ...props }, ref) => {
    return (
        <div className="input-container">
            {label && <label>{label}</label>}
            <input
                ref={ref}
                type={type}
                className={`input ${className} ${error ? 'input-error' : ''}`}
                {...props}
            />
            {error && <span className="error-message">{error}</span>}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;