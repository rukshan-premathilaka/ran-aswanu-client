import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MapPin, Calendar, Clock, Truck, Weight } from "lucide-react";
import { api } from "@/api/ApiService.js";
import ENDPOINTS from "@/api/endpoints.js";
import { getApiError } from "@/api/Apierror.js";
import MessageBox from "@/component/MessageBox.jsx";
import Sidebar from "./Sidebar.jsx";
import { USE_DUMMY_DATA, findDummyDelivery } from "./deliveryDummyData.js";

// Backend status values -> words for people. Never print the raw status.
const STATUS_LABEL = {
    PENDING: "Scheduled",
    PICKED_UP: "Picked up",
    IN_TRANSIT: "On the way",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
};
const PROGRESS_STEPS = ["PENDING", "PICKED_UP", "IN_TRANSIT", "DELIVERED"];

// Buttons for TRANSPORT users: [status to send, button text]
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
    const [myRole, setMyRole] = useState(null);
    const [myDeliveries, setMyDeliveries] = useState([]);
    const [isLoading, setIsLoading] = useState(Boolean(deliveryId) || !USE_DUMMY_DATA);
    const [isUpdating, setIsUpdating] = useState(false);
    const [errorText, setErrorText] = useState("");

    // 401 on a protected page = login expired
    const handleError = useCallback(
        (error) => {
            const err = getApiError(error);
            if (err.status === 401) {
                localStorage.removeItem("my_app_token");
                navigate("/login");
                return;
            }
            setErrorText(err.message);
        },
        [navigate]
    );

    // Who am I? (only TRANSPORT users see the status buttons)
    useEffect(() => {
        const loadMe = async () => {
            try {
                setMyRole((await api.call(ENDPOINTS.ME.GET_PROFILE)).role);
            } catch {
                setMyRole(null); // the page still works without it
            }
        };
        loadMe();
    }, []);

    // The first load shows "Loading..." (isLoading starts true); later reloads happen quietly
    const loadDelivery = useCallback(
        async () => {
            try {
                setDelivery(
                    USE_DUMMY_DATA
                        ? findDummyDelivery(deliveryId)
                        : await api.call(ENDPOINTS.DELIVERY.GET_TRACKING(deliveryId))
                );
                setErrorText("");
            } catch (error) {
                handleError(error);
            } finally {
                setIsLoading(false);
            }
        },
        [deliveryId, handleError]
    );

    // With a deliveryId: load it now and again every 30 s and when the tab gets focus
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

    // Without a deliveryId: show my requests that already have a delivery
    useEffect(() => {
        if (deliveryId || USE_DUMMY_DATA) return;
        const loadMine = async () => {
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
            await loadDelivery(); // reload after the backend said OK
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

            <div className="flex-1 flex flex-col">
                <div className="px-8 pt-8 pb-6 max-w-6xl w-full mx-auto">
                    <h1 className="text-2xl font-bold text-gray-800">Track Delivery</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {deliveryId ? "The delivery you selected." : "Your deliveries."}
                    </p>
                </div>

                <div className="flex-1 px-8 pb-10 max-w-6xl w-full mx-auto">
                    <MessageBox type="error" text={errorText} />
                    {isLoading && <p className="text-sm text-gray-500">Loading...</p>}

                    {!deliveryId && !isLoading && (
                        <div className="text-sm text-gray-500 space-y-4">
                            {myDeliveries.length === 0 ? (
                                <p>
                                    You haven't selected a delivery yet.{" "}
                                    <button onClick={() => navigate("/MatchineDeliveries")} className="text-green-700 font-medium underline">
                                        Browse deliveries
                                    </button>
                                </p>
                            ) : (
                                <ul className="max-w-xl space-y-3">
                                    {myDeliveries.map((r) => (
                                        <li key={r.requestId}>
                                            <button
                                                onClick={() => navigate(`/DeliveryTracking?deliveryId=${r.deliveryId}`)}
                                                className="w-full text-left bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-4 flex items-center justify-between gap-3"
                                            >
                                                <span>
                                                    <span className="block text-sm font-semibold text-gray-800">
                                                        {r.pickupLocation} → {r.destination}
                                                    </span>
                                                    <span className="block text-xs text-gray-500 mt-0.5">
                                                        {r.preferredDateTime ? new Date(r.preferredDateTime).toLocaleDateString() : ""}
                                                    </span>
                                                </span>
                                                <span className="text-xs font-semibold bg-green-50 text-green-700 px-2.5 py-1 rounded-lg whitespace-nowrap">
                                                    {STATUS_LABEL[r.status] ?? r.status}
                                                </span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}

                    {delivery && (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-xl">
                            <div className="flex items-start justify-between">
                                <div className="flex gap-3">
                                    <div className="flex flex-col items-center pt-1">
                                        <MapPin size={14} className="text-green-600 fill-green-600" />
                                        <div className="w-px flex-1 bg-gray-200 my-1" style={{ minHeight: 18 }} />
                                        <MapPin size={14} className="text-gray-700 fill-gray-700" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">{delivery.pickupLocation}</p>
                                        <p className="text-sm text-gray-500 mt-2">{delivery.destination}</p>
                                    </div>
                                </div>
                                <span className="text-xs font-semibold bg-green-50 text-green-700 px-2.5 py-1 rounded-lg whitespace-nowrap">
                                    {STATUS_LABEL[delivery.status] ?? delivery.status}
                                </span>
                            </div>

                            {/* 4-step progress bar */}
                            {delivery.status !== "CANCELLED" && (
                                <div className="mt-5">
                                    <div className="flex gap-1.5">
                                        {PROGRESS_STEPS.map((step, i) => (
                                            <div
                                                key={step}
                                                className={`h-1.5 flex-1 rounded-full ${i <= stepIndex ? "bg-green-600" : "bg-gray-200"}`}
                                            />
                                        ))}
                                    </div>
                                    <div className="flex gap-1.5 mt-1.5">
                                        {PROGRESS_STEPS.map((step) => (
                                            <span key={step} className="flex-1 text-[11px] text-gray-500">
                                                {STATUS_LABEL[step]}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-4 text-xs text-gray-500">
                                {when && !Number.isNaN(when.getTime()) && (
                                    <>
                                        <span className="flex items-center gap-1"><Calendar size={13} /> {when.toLocaleDateString()}</span>
                                        <span className="flex items-center gap-1">
                                            <Clock size={13} /> {when.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                        </span>
                                    </>
                                )}
                                {delivery.vehicleType && (
                                    <span className="flex items-center gap-1"><Truck size={13} /> {delivery.vehicleType}</span>
                                )}
                                {delivery.estimatedWeight != null && (
                                    <span className="flex items-center gap-1"><Weight size={13} /> {delivery.estimatedWeight} kg</span>
                                )}
                            </div>

                            {delivery.partnerName && (
                                <p className="text-xs text-gray-500 mt-2">With {delivery.partnerName}</p>
                            )}

                            {/* Only deliverers (TRANSPORT) can change the status */}
                            {myRole === "TRANSPORT" && !USE_DUMMY_DATA && delivery.status !== "DELIVERED" && delivery.status !== "CANCELLED" && (
                                <div className="flex flex-wrap gap-2 mt-5">
                                    {TRANSPORT_ACTIONS.map(([status, text]) => (
                                        <button
                                            key={status}
                                            onClick={() => handleUpdateStatus(status)}
                                            disabled={isUpdating || delivery.status === status}
                                            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold rounded-xl px-4 py-2 text-xs"
                                        >
                                            {text}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}