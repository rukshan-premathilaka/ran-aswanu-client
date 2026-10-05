import React, { useCallback, useEffect, useState } from 'react';
import adminService from '@/api/adminService.js';
import { useAdminErrorHandler } from '@/component/admin/adminHooks.js';
import { formatNumber, roleLabel } from '@/component/admin/adminHelpers.js';
import { btnSecondary, cardCls } from '@/component/admin/adminStyles.js';
import StatCard from '@/component/admin/StatCard.jsx';
import ErrorAlert from '@/component/admin/ErrorAlert.jsx';
import GroupedBarChart from '@/component/admin/GroupedBarChart.jsx';

function AdminDashboardPage() {
    const handleError = useAdminErrorHandler();

    const [summary, setSummary] = useState(null);
    const [monthly, setMonthly] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const load = useCallback(async () => {
        setIsLoading(true);
        setErrorMessage('');
        try {
            const data = await adminService.getSummary();
            setSummary(data);
        } catch (err) {
            setErrorMessage(handleError(err).message);
        } finally {
            setIsLoading(false);
        }

        // Optional small chart
        try {
            setMonthly(await adminService.getMonthlyStats());
        } catch {
            setMonthly(null);
        }
    }, [handleError]);

    useEffect(() => {
        load();
    }, [load]);

    const users = summary?.users;
    const products = summary?.products;
    const support = summary?.supportMessages;
    const roleTotal = Math.max(1, ...(users?.byRole || []).map((r) => r.count));

    return (
        <div className="w-full h-full font-sans max-w-6xl mx-auto">
            {/* Top bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Platform overview: users, products and support messages.
                    </p>
                </div>
                <button onClick={load} className={btnSecondary}>
                    Refresh
                </button>
            </div>

            <ErrorAlert message={errorMessage} onRetry={load} />

            {/* Users */}
            <h2 className="text-lg font-bold text-gray-700 mb-3">Users</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6 mb-8">
                <StatCard label="Total Users" value={formatNumber(users?.total)} to="/admin/users" loading={isLoading} />
                <StatCard label="Active" value={formatNumber(users?.active)} tone="green" to="/admin/users?active=true" loading={isLoading} />
                <StatCard label="Disabled" value={formatNumber(users?.disabled)} tone="red" to="/admin/users?active=false" loading={isLoading} />
                <StatCard label="New This Month" value={formatNumber(users?.newThisMonth)} loading={isLoading} />
                <StatCard label="New This Year" value={formatNumber(users?.newThisYear)} loading={isLoading} />
            </div>

            {/* Users by capability: M:M roles may overlap (e.g. Buyer + Delivery Partner). */}
            <div className={`${cardCls} mb-8`}>
                <h3 className="text-lg font-bold text-gray-700 mb-4">Users by Capability</h3>
                {isLoading ? (
                    <div className="h-24 animate-pulse rounded-xl bg-gray-100" />
                ) : !users?.byRole?.length ? (
                    <p className="py-6 text-center text-sm text-gray-400">No data yet.</p>
                ) : (
                    <div className="space-y-3">
                        {users.byRole.map((item) => (
                            <div key={item.role} className="flex items-center gap-4">
                                <span className="w-28 flex-shrink-0 text-sm font-medium text-gray-600">
                                    {roleLabel(item.role)}
                                </span>
                                <div className="h-3 flex-1 overflow-hidden rounded-full bg-gray-100">
                                    <div
                                        className="h-full rounded-full bg-green-500"
                                        style={{ width: `${(item.count / roleTotal) * 100}%` }}
                                    />
                                </div>
                                <span className="w-12 text-right text-sm font-bold text-gray-800">
                                    {formatNumber(item.count)}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Products */}
            <h2 className="text-lg font-bold text-gray-700 mb-3">Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                <StatCard label="Total Products" value={formatNumber(products?.total)} to="/admin/products" loading={isLoading} />
                <StatCard label="Published" value={formatNumber(products?.published)} tone="green" to="/admin/products?status=PUBLISHED" loading={isLoading} />
                <StatCard label="Draft" value={formatNumber(products?.draft)} to="/admin/products?status=DRAFT" loading={isLoading} />
                <StatCard label="Disabled by Admin" value={formatNumber(products?.adminDisabled)} tone="red" to="/admin/products?status=DISABLED" loading={isLoading} />
                <StatCard label="New This Month" value={formatNumber(products?.newThisMonth)} loading={isLoading} />
                <StatCard label="New This Year" value={formatNumber(products?.newThisYear)} loading={isLoading} />
            </div>

            {/* Support */}
            <h2 className="text-lg font-bold text-gray-700 mb-3">Support</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <StatCard label="Support Messages" value={formatNumber(support?.total)} to="/admin/support" loading={isLoading} />
                <StatCard label="This Month" value={formatNumber(support?.thisMonth)} loading={isLoading} />
            </div>

            {/* Optional chart: this year, month by month */}
            {monthly && (
                <div className={cardCls}>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-700">New This Year ({monthly.year})</h3>
                        <span className="text-xs font-bold bg-green-50 text-green-700 px-2.5 py-1 rounded-lg">
                            {formatNumber(monthly.totalNewUsers)} users · {formatNumber(monthly.totalNewProducts)} products
                        </span>
                    </div>
                    <GroupedBarChart
                        labels={monthly.months.map((m) => m.label)}
                        series={[
                            { name: 'New users', color: '#16a34a', values: monthly.months.map((m) => m.newUsers) },
                            { name: 'New products', color: '#F2C333', values: monthly.months.map((m) => m.newProducts) },
                        ]}
                    />
                </div>
            )}
        </div>
    );
}

export default AdminDashboardPage;
