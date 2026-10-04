import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/api/ApiService.js";
import ENDPOINTS from "@/api/endpoints.js";
import { getApiError } from "@/api/Apierror.js";
import MessageBox from "@/component/MessageBox.jsx";

const INPUT_CLASS =
    "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-green-600 focus:ring-2 focus:ring-green-100 outline-none";

// Only these two values are accepted by the backend. Never ask for or send card numbers.
const PAYMENT_METHODS = [
    { value: "CASH_ON_DELIVERY", label: "Cash on delivery" },
    { value: "BANK_TRANSFER", label: "Bank transfer" },
];

function Field({ label, error, children }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">{label}</label>
            {children}
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        </div>
    );
}

// items: [{ listId, productName, pricePerUnit, unitOfMeasurement, minimumOrderQuantity, availableStock, quantity }]
// POST /buyer/orders. Success returns { orders: [...] } (one order per farmer).
export default function CheckoutModal({ items, onClose, onSuccess }) {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        deliveryAddress: "",
        contactNumber: "",
        paymentMethod: "CASH_ON_DELIVERY",
        notes: "",
    });
    const [fieldErrors, setFieldErrors] = useState({});
    const [formError, setFormError] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [placedCount, setPlacedCount] = useState(null);

    const setValue = (key) => (e) => setForm({ ...form, [key]: e.target.value });
    const total = items.reduce((sum, i) => sum + Number(i.pricePerUnit) * Number(i.quantity), 0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFieldErrors({});
        setFormError("");

        // Same rules the backend checks: at least the minimum order and not above the stock
        for (const item of items) {
            const qty = Number(item.quantity);
            if (!(qty > 0)) return setFormError(`Enter a quantity for ${item.productName}.`);
            if (item.minimumOrderQuantity && qty < Number(item.minimumOrderQuantity)) {
                return setFormError(`${item.productName}: the minimum order is ${item.minimumOrderQuantity} ${item.unitOfMeasurement ?? ""}.`);
            }
            if (item.availableStock != null && qty > Number(item.availableStock)) {
                return setFormError(`${item.productName}: only ${item.availableStock} ${item.unitOfMeasurement ?? ""} in stock.`);
            }
        }

        setIsSaving(true);
        try {
            const result = await api.call(ENDPOINTS.BUYER_ORDERS.PLACE_ORDER, {
                items: items.map((i) => ({ listId: i.listId, quantity: Number(i.quantity) })),
                deliveryAddress: form.deliveryAddress,
                contactNumber: form.contactNumber,
                paymentMethod: form.paymentMethod,
                notes: form.notes || undefined,
            });
            const orders = Array.isArray(result?.orders) ? result.orders : [];
            setPlacedCount(orders.length || 1);
            onSuccess?.(orders);
        } catch (error) {
            const err = getApiError(error);
            if (err.status === 401) {
                localStorage.removeItem("my_app_token");
                navigate("/login");
                return;
            }
            // 403 "Only buyers can place orders" and 409/400 stock messages arrive here as readable text
            setFieldErrors(err.fieldErrors);
            setFormError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-stone-900/40" onClick={onClose}>
            <div
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-label="Checkout"
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6"
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900">Checkout</h2>
                    <button onClick={onClose} aria-label="Close" className="text-gray-400 hover:text-gray-600">✕</button>
                </div>

                {placedCount !== null ? (
                    <div className="space-y-4">
                        <MessageBox
                            type="success"
                            text={`Order placed! ${placedCount} ${placedCount === 1 ? "order was" : "orders were"} created (one per farmer).`}
                        />
                        <button
                            onClick={onClose}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl py-3 text-sm"
                        >
                            Done
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <MessageBox type="error" text={formError} />

                        <ul className="divide-y divide-gray-100 rounded-xl border border-gray-100 text-sm">
                            {items.map((i) => (
                                <li key={i.listId} className="flex justify-between gap-3 px-3 py-2">
                                    <span className="text-gray-700">
                                        {i.productName} × {i.quantity} {i.unitOfMeasurement}
                                    </span>
                                    <span className="font-medium text-gray-900 whitespace-nowrap">
                                        LKR {(Number(i.pricePerUnit) * Number(i.quantity)).toFixed(2)}
                                    </span>
                                </li>
                            ))}
                            <li className="flex justify-between px-3 py-2 font-semibold">
                                <span>Total</span>
                                <span>LKR {total.toFixed(2)}</span>
                            </li>
                        </ul>

                        <Field label="Delivery address" error={fieldErrors.deliveryAddress}>
                            <input className={INPUT_CLASS} value={form.deliveryAddress} onChange={setValue("deliveryAddress")} placeholder="No 45, Temple Road, Badulla" />
                        </Field>
                        <Field label="Contact number" error={fieldErrors.contactNumber}>
                            <input className={INPUT_CLASS} value={form.contactNumber} onChange={setValue("contactNumber")} placeholder="0771234567" />
                        </Field>
                        <Field label="Payment method" error={fieldErrors.paymentMethod}>
                            <select className={INPUT_CLASS} value={form.paymentMethod} onChange={setValue("paymentMethod")}>
                                {PAYMENT_METHODS.map((m) => (
                                    <option key={m.value} value={m.value}>{m.label}</option>
                                ))}
                            </select>
                        </Field>
                        <Field label="Notes (optional)" error={fieldErrors.notes}>
                            <input className={INPUT_CLASS} value={form.notes} onChange={setValue("notes")} placeholder="Call before delivery" />
                        </Field>

                        <button
                            type="submit"
                            disabled={isSaving}
                            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold rounded-xl py-3 text-sm"
                        >
                            {isSaving ? "Placing order..." : "Place order"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}