import React from 'react';

// Red alert with an optional Retry button (every list / page has an error state).
function ErrorAlert({ message, onRetry }) {
    if (!message) return null;
    return (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            <span>{message}</span>
            {onRetry && (
                <button
                    type="button"
                    onClick={onRetry}
                    className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700 cursor-pointer"
                >
                    Retry
                </button>
            )}
        </div>
    );
}

export default ErrorAlert;
