import React from 'react';
import { btnDanger, btnPrimary, btnSecondary } from '@/component/admin/adminStyles.js';

/**
 * Confirmation modal. Disable / enable always asks first (guide section 9).
 * `danger` = red confirm button (disable), otherwise green (enable).
 */
function ConfirmDialog({
    open,
    title,
    message,
    confirmText = 'Confirm',
    danger = false,
    busy = false,
    onConfirm,
    onCancel,
}) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-xl">
                <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{message}</p>
                <div className="mt-6 flex justify-end gap-3">
                    <button type="button" onClick={onCancel} disabled={busy} className={btnSecondary}>
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={busy}
                        className={danger ? btnDanger : btnPrimary}
                    >
                        {busy ? 'Please wait…' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmDialog;
