import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import adminService, { fileUrl } from '@/api/adminService.js';
import { useAdminErrorHandler, useToast } from '@/component/admin/adminHooks.js';
import {
    DISABLE_PRODUCT_TEXT, ENABLE_PRODUCT_TEXT, formatDate, formatDateTime, formatMoney, formatNumber,
} from '@/component/admin/adminHelpers.js';
import { btnDanger, btnPrimary, btnSecondary, cardCls, labelCls } from '@/component/admin/adminStyles.js';
import StatusBadge, { ProductStatusBadge } from '@/component/admin/StatusBadge.jsx';
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

function AdminProductDetailPage() {
    const { listId } = useParams();
    const navigate = useNavigate();
    const handleError = useAdminErrorHandler();
    const { toast, showToast } = useToast();

    const [product, setProduct] = useState(null);
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
            setProduct(await adminService.getProduct(listId));
        } catch (err) {
            const parsed = handleError(err);
            setErrorMessage(parsed.message);
            if (parsed.status === 404 || parsed.status === 400) setNotFound(true);
        } finally {
            setIsLoading(false);
        }
    }, [listId, handleError]);

    useEffect(() => {
        load();
    }, [load]);

    const confirmToggle = async () => {
        const disable = !product.adminDisabled;
        setIsBusy(true);
        try {
            setProduct(await adminService.setProductStatus(product.listId, disable));
            showToast('success', disable ? 'Product disabled' : 'Product enabled');
        } catch (err) {
            showToast('error', handleError(err).message);
        } finally {
            setIsBusy(false);
            setConfirmOpen(false);
        }
    };

    const img = fileUrl(product?.productImage);

    return (
        <div className="w-full h-full font-sans max-w-4xl mx-auto">
            <Toast toast={toast} />

            <Link to="/admin/products" className="text-sm font-bold text-green-700 hover:underline">
                ← Back to products
            </Link>

            <h1 className="text-3xl font-bold text-gray-800 mt-3 mb-8">Product Details</h1>

            <ErrorAlert message={errorMessage} onRetry={notFound ? undefined : load} />
            {notFound && (
                <button onClick={() => navigate('/admin/products')} className={btnSecondary}>
                    Go back to the list
                </button>
            )}

            {isLoading && <div className="h-64 animate-pulse rounded-2xl bg-white border border-gray-100" />}

            {!isLoading && product && (
                <div className={cardCls}>
                    {!product.farmerActive && (
                        <div className="mb-6 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm font-semibold text-yellow-800">
                            This farmer's account is disabled, so the product is hidden from buyers.
                        </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-4">
                            {img ? (
                                <img src={img} alt={product.productName} className="h-24 w-24 rounded-xl object-cover border border-gray-100" />
                            ) : (
                                <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-gray-100 text-xs text-gray-400">No image</div>
                            )}
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">{product.productName}</h2>
                                <div className="mt-1.5"><ProductStatusBadge status={product.status} /></div>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setConfirmOpen(true)}
                            className={product.adminDisabled ? btnPrimary : btnDanger}
                        >
                            {product.adminDisabled ? 'Enable product' : 'Disable product'}
                        </button>
                    </div>

                    <dl>
                        <Row label="ID">{product.listId}</Row>
                        <Row label="Name">{product.productName}</Row>
                        <Row label="Category">{product.category}</Row>
                        <Row label="Description"><span className="whitespace-pre-line">{product.description || '-'}</span></Row>
                        <Row label="Price per unit">{formatMoney(product.pricePerUnit)}</Row>
                        <Row label="Unit">{product.unitOfMeasurement}</Row>
                        <Row label="Available stock">{formatNumber(product.availableStock)} {product.unitOfMeasurement}</Row>
                        <Row label="Minimum order">{formatNumber(product.minimumOrderQuantity)} {product.unitOfMeasurement}</Row>
                        <Row label="Delivery option">{product.deliveryOption || '-'}</Row>
                        <Row label="Harvested date">{formatDate(product.harvestedDate)}</Row>
                        <Row label="Status"><ProductStatusBadge status={product.status} /></Row>
                        <Row label="Farmer's own switch">
                            {product.listingStatus ? (
                                <StatusBadge tone="green">Published by farmer</StatusBadge>
                            ) : (
                                <StatusBadge tone="gray">Not published</StatusBadge>
                            )}
                        </Row>
                        <Row label="Admin switch">
                            {product.adminDisabled ? (
                                <StatusBadge tone="red">Disabled by admin</StatusBadge>
                            ) : (
                                <StatusBadge tone="green">Not disabled</StatusBadge>
                            )}
                        </Row>
                        {product.adminDisabled && (
                            <Row label="Disabled at">{formatDateTime(product.adminDisabledAt)}</Row>
                        )}
                        <Row label="Farmer">
                            <Link to={`/admin/users/${product.farmerId}`} className="font-semibold text-green-700 hover:underline">
                                {product.farmerName}
                            </Link>
                            <span className="block text-xs text-gray-500">{product.farmerEmail}</span>
                        </Row>
                        <Row label="Farmer account">
                            {product.farmerActive ? (
                                <StatusBadge tone="green">Active</StatusBadge>
                            ) : (
                                <StatusBadge tone="red">Disabled</StatusBadge>
                            )}
                        </Row>
                        <Row label="Created">{formatDateTime(product.createdAt)}</Row>
                        <Row label="Updated">{formatDateTime(product.updatedAt)}</Row>
                    </dl>
                </div>
            )}

            <ConfirmDialog
                open={confirmOpen}
                danger={Boolean(product && !product.adminDisabled)}
                busy={isBusy}
                title={product?.adminDisabled ? 'Enable product' : 'Disable product'}
                message={product?.adminDisabled ? ENABLE_PRODUCT_TEXT : DISABLE_PRODUCT_TEXT}
                confirmText={product?.adminDisabled ? 'Enable product' : 'Disable product'}
                onConfirm={confirmToggle}
                onCancel={() => setConfirmOpen(false)}
            />
        </div>
    );
}

export default AdminProductDetailPage;
