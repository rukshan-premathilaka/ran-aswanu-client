import { Edit3, Trash2, Truck } from "lucide-react";

export default function VehicleCard({ vehicle, onEdit, onDelete, deleting }) {
    return (
        <article className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 shrink-0 rounded-xl bg-green-50 text-green-700 flex items-center justify-center">
                        <Truck size={20} />
                    </div>
                    <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{vehicle.vehicleName}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{vehicle.vehicleType} · {vehicle.registrationNumber}</p>
                    </div>
                </div>
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${vehicle.active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {vehicle.active ? "Active" : "Inactive"}
                </span>
            </div>

            <div className="mt-4 text-sm text-gray-600">Capacity: <span className="font-semibold text-gray-900">{vehicle.capacityKg} kg</span></div>

            <div className="flex gap-2 mt-5">
                <button onClick={() => onEdit(vehicle)} className="flex-1 inline-flex justify-center items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50">
                    <Edit3 size={14} /> Edit
                </button>
                <button onClick={() => onDelete(vehicle)} disabled={deleting} className="flex-1 inline-flex justify-center items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50">
                    <Trash2 size={14} /> {deleting ? "Deleting..." : "Delete"}
                </button>
            </div>
        </article>
    );
}
