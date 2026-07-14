import React from "react";

/**
 * Reusable text input with label + inline validation error.
 * When `error` is set: border turns red and the message renders below the field.
 */
function FormInput({
    id,
    name,
    label,
    type = "text",
    value,
    onChange,
    error,
    placeholder,
    autoComplete,
}) {
    return (
        <div className="w-full">
            <label
                htmlFor={id}
                className="mb-1.5 block text-sm font-medium text-neutral-700"
            >
                {label}
            </label>
            <input
                id={id}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                autoComplete={autoComplete}
                className={`w-full rounded-lg border bg-white px-4 py-2.5 text-neutral-900 outline-none transition-colors placeholder:text-neutral-400
                    ${
                        error
                            ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                            : "border-neutral-300 focus:border-lime-600 focus:ring-2 focus:ring-lime-100"
                    }`}
            />
            {error && (
                <p className="mt-1.5 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}

export default FormInput;
