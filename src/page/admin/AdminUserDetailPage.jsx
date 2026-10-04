import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import adminService, { fileUrl } from '@/api/adminService.js';
import { useAdminMe } from '@/component/admin/AdminContext.js';
import { useAdminErrorHandler, useToast } from '@/component/admin/adminHooks.js';
import {
    DISABLE_USER_TEXT, ENABLE_USER_TEXT, formatDateTime, formatNumber, roleLabel,
} from '@/component/admin/adminHelpers.js';
import { btnDanger, btnPrimary, btnSecondary, cardCls, labelCls } from '@/component/admin/adminStyles.js';
import { UserStatusBadge } from '@/component/admin/StatusBadge.jsx';
import ErrorAlert from '@/component/admin/ErrorAlert.jsx';
import ConfirmDialog from '@/component/admin/ConfirmDialog.jsx';
import Toast from '@/component/admin/Toast.jsx';

function Row({ label, children }) {
    return (
        <div className="py-3 border-b border-gray-50 last:border-b-0 grid grid-cols-3 gap-4">
            <dt className={labelCls}>{label}</dt>
            <dd className="col-span-2 text-sm text-gray-800 break-words">{children}</dd>
        </div>
    );
}

function AdminUserDetailPage() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const me = useAdminMe();
    const handleError = useAdminErrorHandler();
    const { toast, showToast } = useToast();

    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [notFound, setNotFound] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [isBusy, setIsBusy] = useState(false);

    const load = useCallback(async () => {
        setIsLoading(true);
        setErrorMessage('');
        setNotFound(false);
        try {
            setUser(await adminService.getUser(userId));
        } catch (err) {
            const parsed = handleError(err);
            setErrorMessage(parsed.message);
            if (parsed.status === 404 || parsed.status === 400) setNotFound(true);
        } finally {
            setIsLoading(false);
        }
    }, [userId, handleError]);

    useEffect(() => {
        load();
    }, [load]);

    const confirmToggle = async () => {
        const makeActive = !user.active;
        setIsBusy(true);
        try {
            // Response = the updated user detail -> replace the page data with it
            setUser(await adminService.setUserStatus(user.userId, makeActive));
            showToast('success', makeActive ? 'Account enabled' : 'Account disabled');
        } catch (err) {
            showToast('error', handleError(err).message);
        } finally {
            setIsBusy(false);
            setConfirmOpen(false);
        }
    };

    // Hide the button for ADMIN users and for the logged-in admin (the server refuses these too)
    const canToggle = user && user.role !== 'ADMIN' && user.userId !== me?.userId;
    const avatar = fileUrl(user?.profilePictureUrl);

    return (
        <div className="w-full h-full font-sans max-w-4xl mx-auto">
            <Toast toast={toast} />

            <Link to="/admin/users" className="text-sm font-bold text-green-700 hover:underline">
                ← Back to users
            </Link>

            <h1 className="text-3xl font-bold text-gray-800 mt-3 mb-8">User Details</h1>

            <ErrorAlert message={errorMessage} onRetry={notFound ? undefined : load} />
            {notFound && (
                <button onClick={() => navigate('/admin/users')} className={btnSecondary}>
                    Go back to the list
                </button>
            )}

            {isLoading && <div className="h-64 animate-pulse rounded-2xl bg-white border border-gray-100" />}

            {!isLoading && user && (
                <div className={cardCls}>
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-4">
                            {avatar ? (
                                <img src={avatar} alt={user.username} className="h-20 w-20 rounded-full object-cover border border-gray-100" />
                            ) : (
                                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-2xl font-bold text-green-800">
                                    {user.username?.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">{user.username}</h2>
                                <div className="mt-1.5"><UserStatusBadge active={user.active} /></div>
                            </div>
                        </div>

                        {canToggle && (
                            <button
                                type="button"
                                onClick={() => setConfirmOpen(true)}
                                className={user.active ? btnDanger : btnPrimary}
                            >
                                {user.active ? 'Disable account' : 'Enable account'}
                            </button>
                        )}
                    </div>

                    <dl>
                        <Row label="ID">{user.userId}</Row>
                        <Row label="Username">{user.username}</Row>
                        <Row label="Email">{user.email}</Row>
                        <Row label="Role">{roleLabel(user.role)}</Row>
                        <Row label="Phone">{user.phoneNumber || '-'}</Row>
                        <Row label="Address">{user.address || '-'}</Row>
                        <Row label="Registered">{formatDateTime(user.createdAt)}</Row>
                        <Row label="Account status"><UserStatusBadge active={user.active} /></Row>
                        <Row label="Products">
                            {formatNumber(user.productCount)}
                            {user.productCount > 0 && (
                                <Link to={`/admin/products?farmerId=${user.userId}`} className="ml-3 text-xs font-bold text-green-700 hover:underline">
                                    View products
                                </Link>
                            )}
                        </Row>
                        <Row label="Orders placed">{formatNumber(user.orderCount)}</Row>
                        <Row label="Support messages">
                            {formatNumber(user.supportMessageCount)}
                            {user.supportMessageCount > 0 && (
                                <Link to={`/admin/support?userId=${user.userId}`} className="ml-3 text-xs font-bold text-green-700 hover:underline">
                                    View messages
                                </Link>
                            )}
                        </Row>
                    </dl>
                </div>
            )}

            <ConfirmDialog
                open={confirmOpen}
                danger={Boolean(user?.active)}
                busy={isBusy}
                title={user?.active ? 'Disable account' : 'Enable account'}
                message={
                    user?.active ? DISABLE_USER_TEXT : ENABLE_USER_TEXT
                }
                confirmText={user?.active ? 'Disable account' : 'Enable account'}
                onConfirm={confirmToggle}
                onCancel={() => setConfirmOpen(false)}
            />
        </div>
    );
}

export default AdminUserDetailPage;
