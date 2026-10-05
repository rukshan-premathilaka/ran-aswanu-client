import React from 'react';
import { btnSecondary } from '@/component/admin/adminStyles.js';

const SIZES = [10, 20, 50, 100];

/* props: data = the page wrapper */
function Pagination({ data, onPageChange, onSizeChange }) {
    if (!data) return null;
    const { page, size, totalElements, totalPages } = data;

    return (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-4 py-3">
            <p className="text-xs font-medium text-gray-500">
                {totalElements.toLocaleString()} {totalElements === 1 ? 'result' : 'results'}
                {totalPages > 0 && ` · Page ${page + 1} of ${totalPages}`}
            </p>

            <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-xs font-medium text-gray-500">
                    Per page
                    <select
                        value={size}
                        onChange={(e) => onSizeChange(Number(e.target.value))}
                        className="rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5 text-xs focus:border-green-500 focus:outline-none"
                    >
                        {SIZES.map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>
                </label>

                <div className="flex gap-2">
                    <button
                        type="button"
                        disabled={page <= 0}
                        onClick={() => onPageChange(page - 1)}
                        className={`${btnSecondary} !py-1.5 !px-3 !text-xs`}
                    >
                        Previous
                    </button>
                    <button
                        type="button"
                        disabled={page + 1 >= totalPages}
                        onClick={() => onPageChange(page + 1)}
                        className={`${btnSecondary} !py-1.5 !px-3 !text-xs`}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Pagination;
