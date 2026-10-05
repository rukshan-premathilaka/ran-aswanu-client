import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Package, Truck } from "lucide-react";
import { api } from "@/api/ApiService.js";
import ENDPOINTS from "@/api/endpoints.js";
import { getApiError } from "@/api/Apierror.js";
import MessageBox from "@/component/MessageBox.jsx";
import Sidebar from "./Sidebar.jsx";
import { hasRole, normalizeRoles, syncRoleStorage } from "@/utils/roleUtils.js";

const INPUT_CLASS = "w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100";

const emptyForm = {
    orderId: "",
    pickupLocation: "",
    destination: "",
    date: "",
    time: "",
    vehicleType: "",
    weight: "",
    specialInstructions: "",
};

export default function DeliveryRequestPage() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [orders, setOrders] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [errorText, setErrorText] = useState("");

    const handleError = (error) => {
        const err = getApiError(error);
        if (err.status === 401) {
            localStorage.removeItem("my_app_token");
            navigate("/login");
            return;
        }
        setErrorText(err.message);
    };

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            setIsLoading(true);
            try {
                const me = await api.call(ENDPOINTS.ME.GET_PROFILE);
                if (cancelled) return;
                setProfile(me);
                syncRoleStorage(me);

                const purchaseOrders = await api.call(ENDPOINTS.BUYER_ORDERS.LIST_MINE);
                let combined = (Array.isArray(purchaseOrders) ? purchaseOrders : []).map((o) => ({ ...o, source: "purchase" }));

                if (hasRole(me, "FARMER")) {
                    const sellerOrders = await api.call({ url: "/farmer/orders", method: "GET" });
                    combined = combined.concat((Array.isArray(sellerOrders) ? sellerOrders : []).map((o) => ({ ...o, source: "seller" })));
                }

                const unique = Array.from(new Map(combined.map((o) => [o.orderId, o])).values())
                    .filter((o) => !o.deliveryId);
                setOrders(unique);

                if (unique.length) {
                    const first = unique[0];
                    setForm((prev) => ({
                        ...prev,
                        orderId: String(first.orderId),
                        destination: first.deliveryAddress ?? "",
                        pickupLocation: hasRole(me, "FARMER") ? (me.address ?? "") : (prev.pickupLocation ?? ""),
                    }));
                }
            } catch (error) {
                if (!cancelled) handleError(error);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };
        load();
        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const selectedOrder = useMemo(
        () => orders.find((o) => String(o.orderId) === String(form.orderId)),
        [orders, form.orderId]
    );

    const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

    const selectOrder = (value) => {
        const order = orders.find((o) => String(o.orderId) === String(value));
        setForm((prev) => ({
            ...prev,
            orderId: value,
            destination: order?.deliveryAddress ?? "",
        }));
    };

    const submit = async (event) => {
        event.preventDefault();
        setErrorText("");
        if (!form.orderId) {
            setErrorText("Select an order before creating a delivery request.");
            return;
        }
        if (!form.date || !form.time) {
            setErrorText("Choose the preferred delivery date and time.");
            return;
        }

        setIsSaving(true);
        try {
            const result = await api.call(ENDPOINTS.DELIVERY.CREATE_REQUEST, {
                requestType: "CUSTOMER_REQUEST",
                orderId: Number(form.orderId),
                pickupLocation: form.pickupLocation,
                destination: form.destination,
                preferredDateTime: new Date(`${form.date}T${form.time}`).toISOString(),
                vehicleType: form.vehicleType,
                estimatedWeight: Number(form.weight),
                size: "N/A",
                description: selectedOrder?.firstItemName ? `Order #${form.orderId} - ${selectedOrder.firstItemName}` : `Order #${form.orderId}`,
                specialInstructions: form.specialInstructions || undefined,
            });
            navigate(`/delivery/matches?view=customer&requestId=${result.requestId}`);
        } catch (error) {
            handleError(error);
        } finally {
            setIsSaving(false);
        }
    };


    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar active="request" />
            <main className="flex-1 min-w-0">
                <div className="max-w-4xl mx-auto px-8 py-8">
                    <h1 className="text-2xl font-bold text-gray-900">Request a Delivery</h1>
                    <p className="text-sm text-gray-500 mt-1">Attach the request to an order so a transport partner can deliver it. Matching uses the destination road/area.</p>

                    <form onSubmit={submit} className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                        <MessageBox type="error" text={errorText} />

                        {isLoading ? <p className="text-sm text-gray-500">Loading your orders...</p> : orders.length === 0 ? (
                            <div className="rounded-xl bg-gray-50 border border-gray-200 p-5 text-sm text-gray-600">
                                There are no orders available for delivery yet. Place an order first, or complete the farmer order flow if you are shipping a customer order.
                                <button type="button" onClick={() => navigate("/products")} className="block mt-3 text-green-700 font-semibold">Browse products →</button>
                            </div>
                        ) : (
                            <>
                                <label className="block text-sm text-gray-700">
                                    Order
                                    <select className={`${INPUT_CLASS} mt-1.5`} value={form.orderId} onChange={(e) => selectOrder(e.target.value)} required>
                                        {orders.map((order) => (
                                            <option key={order.orderId} value={order.orderId}>
                                                #{order.orderId} · {order.firstItemName || "Order"} · {order.source === "seller" ? "Farmer order" : "My purchase"}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                {selectedOrder && (
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-600">
                                        <div className="rounded-xl bg-gray-50 p-3 flex items-center gap-2"><Package size={15} /> {selectedOrder.totalAmount ?? ""}</div>
                                        <div className="rounded-xl bg-gray-50 p-3 flex items-center gap-2"><MapPin size={15} /> {selectedOrder.deliveryAddress || "No address"}</div>
                                        <div className="rounded-xl bg-gray-50 p-3 flex items-center gap-2"><Calendar size={15} /> {selectedOrder.orderDate ? new Date(selectedOrder.orderDate).toLocaleDateString() : ""}</div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <label className="text-sm text-gray-700">Pickup road / area<input className={`${INPUT_CLASS} mt-1.5`} value={form.pickupLocation} onChange={(e) => set("pickupLocation", e.target.value)} required placeholder={hasRole(profile, "FARMER") ? "Your farm / pickup area" : "Seller or collection road"} /></label>
                                    <label className="text-sm text-gray-700">Destination road / area<input className={`${INPUT_CLASS} mt-1.5`} value={form.destination} onChange={(e) => set("destination", e.target.value)} required placeholder="e.g. Main Road, Negombo" /></label>
                                    <label className="text-sm text-gray-700">Vehicle type<input className={`${INPUT_CLASS} mt-1.5`} value={form.vehicleType} onChange={(e) => set("vehicleType", e.target.value)} required placeholder="Lorry / Van / Pickup" /></label>
                                    <label className="text-sm text-gray-700">Estimated weight (kg)<input className={`${INPUT_CLASS} mt-1.5`} type="number" min="1" step="1" value={form.weight} onChange={(e) => set("weight", e.target.value)} required placeholder="500" /></label>
                                    <label className="text-sm text-gray-700">Preferred date<input className={`${INPUT_CLASS} mt-1.5`} type="date" value={form.date} min={new Date().toISOString().slice(0, 10)} onChange={(e) => set("date", e.target.value)} required /></label>
                                    <label className="text-sm text-gray-700">Preferred time<input className={`${INPUT_CLASS} mt-1.5`} type="time" value={form.time} onChange={(e) => set("time", e.target.value)} required /></label>
                                </div>

                                <label className="block text-sm text-gray-700">Special instructions (optional)<textarea className={`${INPUT_CLASS} mt-1.5 min-h-24`} value={form.specialInstructions} onChange={(e) => set("specialInstructions", e.target.value)} maxLength={500} /></label>

                                <div className="flex items-center justify-between gap-3 pt-2">
                                    <p className="text-xs text-gray-500">For shared delivery, use the same destination road/area wording as the other customer.</p>
                                    <button disabled={isSaving} className="bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold rounded-xl px-5 py-2.5 text-sm">
                                        {isSaving ? "Creating..." : "Create delivery request"}
                                    </button>
                                </div>
                            </>
                        )}
                    </form>
                </div>
            </main>
        </div>
    );
}
