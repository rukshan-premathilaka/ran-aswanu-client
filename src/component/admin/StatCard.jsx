import React from 'react';
import { Link } from 'react-router-dom';
import { cardCls, labelCls } from '@/component/admin/adminStyles.js';

const VALUE_TONES = {
    default: 'text-gray-800',
    green: 'text-green-700',
    red: 'text-red-600',
};

// Number card (same look as the farmer dashboard metric cards). `to` makes the card a link.
function StatCard({ label, value, tone = 'default', to, loading = false }) {
    const body = (
        <>
            <p className={labelCls}>{label}</p>
            <h3 className={`text-3xl font-bold mt-1 ${VALUE_TONES[tone] || VALUE_TONES.default}`}>
                {loading ? <span className="inline-block h-8 w-16 animate-pulse rounded-lg bg-gray-100 align-middle" /> : value}
            </h3>
        </>
    );

    if (to) {
        return (
            <Link to={to} className={`${cardCls} block transition-shadow hover:shadow-md`}>
                {body}
            </Link>
        );
    }
    return <div className={cardCls}>{body}</div>;
}

export default StatCard;
