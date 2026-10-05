import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/api/ApiService.js";
import ENDPOINTS from "@/api/endpoints.js";
import { getApiError } from "@/api/apiError.js";
import MessageBox from "@/component/MessageBox.jsx";
import VehicleForm from "@/component/delivery/VehicleForm.jsx";
import VehicleCard from "@/component/delivery/VehicleCard.jsx";
import Sidebar from "./Sidebar.jsx";

export default function DeliveryVehiclePage() {
    const navigate = useNavigate();
    const [vehicles, setVehicles] = useState([]);
    const [editingVehicle, setEditingVehicle] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
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

    const loadVehicles = async () => {
        setIsLoading(true);
        try {
            const data = await api.call(ENDPOINTS.DELIVERY.LIST_VEHICLES);
            setVehicles(Array.isArray(data) ? data : []);
        } catch (error) {
            handleError(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadVehicles();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSave = async (body) => {
        setIsSaving(true);
        setErrorText("");
        try {
            const saved = editingVehicle
                ? await api.call(ENDPOINTS.DELIVERY.UPDATE_VEHICLE(editingVehicle.vehicleId), body)
                : await api.call(ENDPOINTS.DELIVERY.CREATE_VEHICLE, body);
            setVehicles((prev) => editingVehicle
                ? prev.map((v) => v.vehicleId === saved.vehicleId ? saved : v)
                : [saved, ...prev]
            );
            setEditingVehicle(null);
        } catch (error) {
            handleError(error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (vehicle) => {
        if (!window.confirm(`Delete ${vehicle.vehicleName}?`)) return;
        setDeletingId(vehicle.vehicleId);
        setErrorText("");
        try {
            await api.call(ENDPOINTS.DELIVERY.DELETE_VEHICLE(vehicle.vehicleId));
            setVehicles((prev) => prev.filter((v) => v.vehicleId !== vehicle.vehicleId));
            if (editingVehicle?.vehicleId === vehicle.vehicleId) setEditingVehicle(null);
        } catch (error) {
            handleError(error);
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar active="vehicles" />
            <main className="flex-1 min-w-0">
                <div className="max-w-6xl w-full mx-auto px-8 pt-8 pb-10">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">My Vehicles</h1>
                            <p className="text-sm text-gray-500 mt-1">Add, update and deactivate the vehicles you use for deliveries.</p>
                        </div>
                        <button onClick={() => { setEditingVehicle(null); setErrorText(""); }} className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl px-4 py-2.5 text-sm">
                            + Add vehicle
                        </button>
                    </div>

                    <div className="mt-6 space-y-6">
                        <MessageBox type="error" text={errorText} />
                        <VehicleForm
                            vehicle={editingVehicle}
                            isSaving={isSaving}
                            errorText={editingVehicle ? "" : ""}
                            onSave={handleSave}
                            onCancel={() => setEditingVehicle(null)}
                        />

                        {isLoading ? <p className="text-sm text-gray-500">Loading vehicles...</p> : vehicles.length === 0 ? (
                            <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-10 text-center text-sm text-gray-500">
                                No vehicles yet. Add your first vehicle so you can accept delivery requests.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                                {vehicles.map((vehicle) => (
                                    <VehicleCard
                                        key={vehicle.vehicleId}
                                        vehicle={vehicle}
                                        onEdit={setEditingVehicle}
                                        onDelete={handleDelete}
                                        deleting={deletingId === vehicle.vehicleId}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
