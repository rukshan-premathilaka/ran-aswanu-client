import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MapPin, Calendar, Clock, Truck, Weight } from "lucide-react";
import { api } from "@/api/ApiService.js";
import ENDPOINTS from "@/api/endpoints.js";
import MessageBox from "@/component/MessageBox.jsx";
import Sidebar from "./Sidebar.jsx";
import { USE_DUMMY_DATA, findDummyDelivery } from "./deliveryDummyData.js";

// Local copy of getApiError so these pages work without apiError.js
function getApiError(error) {
    const res = error?.response;
    const data = res?.data ?? error?.data ?? {};
    const rawFieldErrors = data.fieldErrors ?? data.errors;

    return {
        status: res?.status ?? error?.status ?? 0,
        message: data.message || error?.message || "Something went wrong. Please try again.",
        fieldErrors:
            rawFieldErrors && typeof rawFieldErrors === "object" && !Array.isArray(rawFieldErrors)
                ? rawFieldErrors
                : {},
    };
}

export default function DeliveryTrackingPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const deliveryId = searchParams.get("deliveryId");

    const [delivery, setDelivery] = useState(null);
    const [isLoading, setIsLoading] = useState(Boolean(deliveryId));
    const [errorText, setErrorText] = useState("");

    useEffect(() => {
        if (!deliveryId) return;
        const loadDelivery = async () => {
            setIsLoading(true);
            setErrorText("");
            try {
                setDelivery(
                    USE_DUMMY_DATA
                        ? findDummyDelivery(deliveryId)
                        : await api.call(ENDPOINTS.DELIVERY.GET_TRACKING(deliveryId))
                );
            } catch (error) {
                const err = getApiError(error);
                if (err.status === 401) {
                    localStorage.removeItem("my_app_token");
                    navigate("/login");
                    return;
                }
                setErrorText(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        loadDelivery();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deliveryId]);

    const when = delivery ? new Date(delivery.preferredDateTime) : null;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar active="tracking" />

            <div className="flex-1 flex flex-col">
                <div className="px-8 pt-8 pb-6 max-w-6xl w-full mx-auto">
                    <h1 className="text-2xl font-bold text-gray-800">Track Delivery</h1>
                    <p className="text-sm text-gray-500 mt-1">The delivery you selected.</p>
                </div>

                <div className="flex-1 px-8 pb-10 max-w-6xl w-full mx-auto">
                    <MessageBox type="error" text={errorText} />
                    {isLoading && <p className="text-sm text-gray-500">Loading...</p>}

                    {!deliveryId && (
                        <div className="text-sm text-gray-500">
                            You haven't selected a delivery yet.{" "}
                            <button onClick={() => navigate("/MatchineDeliveries")} className="text-green-700 font-medium underline">
                                Browse deliveries
                            </button>
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
                                    {delivery.status}
                                </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1"><Calendar size={13} /> {when.toLocaleDateString()}</span>
                                <span className="flex items-center gap-1">
                                    <Clock size={13} /> {when.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </span>
                                <span className="flex items-center gap-1"><Truck size={13} /> {delivery.vehicleType}</span>
                                <span className="flex items-center gap-1"><Weight size={13} /> {delivery.weight} kg</span>
                            </div>

                            {delivery.partnerName && (
                                <p className="text-xs text-gray-500 mt-2">With {delivery.partnerName}</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}