import React from 'react';

// Floating success / error message (top right). `toast` = { type: 'success' | 'error', text }
function Toast({ toast }) {
    if (!toast) return null;
    const isError = toast.type === 'error';
    return (
        <div
            role="status"
            className={`fixed right-6 top-6 z-[60] max-w-sm rounded-xl border px-4 py-3 text-sm font-semibold shadow-lg ${
                isError
                    ? 'border-red-200 bg-red-50 text-red-700'
                    : 'border-green-200 bg-green-50 text-green-700'
            }`}
        >
            {toast.text}
        </div>
    );
}

export default Toast;
