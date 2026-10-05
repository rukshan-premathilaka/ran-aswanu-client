import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import adminService from '@/api/adminService.js';
import { useAdminErrorHandler } from '@/component/admin/adminHooks.js';
import { formatDateTime, roleLabel } from '@/component/admin/adminHelpers.js';
import { btnSecondary, cardCls, labelCls } from '@/component/admin/adminStyles.js';
import ErrorAlert from '@/component/admin/ErrorAlert.jsx'

function AdminSupportDetailPage() {
    const { messageId } = useParams();
    const navigate = useNavigate();
    const handleError = useAdminErrorHandler();

    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [notFound, setNotFound] = useState(false);

    const load = useCallback(async () => {
        setIsLoading(true);
        setErrorMessage('');
        setNotFound(false);
        try {
            setMessage(await adminService.getSupportMessage(messageId));
        } catch (err) {
            const parsed = handleError(err);
            setErrorMessage(parsed.message);
            if (parsed.status === 404 || parsed.status === 400) setNotFound(true);
        } finally {
            setIsLoading(false);
        }
    }, [messageId, handleError]);

    useEffect(() => {
        load();
    }, [load]);

    return (
        <div className="w-full h-full font-sans max-w-3xl mx-auto">
            <Link to="/admin/support" className="text-sm font-bold text-green-700 hover:underline">
                ← Back to support messages
            </Link>

            <h1 className="text-3xl font-bold text-gray-800 mt-3 mb-8">Support Message</h1>

            <ErrorAlert message={errorMessage} onRetry={notFound ? undefined : load} />
            {notFound && (
                <button onClick={() => navigate('/admin/support')} className={btnSecondary}>
                    Go back to the list
                </button>
            )}

            {isLoading && <div className="h-64 animate-pulse rounded-2xl bg-white border border-gray-100" />}

            {!isLoading && message && (
                <div className={cardCls}>
                    <p className={labelCls}>Subject</p>
                    <h2 className="mt-1 text-xl font-bold text-gray-800 break-words">{message.subject}</h2>
                    <p className="mt-1 text-xs text-gray-400">{formatDateTime(message.createdAt)}</p>

                    <div className="mt-6">
                        <p className={labelCls}>Message</p>
                        {/* whitespace-pre-wrap keeps the line breaks of the original text */}
                        <p className="mt-2 rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm leading-relaxed text-gray-700 whitespace-pre-wrap break-words">
                            {message.message}
                        </p>
                    </div>

                    <div className="mt-6 border-t border-gray-100 pt-4">
                        <p className={labelCls}>Sender</p>
                        <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-gray-700">
                            <Link to={`/admin/users/${message.userId}`} className="font-bold text-green-700 hover:underline">
                                {message.username}
                            </Link>
                            <span>{message.email}</span>
                            <span className="text-gray-500">{roleLabel(message.role)}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminSupportDetailPage;
