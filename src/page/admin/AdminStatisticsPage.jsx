import React, { useCallback, useEffect, useState } from 'react';
import adminService from '@/api/adminService.js';
import { useAdminErrorHandler } from '@/component/admin/adminHooks.js';
import { formatNumber } from '@/component/admin/adminHelpers.js';
import { btnSecondary, cardCls, inputCls, tdCls, thCls } from '@/component/admin/adminStyles.js';
import ErrorAlert from '@/component/admin/ErrorAlert.jsx';
import GroupedBarChart from '@/component/admin/GroupedBarChart.jsx';

const USER_COLOR = '#16a34a';
const PRODUCT_COLOR = '#F2C333';

function AdminStatisticsPage() {
    const handleError = useAdminErrorHandler();
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 2000 + 1 }, (_, i) => currentYear - i); // this year first

    const [year, setYear] = useState(currentYear);
    const [monthly, setMonthly] = useState(null);
    const [yearly, setYearly] = useState(null);
    const [monthlyLoading, setMonthlyLoading] = useState(true);
    const [yearlyLoading, setYearlyLoading] = useState(true);
    const [monthlyError, setMonthlyError] = useState('');
    const [yearlyError, setYearlyError] = useState('');

    const loadMonthly = useCallback(async () => {
        setMonthlyLoading(true);
        setMonthlyError('');
        try {
            setMonthly(await adminService.getMonthlyStats(year));
        } catch (err) {
            setMonthlyError(handleError(err).message);
        } finally {
            setMonthlyLoading(false);
        }
    }, [year, handleError]);

    const loadYearly = useCallback(async () => {
        setYearlyLoading(true);
        setYearlyError('');
        try {
            setYearly(await adminService.getYearlyStats());
        } catch (err) {
            setYearlyError(handleError(err).message);
        } finally {
            setYearlyLoading(false);
        }
    }, [handleError]);

    useEffect(() => {
        loadMonthly();
    }, [loadMonthly]);

    useEffect(() => {
        loadYearly();
    }, [loadYearly]);

    return (
        <div className="w-full h-full font-sans max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Statistics</h1>
                <p className="text-sm text-gray-500 mt-1">New users and new products, by month and by year.</p>
            </div>

            {/* Monthly */}
            <div className={`${cardCls} mb-8`}>
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-gray-700">Monthly</h3>
                        {monthly && !monthlyLoading && (
                            <p className="text-xs text-gray-400 mt-0.5">
                                {formatNumber(monthly.totalNewUsers)} new users · {formatNumber(monthly.totalNewProducts)} new products in {monthly.year}
                            </p>
                        )}
                    </div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-500">
                        Year
                        <select
                            value={year}
                            onChange={(e) => setYear(Number(e.target.value))}
                            className={`${inputCls} !w-auto !py-2`}
                        >
                            {years.map((y) => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </label>
                </div>

                <ErrorAlert message={monthlyError} onRetry={loadMonthly} />

                {monthlyLoading ? (
                    <div className="h-60 animate-pulse rounded-xl bg-gray-100" />
                ) : monthly ? (
                    <>
                        <div className="grid grid-cols-2 gap-4 mb-4 max-w-md">
                            <div className="rounded-xl bg-gray-50 p-3">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total new users</p>
                                <p className="text-2xl font-bold text-green-700">{formatNumber(monthly.totalNewUsers)}</p>
                            </div>
                            <div className="rounded-xl bg-gray-50 p-3">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total new products</p>
                                <p className="text-2xl font-bold text-gray-800">{formatNumber(monthly.totalNewProducts)}</p>
                            </div>
                        </div>
                        {/* Months with no data come as 0 and are drawn too */}
                        <GroupedBarChart
                            labels={monthly.months.map((m) => m.label)}
                            series={[
                                { name: 'New users', color: USER_COLOR, values: monthly.months.map((m) => m.newUsers) },
                                { name: 'New products', color: PRODUCT_COLOR, values: monthly.months.map((m) => m.newProducts) },
                            ]}
                        />
                    </>
                ) : null}
            </div>

            {/* Yearly */}
            <div className={cardCls}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-700">Yearly</h3>
                    <button onClick={loadYearly} className={btnSecondary}>Refresh</button>
                </div>

                <ErrorAlert message={yearlyError} onRetry={loadYearly} />

                {yearlyLoading ? (
                    <div className="h-60 animate-pulse rounded-xl bg-gray-100" />
                ) : !yearly?.years?.length ? (
                    <p className="py-10 text-center text-sm text-gray-400">No yearly data yet.</p>
                ) : (
                    <>
                        <GroupedBarChart
                            labels={yearly.years.map((y) => String(y.year))}
                            series={[
                                { name: 'New users', color: USER_COLOR, values: yearly.years.map((y) => y.newUsers) },
                                { name: 'New products', color: PRODUCT_COLOR, values: yearly.years.map((y) => y.newProducts) },
                            ]}
                        />
                        <div className="mt-6 overflow-x-auto rounded-xl border border-gray-100">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className={thCls}>Year</th>
                                        <th className={thCls}>New users</th>
                                        <th className={thCls}>New products</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {yearly.years.map((y) => (
                                        <tr key={y.year}>
                                            <td className={`${tdCls} font-semibold text-gray-800`}>{y.year}</td>
                                            <td className={tdCls}>{formatNumber(y.newUsers)}</td>
                                            <td className={tdCls}>{formatNumber(y.newProducts)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default AdminStatisticsPage;
