import { useEffect, useState } from "react";

const INPUT_CLASS = "w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100";

const EMPTY = {
    vehicleName: "",
    vehicleType: "",
    registrationNumber: "",
    capacityKg: "",
    active: true,
};

export default function VehicleForm({ vehicle, isSaving, errorText, onSave, onCancel }) {
    const [form, setForm] = useState(EMPTY);

    useEffect(() => {
        setForm(vehicle ? {
            vehicleName: vehicle.vehicleName ?? "",
            vehicleType: vehicle.vehicleType ?? "",
            registrationNumber: vehicle.registrationNumber ?? "",
            capacityKg: vehicle.capacityKg ?? "",
            active: vehicle.active !== false,
        } : EMPTY);
    }, [vehicle]);

    const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

    const submit = (e) => {
        e.preventDefault();
        onSave({
            vehicleName: form.vehicleName.trim(),
            vehicleType: form.vehicleType.trim(),
            registrationNumber: form.registrationNumber.trim().toUpperCase(),
            capacityKg: Number(form.capacityKg),
            active: Boolean(form.active),
        });
    };

    return (
        <form onSubmit={submit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="font-semibold text-gray-900">{vehicle ? "Edit vehicle" : "Add vehicle"}</h2>
                    <p className="text-xs text-gray-500 mt-0.5">Only your own vehicles can be assigned to deliveries.</p>
                </div>
                {vehicle && <button type="button" onClick={onCancel} className="text-xs text-gray-500 hover:text-gray-800">Cancel</button>}
            </div>

            {errorText && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">{errorText}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="text-sm text-gray-700">Vehicle name<input className={`${INPUT_CLASS} mt-1.5`} value={form.vehicleName} onChange={(e) => set("vehicleName", e.target.value)} placeholder="My delivery lorry" required maxLength={100} /></label>
                <label className="text-sm text-gray-700">Vehicle type<input className={`${INPUT_CLASS} mt-1.5`} value={form.vehicleType} onChange={(e) => set("vehicleType", e.target.value)} placeholder="Lorry / Van / Pickup" required maxLength={50} /></label>
                <label className="text-sm text-gray-700">Registration number<input className={`${INPUT_CLASS} mt-1.5`} value={form.registrationNumber} onChange={(e) => set("registrationNumber", e.target.value)} placeholder="WP ABC-1234" required maxLength={50} /></label>
                <label className="text-sm text-gray-700">Capacity (kg)<input className={`${INPUT_CLASS} mt-1.5`} type="number" min="1" step="1" value={form.capacityKg} onChange={(e) => set("capacityKg", e.target.value)} placeholder="1500" required /></label>
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={form.active} onChange={(e) => set("active", e.target.checked)} />
                Vehicle is active and available for assignment
            </label>

            <button disabled={isSaving} className="w-full sm:w-auto bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold rounded-xl px-5 py-2.5 text-sm">
                {isSaving ? "Saving..." : vehicle ? "Save changes" : "Add vehicle"}
            </button>
        </form>
    );
}
