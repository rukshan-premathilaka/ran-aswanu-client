import { useEffect, useState } from "react";
import { Truck } from "lucide-react";
import { api } from "@/api/ApiService.js";
import ENDPOINTS from "@/api/endpoints.js";
import { getApiError } from "@/api/Apierror.js";
import { hasRole, normalizeRoles, roleLabels, syncRoleStorage } from "@/utils/roleUtils.js";


export default function BecomeTransportButton({ onSuccess, className = "" }) {
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            if (!localStorage.getItem("my_app_token")) {
                if (!cancelled) setIsLoading(false);
                return;
            }
            try {
                const data = await api.call(ENDPOINTS.ME.GET_PROFILE);
                if (!cancelled) {
                    setProfile(data);
                    syncRoleStorage(data);
                }
            } catch (err) {
                if (!cancelled) setError(getApiError(err).message || "Could not load your roles.");
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };
        load();
        return () => { cancelled = true; };
    }, []);

    const roles = normalizeRoles(profile);
    const isFarmer = hasRole(roles, "FARMER");
    const isTransport = hasRole(roles, "TRANSPORT");

    const becomeTransport = async () => {
        setError("");
        setMessage("");
        setIsSubmitting(true);
        try {
            const updated = await api.call(ENDPOINTS.ME.BECOME_TRANSPORT);
            setProfile(updated);
            syncRoleStorage(updated);
            setMessage(updated?.message || "You are now a delivery partner.");
            onSuccess?.(updated);
        } catch (err) {
            setError(getApiError(err).message || "Could not become a delivery partner.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading || !localStorage.getItem("my_app_token")) return null;

    if (isFarmer) {
        return (
            <div className={`rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 ${className}`}>
                <div className="flex items-start gap-3">
                    <Truck size={18} className="mt-0.5 text-amber-700 shrink-0" />
                    <div>
                        <p className="text-sm font-semibold text-amber-900">Delivery Partner</p>
                        <p className="text-xs text-amber-800 mt-1">Farmers cannot become delivery partners.</p>
                    </div>
                </div>
            </div>
        );
    }

    if (isTransport) {
        return (
            <div className={`rounded-xl border border-green-200 bg-green-50 px-4 py-3 ${className}`}>
                <div className="flex items-start gap-3">
                    <Truck size={18} className="mt-0.5 text-green-700 shrink-0" />
                    <div>
                        <p className="text-sm font-semibold text-green-900">Delivery Partner enabled</p>
                        <p className="text-xs text-green-800 mt-1">Your roles: {roleLabels(roles).join(" + ")}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={className}>
            <button
                type="button"
                onClick={becomeTransport}
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
                <Truck size={17} />
                {isSubmitting ? "Enabling..." : "Become a Delivery Partner"}
            </button>
            {message && <p className="mt-2 text-xs font-medium text-green-700">{message}</p>}
            {error && <p className="mt-2 text-xs font-medium text-red-600">{error}</p>}
        </div>
    );
}
