import React from 'react';

const TONES = {
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-700',
    gray: 'bg-gray-200 text-gray-700',
    yellow: 'bg-yellow-100 text-yellow-800',
    blue: 'bg-blue-100 text-blue-800',
};

// Same badge look as the farmer pages: small rounded label with soft colour.
function StatusBadge({ tone = 'gray', children }) {
    return (
        <span
            className={`inline-block whitespace-nowrap text-xs font-bold px-2.5 py-1 rounded-lg ${TONES[tone] || TONES.gray}`}
        >
            {children}
        </span>
    );
}

export const UserStatusBadge = ({ active }) =>
    active ? (
        <StatusBadge tone="green">Active</StatusBadge>
    ) : (
        <StatusBadge tone="red">Disabled</StatusBadge>
    );

const PRODUCT_TONES = { PUBLISHED: 'green', DRAFT: 'gray', DISABLED: 'red' };
const PRODUCT_LABELS = { PUBLISHED: 'Published', DRAFT: 'Draft', DISABLED: 'Disabled' };

export const ProductStatusBadge = ({ status }) => (
    <StatusBadge tone={PRODUCT_TONES[status] || 'gray'}>
        {PRODUCT_LABELS[status] || status || '-'}
    </StatusBadge>
);

export default StatusBadge;
