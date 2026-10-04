import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import adminService from '@/api/adminService.js';
import { AdminContext } from '@/component/admin/AdminContext.js';
import { parseApiError } from '@/component/admin/adminHelpers.js';

/**
 * Admin guard (guide section 4 / 9):
 *  - no token            -> login
 *  - GET /api/me 401     -> delete token, login
 *  - role !== "ADMIN"    -> home
 */
function AdminGuard({ children }) {
    const navigate = useNavigate();
    const [me, setMe] = useState(null);
    const [error, setError] = useState('');
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem('my_app_token');
        if (!token) {
            navigate('/login', { replace: true });
            return undefined;
        }

        let cancelled = false;
        adminService
            .getMe()
            .then((data) => {
                if (cancelled) return;
                if (data?.role !== 'ADMIN') {
                    navigate('/home', { replace: true });
                    return;
                }
                setMe(data);
            })
            .catch((err) => {
                if (cancelled) return;
                const parsed = parseApiError(err);
                if (parsed.status === 401) {
                    localStorage.removeItem('my_app_token');
                    navigate('/login', { replace: true });
                } else if (parsed.status === 403) {
                    navigate('/home', { replace: true });
                } else {
                    setError(parsed.message);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [navigate, attempt]);

    if (error) {
        return (
            <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 px-6">
                <div className="w-full max-w-md rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                    <p className="font-semibold">{error}</p>
                    <button
                        type="button"
                        onClick={() => {
                            setError('');
                            setAttempt((n) => n + 1);
                        }}
                        className="mt-3 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700 cursor-pointer"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!me) {
        return (
            <div className="flex min-h-screen w-full items-center justify-center bg-gray-50">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
            </div>
        );
    }

    return <AdminContext.Provider value={{ me }}>{children}</AdminContext.Provider>;
}

export default AdminGuard;
