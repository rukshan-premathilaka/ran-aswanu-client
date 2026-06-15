/*import React from 'react';*/

const CustomButton = ({ text, onClick, className = '', type = 'button' }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`w-full py-3 px-4 rounded-2xl font-semibold text-center transition-all duration-200 active:scale-95 shadow-sm ${className}`}
        >
            {text}
        </button>
    );
};

export default CustomButton;