import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import adminService from '@/api/adminService.js';
import { useAdminErrorHandler, useDebouncedValue, useUrlFilters } from '@/component/admin/adminHooks.js';
import { formatDateTime, preview } from '@/component/admin/adminHelpers.js';
import { btnSecondary, cardCls, inputCls, rowBtnView, tdCls, thCls } from '@/component/admin/adminStyles.js';
import FilterField from '@/component/admin/FilterField.jsx';
import Pagination from '@/component/admin/Pagination.jsx';
import ErrorAlert from '@/component/admin/ErrorAlert.jsx';

// Read only area: no reply / delete / status buttons (guide 4.7)
function AdminSupportPage() {
    const handleError = useAdminErrorHandler();
    const { get, setFilter, setPage, clearAll } = useUrlFilters();

    const q = get('q');
    const userId = get('userId');
    const from = get('from');
    const to = get('to');
    const page = Number(get('page', '0')) || 0;
    const size = Number(get('size', '20')) || 20;

    const [searchText, setSearchText] = useState(q);
    const debouncedSearch = useDebouncedValue(searchText, 400);
    useEffect(() => {
        if (debouncedSearch.trim() !== q) setFilter('q', debouncedSearch.trim());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch]);

    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const dateRangeInvalid = Boolean(from && to && from > to);

    const load = useCallback(async () => {
        if (dateRangeInvalid) return;
        setIsLoading(true);
        setErrorMessage('');
        try {
            setData(await adminService.listSupportMessages({ q, userId, from, to, page, size }));
        } catch (err) {
            setErrorMessage(handleError(err).message);
        } finally {
            setIsLoading(false);
        }
    }, [q, userId, from, to, page, size, dateRangeInvalid, handleError]);

    useEffect(() => {
        load();
    }, [load]);

    const hasFilters = q || userId || from || to;
    const COLS = ['Date', 'Sender', 'Email', 'Subject', 'Message', 'Actions'];

    return (
        <div className="w-full h-full font-sans max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Support Messages</h1>
                <p className="text-sm text-gray-500 mt-1">Help and support messages sent by users (read only).</p>
            </div>

            <div className={`${cardCls} mb-6`}>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <FilterField label="Search" className="lg:col-span-2">
                        <input
                            type="text"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            placeholder="Subject, message, sender name or email"
                            className={inputCls}
                        />
                    </FilterField>
                    <FilterField label="From">
                        <input type="date" value={from} onChange={(e) => setFilter('from', e.target.value)} className={inputCls} />
                    </FilterField>
                    <FilterField label="To">
                        <input type="date" value={to} onChange={(e) => setFilter('to', e.target.value)} className={inputCls} />
                    </FilterField>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                    {userId && (
                        <span className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">
                            Sender: user #{userId}
                            <button type="button" onClick={() => setFilter('userId', '')} className="cursor-pointer text-green-900 hover:text-red-600" aria-label="Remove sender filter">
                                ✕
                            </button>
                        </span>
                    )}
                    <button
                        type="button"
                        onClick={() => { clearAll(); setSearchText(''); }}
                        disabled={!hasFilters}
                        className={btnSecondary}
                    >
                        Clear filters
                    </button>
                </div>
                {dateRangeInvalid && (
                    <p className="mt-3 text-sm font-semibold text-red-600">'From' date must not be after 'To' date.</p>
                )}
            </div>

            <ErrorAlert message={errorMessage} onRetry={load} />

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50">
                            <tr>{COLS.map((h) => <th key={h} className={thCls}>{h}</th>)}</tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr><td colSpan={COLS.length} className="px-4 py-12 text-center text-sm text-gray-400">Loading messages...</td></tr>
                            ) : !data || data.content.length === 0 ? (
                                <tr><td colSpan={COLS.length} className="px-4 py-12 text-center text-sm text-gray-400">No messages found</td></tr>
                            ) : (
                                data.content.map((m) => (
                                    <tr key={m.messageId} className="hover:bg-gray-50/70">
                                        <td className={`${tdCls} whitespace-nowrap`}>{formatDateTime(m.createdAt)}</td>
                                        <td className={tdCls}>
                                            <Link to={`/admin/users/${m.userId}`} className="font-semibold text-green-700 hover:underline">
                                                {m.username}
                                            </Link>
                                        </td>
                                        <td className={tdCls}>{m.email}</td>
                                        <td className={`${tdCls} font-semibold text-gray-800`}>{m.subject}</td>
                                        <td className={`${tdCls} max-w-xs text-gray-500`}>{preview(m.message, 80)}</td>
                                        <td className={tdCls}>
                                            <Link to={`/admin/support/${m.messageId}`} className={rowBtnView}>View</Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination data={data} onPageChange={setPage} onSizeChange={(s) => setFilter('size', String(s))} />
            </div>
        </div>
    );
}

export default AdminSupportPage;
