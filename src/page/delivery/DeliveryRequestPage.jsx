import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Users, ArrowRight } from "lucide-react";
import { api } from "@/api/ApiService.js";
import ENDPOINTS from "@/api/endpoints.js";
import { getApiError } from "@/api/apiError.js";
import MessageBox from "@/component/MessageBox.jsx";
import Sidebar from "./Sidebar.jsx";

const INPUT_CLASS =
    "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-green-600 focus:ring-2 focus:ring-green-100 outline-none";

// Label + input + red error text under it
function Field({ label, error, children }) {
    return (
        <div className="min-w-0">
            <label className="block text-sm font-medium text-gray-900 mb-1.5">{label}</label>
            {children}
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        </div>
    );
}

export default function DeliveryRequestPage() {
    const navigate = useNavigate();

    // The role is NOT picked by hand: GET /me -> FARMER = farmer form, TRANSPORT = deliverer form.
    // weight: farmer = weight of the goods, deliverer = weight the vehicle can carry (both sent as estimatedWeight)
    const [myRole, setMyRole] = useState(null);
    const [isLoadingRole, setIsLoadingRole] = useState(true);
    const [form, setForm] = useState({
        goods: "",
        pickupLocation: "",
        destination: "",
        date: "",
        time: "",
        vehicleType: "",
        weight: "",
    });
    const [fieldErrors, setFieldErrors] = useState({});
    const [formError, setFormError] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const setValue = (key) => (e) => setForm({ ...form, [key]: e.target.value });
    const isFarmer = myRole === "FARMER";
    const canCreate = myRole === "FARMER" || myRole === "TRANSPORT";

    useEffect(() => {
        const loadRole = async () => {
            try {
                const me = await api.call(ENDPOINTS.ME.GET_PROFILE);
                setMyRole(me.role);
            } catch (error) {
                const err = getApiError(error);
                if (err.status === 401) {
                    localStorage.removeItem("my_app_token");
                    navigate("/login");
                    return;
                }
                setFormError(err.message);
            } finally {
                setIsLoadingRole(false);
            }
        };
        loadRole();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFieldErrors({});
        setFormError("");

        if (!form.date || !form.time) {
            setFieldErrors({ preferredDateTime: "Choose a date and a time." });
            return;
        }

        // The backend names win: requestType, estimatedWeight (both roles), description, size
        const body = {
            requestType: isFarmer ? "FARMER_REQUEST" : "VEHICLE_OFFER",
            pickupLocation: form.pickupLocation,
            destination: form.destination,
            preferredDateTime: new Date(`${form.date}T${form.time}`).toISOString(),
            vehicleType: form.vehicleType,
            estimatedWeight: Number(form.weight),
            description: form.goods || undefined,
            size: "N/A", // required by the backend until it becomes optional
        };

        setIsSaving(true);
        try {
            await api.call(ENDPOINTS.DELIVERY.CREATE_REQUEST, body);
            // Farmer goes to the vehicles list, deliverer goes to the farmer requests list
            navigate(`/MatchineDeliveries?tab=${isFarmer ? "vehicles" : "requests"}`);
        } catch (error) {
            const err = getApiError(error);
            if (err.status === 401) {
                localStorage.removeItem("my_app_token");
                navigate("/login");
                return;
            }
            setFieldErrors(err.fieldErrors);
            setFormError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoadingRole || !canCreate) {
        return (
            <div className="min-h-screen bg-gray-50 flex">
                <Sidebar active="request" />
                <div className="flex-1 px-8 pt-8 max-w-6xl w-full mx-auto">
                    <h1 className="text-2xl font-bold text-gray-800">Create Request</h1>
                    <div className="mt-4 space-y-3">
                        {isLoadingRole && <p className="text-sm text-gray-500">Loading...</p>}
                        <MessageBox type="error" text={formError} />
                        {!isLoadingRole && !formError && (
                            <p className="text-sm text-gray-500">Only farmers and transport users can create requests.</p>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar active="request" />

            <div className="flex-1 flex flex-col">
                <div className="px-8 pt-8 pb-6 max-w-6xl w-full mx-auto">
                    <h1 className="text-2xl font-bold text-gray-800">Create Request</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Farmers ask for a vehicle. Deliverers offer one.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="flex-1 px-8 pb-10 max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 items-start"
                >
                    <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 space-y-6">
                        <MessageBox type="error" text={formError} />

                        {/* Your role (from your account, not chosen by hand) */}
                        <div className="bg-gray-100 p-1 rounded-xl">
                            <div className="py-2 rounded-lg text-sm font-medium text-center bg-white text-green-700 shadow-sm">
                                {isFarmer ? "Farmer" : "Deliverer"}
                            </div>
                        </div>

                        <Field label={isFarmer ? "Goods (optional)" : "Vehicle name (optional)"} error={fieldErrors.description}>
                            <input
                                className={INPUT_CLASS}
                                placeholder={isFarmer ? "e.g., Carrots" : "e.g., Dual-cab Pickup"}
                                value={form.goods}
                                onChange={setValue("goods")}
                            />
                        </Field>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Field label="Pickup Location" error={fieldErrors.pickupLocation}>
                                <input className={INPUT_CLASS} value={form.pickupLocation} onChange={setValue("pickupLocation")} />
                            </Field>
                            <Field label="Destination" error={fieldErrors.destination}>
                                <input className={INPUT_CLASS} value={form.destination} onChange={setValue("destination")} />
                            </Field>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Field label="Date" error={fieldErrors.preferredDateTime}>
                                <input type="date" className={INPUT_CLASS} value={form.date} onChange={setValue("date")} />
                            </Field>
                            <Field label="Time">
                                <input type="time" className={INPUT_CLASS} value={form.time} onChange={setValue("time")} />
                            </Field>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Field label={isFarmer ? "Vehicle needed" : "Your vehicle"} error={fieldErrors.vehicleType}>
                                <input className={INPUT_CLASS} placeholder="e.g., Lorry" value={form.vehicleType} onChange={setValue("vehicleType")} />
                            </Field>
                            <Field
                                label={isFarmer ? "Weight of goods (kg)" : "Weight you can carry (kg)"}
                                error={fieldErrors.estimatedWeight}
                            >
                                <input type="number" min="1" step="1" className={INPUT_CLASS} placeholder="e.g., 50" value={form.weight} onChange={setValue("weight")} />
                            </Field>
                        </div>

                        <div className="bg-green-50 rounded-xl px-4 py-3 flex items-start gap-3">
                            <Users size={20} className="text-green-600 mt-0.5 shrink-0" />
                            <p className="text-sm text-gray-700">
                                {isFarmer
                                    ? "We'll show you the vehicles available for your delivery."
                                    : "Farmers who need a vehicle like yours will see your offer."}
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={isSaving}
                            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold rounded-xl py-3 flex items-center justify-center gap-2"
                        >
                            {isSaving ? "Saving..." : "Create request"}
                            {!isSaving && <ArrowRight size={18} />}
                        </button>
                    </div>

                    {/* Decorative route picture only. TODO: replace with a real map later */}
                    <div className="lg:sticky lg:top-8 rounded-2xl overflow-hidden h-[420px] relative bg-gradient-to-br from-green-50 via-gray-50 to-green-50 border border-gray-100">
                        <svg viewBox="0 0 400 420" className="w-full h-full">
                            <path d="M 60 60 C 140 120, 180 60, 230 180 S 320 320, 340 380" fill="none" stroke="#16a34a" strokeWidth="4" strokeLinecap="round" />
                        </svg>
                        <MapPin size={28} className="absolute top-8 left-12 text-green-600 fill-green-600" strokeWidth={1.5} />
                        <MapPin size={28} className="absolute bottom-8 right-12 text-gray-700 fill-gray-700" strokeWidth={1.5} />
                    </div>
                </form>
            </div>
        </div>
    );
}