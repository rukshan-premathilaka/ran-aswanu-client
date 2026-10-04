import React from 'react';
import { labelCls } from '@/component/admin/adminStyles.js';

// Label + control wrapper used by the filter bars.
function FilterField({ label, children, className = '' }) {
    return (
        <div className={className}>
            <label className={`${labelCls} mb-1.5 block`}>{label}</label>
            {children}
        </div>
    );
}

export default FilterField;
