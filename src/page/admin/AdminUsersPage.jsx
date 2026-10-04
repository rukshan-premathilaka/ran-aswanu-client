import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import adminService from '@/api/adminService.js';
import { useAdminMe } from '@/component/admin/AdminContext.js';
import { useAdminErrorHandler, useDebouncedValue, useToast, useUrlFilters } from '@/component/admin/adminHooks.js';
import { DISABLE_USER_TEXT, ENABLE_USER_TEXT, formatDate, roleLabel } from '@/component/admin/adminHelpers.js';
import {
    btnSecondary, cardCls, inputCls, rowBtnDisable, rowBtnEnable, rowBtnView, tdCls, thCls,
} from '@/component/admin/adminStyles.js';
import { UserStatusBadge } from '@/component/admin/StatusBadge.jsx';
import FilterField from '@/component/admin/FilterField.jsx';
import Pagination from '@/component/admin/Pagination.jsx';
import ErrorAlert from '@/component/admin/ErrorAlert.jsx';
import ConfirmDialog from '@/component/admin/ConfirmDialog.jsx';
import Toast from '@/component/admin/Toast.jsx';

const ROLES = ['FARMER', 'BUYER', 'TRANSPORT', 'ADMIN'];

function AdminUsersPage() {
    const me = useAdminMe();
    const handleError = useAdminErrorHandler();
    const { toast, showToast } = useToast();
    const { get, setFilter, setPage, clearAll } = useUrlFilters();

    // Filters live in the URL, so a refresh keeps them
    const q = get('q');
    const role = get('role');
    const active = get('active');
    const from = get('from');
    const to = get('to');
    const page = Number(get('page', '0')) || 0;
    const size = Number(get('size', '20')) || 20;

    // Search box: wait ~400 ms after typing before it goes to the URL
    const [searchText, setSearchText] = useState(q);
    const debouncedSearch = useDebouncedValue(searchText, 400);
    useEffect(() => {
        if (debouncedSearch.trim() !== q) setFilter('q', debouncedSearch.trim());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch]);

    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [target, setTarget] = useState(null); // user waiting for confirm
    const [isBusy, setIsBusy] = useState(false);

    const dateRangeInvalid = Boolean(from && to && from > to);

    const load = useCallback(async () => {
        if (dateRangeInvalid) return;
        setIsLoading(true);
        setErrorMessage('');
        try {
            setData(await adminService.listUsers({ q, role, active, from, to, page, size }));
        } catch (err) {
            setErrorMessage(handleError(err).message);
        } finally {
            setIsLoading(false);
        }
    }, [q, role, active, from, to, page, size, dateRangeInvalid, handleError]);

    useEffect(() => {
        load();
    }, [load]);

    const canToggle = (u) => u.role !== 'ADMIN' && u.userId !== me?.userId;

    const confirmToggle = async () => {
        if (!target) return;
        const makeActive = !target.active;
        setIsBusy(true);
        try {
            const updated = await adminService.setUserStatus(target.userId, makeActive);
            // Update that row from the response
            setData((prev) =>
                prev
                    ? { ...prev, content: prev.content.map((u) => (u.userId === updated.userId ? { ...u, ...updated } : u)) }
                    : prev
            );
            showToast('success', makeActive ? 'Account enabled' : 'Account disabled');
            setTarget(null);
        } catch (err) {
            showToast('error', handleError(err).message);
            setTarget(null);
        } finally {
            setIsBusy(false);
        }
    };

    const hasFilters = q || role || active || from || to;

    return (
        <div className="w-full h-full font-sans max-w-6xl mx-auto">
            <Toast toast={toast} />

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Users</h1>
                <p className="text-sm text-gray-500 mt-1">Search, filter and manage user accounts.</p>
            </div>

            {/* Filters */}
            <div className={`${cardCls} mb-6`}>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <FilterField label="Search" className="lg:col-span-2">
                        <input
                            type="text"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            placeholder="Username, email, phone or user id"
                            className={inputCls}
                        />
                    </FilterField>
                    <FilterField label="Role">
                        <select value={role} onChange={(e) => setFilter('role', e.target.value)} className={inputCls}>
                            <option value="">All roles</option>
                            {ROLES.map((r) => (
                                <option key={r} value={r}>{roleLabel(r)}</option>
                            ))}
                        </select>
                    </FilterField>
                    <FilterField label="Status">
                        <select value={active} onChange={(e) => setFilter('active', e.target.value)} className={inputCls}>
                            <option value="">All</option>
                            <option value="true">Active</option>
                            <option value="false">Disabled</option>
                        </select>
                    </FilterField>
                    <div className="flex items-end">
                        <button
                            type="button"
                            onClick={() => { clearAll(); setSearchText(''); }}
                            disabled={!hasFilters}
                            className={`${btnSecondary} w-full`}
                        >
                            Clear filters
                        </button>
                    </div>
                    <FilterField label="Registered from">
                        <input type="date" value={from} onChange={(e) => setFilter('from', e.target.value)} className={inputCls} />
                    </FilterField>
                    <FilterField label="Registered to">
                        <input type="date" value={to} onChange={(e) => setFilter('to', e.target.value)} className={inputCls} />
                    </FilterField>
                </div>
                {dateRangeInvalid && (
                    <p className="mt-3 text-sm font-semibold text-red-600">'From' date must not be after 'To' date.</p>
                )}
            </div>

            <ErrorAlert message={errorMessage} onRetry={load} />

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50">
                            <tr>
                                {['ID', 'Username', 'Email', 'Role', 'Phone', 'Registered', 'Status', 'Actions'].map((h) => (
                                    <th key={h} className={thCls}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr><td colSpan={8} className="px-4 py-12 text-center text-sm text-gray-400">Loading users...</td></tr>
                            ) : !data || data.content.length === 0 ? (
                                <tr><td colSpan={8} className="px-4 py-12 text-center text-sm text-gray-400">No users found</td></tr>
                            ) : (
                                data.content.map((u) => (
                                    <tr key={u.userId} className="hover:bg-gray-50/70">
                                        <td className={tdCls}>{u.userId}</td>
                                        <td className={`${tdCls} font-semibold text-gray-800`}>{u.username}</td>
                                        <td className={tdCls}>{u.email}</td>
                                        <td className={tdCls}>{roleLabel(u.role)}</td>
                                        <td className={tdCls}>{u.phoneNumber || '-'}</td>
                                        <td className={tdCls}>{formatDate(u.createdAt)}</td>
                                        <td className={tdCls}><UserStatusBadge active={u.active} /></td>
                                        <td className={tdCls}>
                                            <div className="flex gap-2">
                                                <Link to={`/admin/users/${u.userId}`} className={rowBtnView}>View</Link>
                                                {canToggle(u) && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setTarget(u)}
                                                        className={u.active ? rowBtnDisable : rowBtnEnable}
                                                    >
                                                        {u.active ? 'Disable' : 'Enable'}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination
                    data={data}
                    onPageChange={setPage}
                    onSizeChange={(s) => setFilter('size', String(s))}
                />
            </div>

            <ConfirmDialog
                open={Boolean(target)}
                danger={Boolean(target?.active)}
                busy={isBusy}
                title={target?.active ? 'Disable account' : 'Enable account'}
                message={
                    target?.active ? DISABLE_USER_TEXT : ENABLE_USER_TEXT
                }
                confirmText={target?.active ? 'Disable account' : 'Enable account'}
                onConfirm={confirmToggle}
                onCancel={() => setTarget(null)}
            />
        </div>
    );
}

export default AdminUsersPage;
