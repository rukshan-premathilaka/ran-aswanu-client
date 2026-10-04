import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Calendar, Clock, MapPin, Truck, Users } from "lucide-react";
import { api } from "@/api/ApiService.js";
import ENDPOINTS from "@/api/endpoints.js";
import { getApiError } from "@/api/Apierror.js";
import MessageBox from "@/component/MessageBox.jsx";
import Sidebar from "./Sidebar.jsx";

export default function MatchingDeliveriesPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [role, setRole] = useState(null);
    const [requests, setRequests] = useState([]);
    const [matches, setMatches] = useState([]);
    const [transportBoard, setTransportBoard] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [selectedRequestId, setSelectedRequestId] = useState(Number(searchParams.get("requestId")) || null);
    const [selectedVehicleId, setSelectedVehicleId] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isActioning, setIsActioning] = useState(null);
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

    const loadCustomer = async (nextRequestId = selectedRequestId) => {
        const data = await api.call(ENDPOINTS.DELIVERY.LIST_MY_REQUESTS);
        const own = (Array.isArray(data) ? data : []).filter((r) => r.requestType === "CUSTOMER_REQUEST" || r.requestType === "FARMER_REQUEST");
        setRequests(own);
        const usable = own.filter((r) => r.status === "OPEN" || r.deliveryId);
        const chosen = Number(nextRequestId) || usable[0]?.requestId || null;
        setSelectedRequestId(chosen);
        if (chosen) {
            const result = await api.call(ENDPOINTS.DELIVERY.GET_MATCHES(chosen));
            setMatches(Array.isArray(result?.matches) ? result.matches : []);
        } else {
            setMatches([]);
        }
    };

    const loadTransport = async () => {
        const [board, myVehicles] = await Promise.all([
            api.call(ENDPOINTS.DELIVERY.LIST_CUSTOMER_REQUESTS),
            api.call(ENDPOINTS.DELIVERY.LIST_VEHICLES),
        ]);
        setTransportBoard(Array.isArray(board) ? board : []);
        const activeVehicles = (Array.isArray(myVehicles) ? myVehicles : []).filter((v) => v.active);
        setVehicles(activeVehicles);
        setSelectedVehicleId((prev) => prev || String(activeVehicles[0]?.vehicleId ?? ""));
    };

    const load = async () => {
        setIsLoading(true);
        setErrorText("");
        try {
            const me = await api.call(ENDPOINTS.ME.GET_PROFILE);
            setRole(me.role);
            if (me.role === "TRANSPORT") await loadTransport();
            else await loadCustomer(Number(searchParams.get("requestId")) || selectedRequestId);
        } catch (error) {
            handleError(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    const selectedRequest = requests.find((r) => r.requestId === selectedRequestId);
    const uniqueTransportBoard = useMemo(() => {
        const seen = new Set();
        return transportBoard.filter((item) => {
            const key = item.deliveryId ? `delivery-${item.deliveryId}` : `request-${item.requestId}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }, [transportBoard]);

    const handleJoin = async (requestId) => {
        setIsActioning(`join-${requestId}`);
        setErrorText("");
        try {
            await api.call(ENDPOINTS.DELIVERY.JOIN(selectedRequestId), { withRequestId: requestId });
            await loadCustomer(selectedRequestId);
        } catch (error) {
            handleError(error);
        } finally {
            setIsActioning(null);
        }
    };

    const handleAccept = async (requestId) => {
        if (!selectedVehicleId) {
            setErrorText("Add an active vehicle before accepting a delivery.");
            navigate("/delivery/vehicles");
            return;
        }
        setIsActioning(`accept-${requestId}`);
        setErrorText("");
        try {
            const result = await api.call(ENDPOINTS.DELIVERY.ACCEPT_REQUEST(requestId), { vehicleId: Number(selectedVehicleId) });
            navigate(`/delivery/tracking?deliveryId=${result.deliveryId}`);
        } catch (error) {
            handleError(error);
        } finally {
            setIsActioning(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar active={role === "TRANSPORT" ? "incoming" : "matches"} />
            <main className="flex-1 min-w-0">
                <div className="max-w-7xl mx-auto px-8 py-8">
                    {role === "TRANSPORT" ? (
                        <>
                            <div className="flex items-start justify-between gap-4 flex-wrap">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Delivery Requests</h1>
                                    <p className="text-sm text-gray-500 mt-1">Accept open requests or assign a vehicle to an already-shared route.</p>
                                </div>
                                <button onClick={() => navigate("/delivery/vehicles")} className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-semibold rounded-xl px-4 py-2.5 text-sm flex items-center gap-2"><Truck size={17} /> Manage vehicles</button>
                            </div>

                            {vehicles.length > 0 && (
                                <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 max-w-xl">
                                    <label className="text-sm text-gray-700">Vehicle to assign<select className="w-full mt-1.5 rounded-xl border border-gray-200 px-4 py-2.5 text-sm" value={selectedVehicleId} onChange={(e) => setSelectedVehicleId(e.target.value)}>
                                        {vehicles.map((v) => <option key={v.vehicleId} value={v.vehicleId}>{v.vehicleName} · {v.registrationNumber} · {v.capacityKg} kg</option>)}
                                    </select></label>
                                </div>
                            )}

                            <MessageBox type="error" text={errorText} />
                            {isLoading ? <p className="mt-5 text-sm text-gray-500">Loading requests...</p> : vehicles.length === 0 ? (
                                <div className="mt-5 bg-white rounded-2xl border border-dashed border-gray-300 p-8 text-sm text-gray-600">You need an active vehicle before accepting requests. <button onClick={() => navigate("/delivery/vehicles")} className="text-green-700 font-semibold">Add a vehicle →</button></div>
                            ) : uniqueTransportBoard.length === 0 ? (
                                <div className="mt-5 bg-white rounded-2xl border border-dashed border-gray-300 p-8 text-sm text-gray-600">No delivery requests are waiting for a transport partner.</div>
                            ) : (
                                <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                                    {uniqueTransportBoard.map((item) => (
                                        <article key={item.deliveryId ?? item.requestId} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                                            <div className="flex items-start justify-between gap-3">
                                                <div><p className="text-xs text-green-700 font-semibold">{item.deliveryId ? "SHARED DELIVERY" : "DELIVERY REQUEST"}</p><h3 className="font-semibold text-gray-900 mt-1">{item.description || `Order #${item.orderId ?? "—"}`}</h3></div>
                                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">{item.estimatedWeight} kg</span>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-4 flex items-start gap-2"><MapPin size={15} className="mt-0.5 shrink-0" /> {item.pickupLocation} → {item.destination}</p>
                                            <p className="text-xs text-gray-500 mt-2">Requested by {item.userName}</p>
                                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><Calendar size={13} /> {item.preferredDateTime ? new Date(item.preferredDateTime).toLocaleString() : ""}</p>
                                            <button onClick={() => handleAccept(item.requestId)} disabled={isActioning !== null} className="w-full mt-5 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold rounded-xl px-4 py-2.5 text-sm">{isActioning === `accept-${item.requestId}` ? "Assigning..." : item.deliveryId ? "Assign vehicle" : "Accept & assign vehicle"}</button>
                                        </article>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <div className="flex items-start justify-between gap-4 flex-wrap">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Shared Delivery Matches</h1>
                                    <p className="text-sm text-gray-500 mt-1">Buyers and farmers can share a delivery when the destination road/area matches.</p>
                                </div>
                                <button onClick={() => navigate("/delivery/request")} className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl px-4 py-2.5 text-sm">+ Request delivery</button>
                            </div>

                            <MessageBox type="error" text={errorText} />
                            {isLoading ? <p className="mt-5 text-sm text-gray-500">Loading requests...</p> : requests.length === 0 ? (
                                <div className="mt-5 bg-white rounded-2xl border border-dashed border-gray-300 p-8 text-sm text-gray-600">Create a delivery request from one of your orders to find compatible same-road deliveries.</div>
                            ) : (
                                <div className="mt-6 grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-6">
                                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 h-fit">
                                        <div className="flex items-center gap-2 font-semibold text-gray-900 px-2"><Users size={17} /> My requests</div>
                                        <div className="mt-3 space-y-2">
                                            {requests.map((request) => (
                                                <button key={request.requestId} onClick={() => { setSelectedRequestId(request.requestId); navigate(`/delivery/matches?requestId=${request.requestId}`); }} className={`w-full text-left rounded-xl p-3 border ${request.requestId === selectedRequestId ? "border-green-200 bg-green-50" : "border-gray-100 hover:bg-gray-50"}`}>
                                                    <p className="text-sm font-semibold text-gray-800">{request.description || `Request #${request.requestId}`}</p>
                                                    <p className="text-xs text-gray-500 mt-1 truncate">{request.destination}</p>
                                                    <div className="mt-2 flex items-center justify-between gap-2"><span className="text-[11px] text-gray-500">{request.status}</span>{request.deliveryId && <span className="text-[11px] text-green-700 font-semibold">Delivery #{request.deliveryId}</span>}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <section>
                                        {selectedRequest?.deliveryId ? (
                                            <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-6">
                                                <p className="text-sm font-semibold text-green-700">Shared delivery created</p>
                                                <h2 className="text-xl font-bold text-gray-900 mt-1">Delivery #{selectedRequest.deliveryId}</h2>
                                                <p className="text-sm text-gray-600 mt-3">{selectedRequest.pickupLocation} → {selectedRequest.destination}</p>
                                                <button onClick={() => navigate(`/delivery/tracking?deliveryId=${selectedRequest.deliveryId}`)} className="mt-5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl px-4 py-2.5 text-sm">Track delivery</button>
                                            </div>
                                        ) : selectedRequest ? (
                                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                                <div className="flex items-start justify-between gap-4"><div><p className="text-xs text-green-700 font-semibold">REQUEST #{selectedRequest.requestId}</p><h2 className="text-xl font-bold text-gray-900 mt-1">Find someone on the same route</h2><p className="text-sm text-gray-500 mt-2">{selectedRequest.pickupLocation} → {selectedRequest.destination}</p></div><span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">{selectedRequest.estimatedWeight} kg</span></div>
                                                <div className="mt-5 space-y-3">
                                                    {matches.length === 0 ? <p className="text-sm text-gray-500">No matching request yet. Another buyer/farmer must use the same destination road/area and meet the route/time criteria.</p> : matches.map((match) => (
                                                        <div key={match.requestId} className="border border-gray-100 rounded-xl p-4">
                                                            <div className="flex items-start justify-between gap-3"><div><p className="font-semibold text-gray-800">{match.userName}</p><p className="text-xs text-gray-500 mt-1">{match.pickupLocation} → {match.destination}</p></div><span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-lg">{Math.round(match.matchScore * 100)}% match</span></div>
                                                            <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-500"><span className="flex items-center gap-1"><Clock size={13} /> {match.preferredDateTime ? new Date(match.preferredDateTime).toLocaleString() : ""}</span><span>{match.estimatedSavingPercent}% shared-delivery saving</span></div>
                                                            <button onClick={() => handleJoin(match.requestId)} disabled={isActioning !== null} className="mt-4 w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold rounded-xl px-4 py-2.5 text-sm">{isActioning === `join-${match.requestId}` ? "Creating shared delivery..." : "Share this delivery"}</button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : null}
                                    </section>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
