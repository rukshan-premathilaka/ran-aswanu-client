import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Calendar, Clock, MapPin, Truck, Weight } from "lucide-react";
import { api } from "@/api/ApiService.js";
import ENDPOINTS from "@/api/endpoints.js";
import { getApiError } from "@/api/apiError.js";
import MessageBox from "@/component/MessageBox.jsx";
import Sidebar from "./Sidebar.jsx";
import { hasRole, syncRoleStorage } from "@/utils/roleUtils.js";

const STATUS_LABEL = {
    PENDING: "Scheduled",
    PICKED_UP: "Picked up",
    IN_TRANSIT: "On the way",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
};
const PROGRESS_STEPS = ["PENDING", "PICKED_UP", "IN_TRANSIT", "DELIVERED"];
const TRANSPORT_ACTIONS = [
    ["PICKED_UP", "Mark picked up"],
    ["IN_TRANSIT", "Mark in transit"],
    ["DELIVERED", "Mark delivered"],
];
const POLL_MS = 30000;

export default function DeliveryTrackingPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const deliveryId = searchParams.get("deliveryId");
    const [delivery, setDelivery] = useState(null);
    const [myRole, setMyRole] = useState(false);
    const [myDeliveries, setMyDeliveries] = useState([]);
    const [isLoading, setIsLoading] = useState(Boolean(deliveryId));
    const [isUpdating, setIsUpdating] = useState(false);
    const [errorText, setErrorText] = useState("");

    const handleError = useCallback((error) => {
        const err = getApiError(error);
        if (err.status === 401) {
            localStorage.removeItem("my_app_token");
            navigate("/login");
            return;
        }
        setErrorText(err.message);
    }, [navigate]);

    useEffect(() => {
        api.call(ENDPOINTS.ME.GET_PROFILE)
.then((me) => {
                setMyRole(hasRole(me, "TRANSPORT"));
                syncRoleStorage(me);
            })
            .catch(() => setMyRole(false));
    }, []);

    const loadDelivery = useCallback(async () => {
        if (!deliveryId) return;
        try {
            const data = await api.call(ENDPOINTS.DELIVERY.GET_TRACKING(deliveryId));
            setDelivery(data);
            setErrorText("");
        } catch (error) {
            handleError(error);
        } finally {
            setIsLoading(false);
        }
    }, [deliveryId, handleError]);

    useEffect(() => {
        if (!deliveryId) return;
        loadDelivery();
        const timer = setInterval(loadDelivery, POLL_MS);
        const onFocus = () => loadDelivery();
        window.addEventListener("focus", onFocus);
        return () => {
            clearInterval(timer);
            window.removeEventListener("focus", onFocus);
        };
    }, [deliveryId, loadDelivery]);

    useEffect(() => {
        if (deliveryId) return;
        const loadMine = async () => {
            setIsLoading(true);
            try {
                const data = await api.call(ENDPOINTS.DELIVERY.LIST_MY_REQUESTS);
                setMyDeliveries((Array.isArray(data) ? data : []).filter((r) => r.deliveryId));
            } catch (error) {
                handleError(error);
            } finally {
                setIsLoading(false);
            }
        };
        loadMine();
    }, [deliveryId, handleError]);

    const handleUpdateStatus = async (status) => {
        setIsUpdating(true);
        setErrorText("");
        try {
            await api.call(ENDPOINTS.DELIVERY.UPDATE_STATUS(deliveryId), { status });
            await loadDelivery();
        } catch (error) {
            handleError(error);
        } finally {
            setIsUpdating(false);
        }
    };

    const when = delivery?.preferredDateTime ? new Date(delivery.preferredDateTime) : null;
    const stepIndex = delivery ? PROGRESS_STEPS.indexOf(delivery.status) : -1;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar active="tracking" />
            <main className="flex-1 min-w-0">
                <div className="max-w-6xl mx-auto px-8 py-8">
                    <h1 className="text-2xl font-bold text-gray-900">Track Delivery</h1>
                    <p className="text-sm text-gray-500 mt-1">See route, shared-delivery status and assigned vehicle details.</p>
                    <MessageBox type="error" text={errorText} />

                    {isLoading && <p className="mt-5 text-sm text-gray-500">Loading...</p>}

                    {!deliveryId && !isLoading && (
                        <div className="mt-6">
                            {myDeliveries.length === 0 ? (
                                <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-8 text-sm text-gray-600">
                                    You have no assigned deliveries yet. <button onClick={() => navigate("/delivery/request")} className="text-green-700 font-semibold">Request delivery →</button>
                                </div>
                            ) : (
                                <div className="max-w-2xl space-y-3">
                                    {myDeliveries.map((r) => (
                                        <button key={r.requestId} onClick={() => navigate(`/delivery/tracking?deliveryId=${r.deliveryId}`)} className="w-full text-left bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition p-4 flex items-center justify-between gap-3">
                                            <span><span className="block text-sm font-semibold text-gray-800">{r.pickupLocation} → {r.destination}</span><span className="block text-xs text-gray-500 mt-1">Request #{r.requestId}</span></span>
                                            <span className="text-xs font-semibold bg-green-50 text-green-700 px-2.5 py-1 rounded-lg">{STATUS_LABEL[r.status] ?? r.status}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {delivery && (
                        <div className="mt-6 max-w-2xl bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex gap-3">
                                    <div className="flex flex-col items-center pt-1"><MapPin size={14} className="text-green-600 fill-green-600" /><div className="w-px flex-1 bg-gray-200 my-1 min-h-5" /><MapPin size={14} className="text-gray-700 fill-gray-700" /></div>
                                    <div><p className="text-sm font-semibold text-gray-800">{delivery.pickupLocation}</p><p className="text-sm text-gray-500 mt-2">{delivery.destination}</p></div>
                                </div>
                                <span className="text-xs font-semibold bg-green-50 text-green-700 px-2.5 py-1 rounded-lg">{STATUS_LABEL[delivery.status] ?? delivery.status}</span>
                            </div>

                            {delivery.status !== "CANCELLED" && <div className="mt-5"><div className="flex gap-1.5">{PROGRESS_STEPS.map((step, i) => <div key={step} className={`h-1.5 flex-1 rounded-full ${i <= stepIndex ? "bg-green-600" : "bg-gray-200"}`} />)}</div><div className="flex gap-1.5 mt-1.5">{PROGRESS_STEPS.map((step) => <span key={step} className="flex-1 text-[11px] text-gray-500">{STATUS_LABEL[step]}</span>)}</div></div>}

                            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-5 text-xs text-gray-500">
                                {when && !Number.isNaN(when.getTime()) && <><span className="flex items-center gap-1"><Calendar size={13} /> {when.toLocaleDateString()}</span><span className="flex items-center gap-1"><Clock size={13} /> {when.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span></>}
                                {delivery.vehicleType && <span className="flex items-center gap-1"><Truck size={13} /> Requested: {delivery.vehicleType}</span>}
                                {delivery.estimatedWeight != null && <span className="flex items-center gap-1"><Weight size={13} /> {delivery.estimatedWeight} kg</span>}
                            </div>

                            {delivery.vehicleId && <div className="mt-5 rounded-xl bg-green-50 border border-green-100 p-4"><p className="text-xs font-semibold text-green-800">Assigned vehicle</p><p className="text-sm font-semibold text-gray-900 mt-1">{delivery.vehicleName}</p><p className="text-xs text-gray-600 mt-1">{delivery.registrationNumber} · Capacity {delivery.vehicleCapacityKg} kg</p></div>}
                            {delivery.partnerName && <p className="text-xs text-gray-500 mt-4">Shared with {delivery.partnerName}</p>}

                            {myRole && delivery.status !== "DELIVERED" && delivery.status !== "CANCELLED" && <div className="flex flex-wrap gap-2 mt-5">{TRANSPORT_ACTIONS.map(([status, text]) => <button key={status} onClick={() => handleUpdateStatus(status)} disabled={isUpdating} className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold rounded-xl px-4 py-2 text-xs">{text}</button>)}</div>}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
