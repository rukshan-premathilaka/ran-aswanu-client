import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import adminService, { fileUrl } from '@/api/adminService.js';
import { useAdminErrorHandler, useDebouncedValue, useToast, useUrlFilters } from '@/component/admin/adminHooks.js';
import {
    DISABLE_PRODUCT_TEXT, ENABLE_PRODUCT_TEXT, formatDate, formatMoney, formatNumber,
} from '@/component/admin/adminHelpers.js';
import {
    btnSecondary, cardCls, inputCls, rowBtnDisable, rowBtnEnable, rowBtnView, tdCls, thCls,
} from '@/component/admin/adminStyles.js';
import { ProductStatusBadge } from '@/component/admin/StatusBadge.jsx';
import FilterField from '@/component/admin/FilterField.jsx';
import Pagination from '@/component/admin/Pagination.jsx';
import ErrorAlert from '@/component/admin/ErrorAlert.jsx';
import ConfirmDialog from '@/component/admin/ConfirmDialog.jsx';
import Toast from '@/component/admin/Toast.jsx';

const STATUSES = [
    { value: 'PUBLISHED', label: 'Published' },
    { value: 'DRAFT', label: 'Draft' },
    { value: 'DISABLED', label: 'Disabled' },
];

function AdminProductsPage() {
    const handleError = useAdminErrorHandler();
    const { toast, showToast } = useToast();
    const { get, setFilter, setPage, clearAll } = useUrlFilters();

    const q = get('q');
    const category = get('category');
    const status = get('status');
    const farmerId = get('farmerId');
    const from = get('from');
    const to = get('to');
    const page = Number(get('page', '0')) || 0;
    const size = Number(get('size', '20')) || 20;

    const [searchText, setSearchText] = useState(q);
    const debouncedSearch = useDebouncedValue(searchText, 400);
    useEffect(() => {
        if (debouncedSearch.trim() !== q) setFilter('q', debouncedSearch.trim());

    }, [debouncedSearch]);

    const [categoryText, setCategoryText] = useState(category);
    const debouncedCategory = useDebouncedValue(categoryText, 400);
    useEffect(() => {
        if (debouncedCategory.trim() !== category) setFilter('category', debouncedCategory.trim());

    }, [debouncedCategory]);

    const [farmerText, setFarmerText] = useState(farmerId);
    const debouncedFarmer = useDebouncedValue(farmerText, 400);
    useEffect(() => {
        const clean = debouncedFarmer.trim();
        // farmerId must be a number: ignore anything else instead of sending a bad value
        if (clean !== farmerId && (clean === '' || /^\d+$/.test(clean))) setFilter('farmerId', clean);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedFarmer]);

    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [target, setTarget] = useState(null);
    const [isBusy, setIsBusy] = useState(false);

    const dateRangeInvalid = Boolean(from && to && from > to);

    const load = useCallback(async () => {
        if (dateRangeInvalid) return;
        setIsLoading(true);
        setErrorMessage('');
        try {
            setData(await adminService.listProducts({ q, category, status, farmerId, from, to, page, size }));
        } catch (err) {
            setErrorMessage(handleError(err).message);
        } finally {
            setIsLoading(false);
        }
    }, [q, category, status, farmerId, from, to, page, size, dateRangeInvalid, handleError]);

    useEffect(() => {
        load();
    }, [load]);

    const confirmToggle = async () => {
        if (!target) return;
        const disable = !target.adminDisabled;
        setIsBusy(true);
        try {
            const updated = await adminService.setProductStatus(target.listId, disable);
            setData((prev) =>
                prev
                    ? { ...prev, content: prev.content.map((p) => (p.listId === updated.listId ? { ...p, ...updated } : p)) }
                    : prev
            );
            showToast('success', disable ? 'Product disabled' : 'Product enabled');
        } catch (err) {
            showToast('error', handleError(err).message);
        } finally {
            setIsBusy(false);
            setTarget(null);
        }
    };

    const hasFilters = q || category || status || farmerId || from || to;
    const COLS = ['Image', 'ID', 'Product', 'Category', 'Price', 'Stock', 'Farmer', 'Created', 'Status', 'Actions'];

    return (
        <div className="w-full h-full font-sans max-w-6xl mx-auto">
            <Toast toast={toast} />

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Products</h1>
                <p className="text-sm text-gray-500 mt-1">Search, filter and moderate marketplace products.</p>
            </div>

            <div className={`${cardCls} mb-6`}>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <FilterField label="Search" className="lg:col-span-2">
                        <input
                            type="text"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            placeholder="Product, category, farmer name / email or product id"
                            className={inputCls}
                        />
                    </FilterField>
                    <FilterField label="Category">
                        <input
                            type="text"
                            value={categoryText}
                            onChange={(e) => setCategoryText(e.target.value)}
                            placeholder="e.g. Vegetables"
                            className={inputCls}
                        />
                    </FilterField>
                    <FilterField label="Status">
                        <select value={status} onChange={(e) => setFilter('status', e.target.value)} className={inputCls}>
                            <option value="">All</option>
                            {STATUSES.map((s) => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                        </select>
                    </FilterField>
                    <FilterField label="Farmer (user id)">
                        <input
                            type="text"
                            inputMode="numeric"
                            value={farmerText}
                            onChange={(e) => setFarmerText(e.target.value)}
                            placeholder="e.g. 12"
                            className={inputCls}
                        />
                    </FilterField>
                    <FilterField label="Created from">
                        <input type="date" value={from} onChange={(e) => setFilter('from', e.target.value)} className={inputCls} />
                    </FilterField>
                    <FilterField label="Created to">
                        <input type="date" value={to} onChange={(e) => setFilter('to', e.target.value)} className={inputCls} />
                    </FilterField>
                    <div className="flex items-end">
                        <button
                            type="button"
                            onClick={() => { clearAll(); setSearchText(''); setCategoryText(''); setFarmerText(''); }}
                            disabled={!hasFilters}
                            className={`${btnSecondary} w-full`}
                        >
                            Clear filters
                        </button>
                    </div>
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
                                <tr><td colSpan={COLS.length} className="px-4 py-12 text-center text-sm text-gray-400">Loading products...</td></tr>
                            ) : !data || data.content.length === 0 ? (
                                <tr><td colSpan={COLS.length} className="px-4 py-12 text-center text-sm text-gray-400">No products found</td></tr>
                            ) : (
                                data.content.map((p) => {
                                    const img = fileUrl(p.productImage);
                                    return (
                                        <tr key={p.listId} className="hover:bg-gray-50/70">
                                            <td className={tdCls}>
                                                {img ? (
                                                    <img src={img} alt={p.productName} className="h-10 w-10 rounded-lg object-cover border border-gray-100" />
                                                ) : (
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">N/A</div>
                                                )}
                                            </td>
                                            <td className={tdCls}>{p.listId}</td>
                                            <td className={`${tdCls} font-semibold text-gray-800`}>{p.productName}</td>
                                            <td className={tdCls}>{p.category}</td>
                                            <td className={`${tdCls} whitespace-nowrap`}>{formatMoney(p.pricePerUnit)} / {p.unitOfMeasurement}</td>
                                            <td className={`${tdCls} whitespace-nowrap`}>{formatNumber(p.availableStock)} {p.unitOfMeasurement}</td>
                                            <td className={tdCls}>
                                                <Link to={`/admin/users/${p.farmerId}`} className="font-semibold text-green-700 hover:underline">
                                                    {p.farmerName}
                                                </Link>
                                            </td>
                                            <td className={tdCls}>{formatDate(p.createdAt)}</td>
                                            <td className={tdCls}><ProductStatusBadge status={p.status} /></td>
                                            <td className={tdCls}>
                                                <div className="flex gap-2">
                                                    <Link to={`/admin/products/${p.listId}`} className={rowBtnView}>View</Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => setTarget(p)}
                                                        className={p.adminDisabled ? rowBtnEnable : rowBtnDisable}
                                                    >
                                                        {p.adminDisabled ? 'Enable' : 'Disable'}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination data={data} onPageChange={setPage} onSizeChange={(s) => setFilter('size', String(s))} />
            </div>

            <ConfirmDialog
                open={Boolean(target)}
                danger={Boolean(target && !target.adminDisabled)}
                busy={isBusy}
                title={target?.adminDisabled ? 'Enable product' : 'Disable product'}
                message={target?.adminDisabled ? ENABLE_PRODUCT_TEXT : DISABLE_PRODUCT_TEXT}
                confirmText={target?.adminDisabled ? 'Enable product' : 'Disable product'}
                onConfirm={confirmToggle}
                onCancel={() => setTarget(null)}
            />
        </div>
    );
}

export default AdminProductsPage;
