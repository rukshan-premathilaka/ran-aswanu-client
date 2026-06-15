import React, { useState } from 'react';

const InputField = ({ label, type = 'text', placeholder, value, onChange }) => {
    const [showPassword, setShowPassword] = useState(false);


    const inputType = type === 'password' && showPassword ? 'text' : type;

    return (
        <div className="w-full mb-4">
            {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
            <div className="relative">
                <input
                    type={inputType}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brandGreen/50 focus:border-brandGreen transition-all text-sm"
                />


                {type === 'password' && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        {showPassword ? '🙈' : '👁️'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default InputField;