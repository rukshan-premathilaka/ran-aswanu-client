import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import { api } from "@/api/ApiService.js";
import ENDPOINTS from "@/api/endpoints.js";
import { getApiError } from "@/api/apiError.js";
import { fileUrl } from "@/api/fileurl.js";
import { roleLabels, clearRoleStorage, syncRoleStorage } from "@/utils/roleUtils.js";
import BecomeTransportButton from "@/component/BecomeTransportButton.jsx";

// Profile icon for the navbar. Click it to open a small popup with the logged-in user's profile and a Logout button.
// Not logged in: the popup asks the user to log in or create an account.
function ProfileMenu() {
    const navigate = useNavigate();
    const boxRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("my_app_token"));
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorText, setErrorText] = useState("");

    // Load the profile every time the popup opens
    useEffect(() => {
        if (!open || !loggedIn) return;
        let cancelled = false;
        const load = async () => {
            setIsLoading(true);
            setErrorText("");
            try {
                const data = await api.call(ENDPOINTS.ME.GET_PROFILE);
                if (!cancelled) {
                    setProfile(data);
                    syncRoleStorage(data);
                }
            } catch (error) {
                if (cancelled) return;
                const err = getApiError(error);
                if (err.status === 401) {
                    localStorage.removeItem("my_app_token"); // token expired or invalid
                    setLoggedIn(false);
                    return;
                }
                setErrorText(err.message);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };
        load();
        return () => {
            cancelled = true;
        };
    }, [open, loggedIn]);

    // Close with a click outside or the Escape key
    useEffect(() => {
        if (!open) return;
        const onClick = (e) => boxRef.current && !boxRef.current.contains(e.target) && setOpen(false);
        const onKey = (e) => e.key === "Escape" && setOpen(false);
        document.addEventListener("mousedown", onClick);
        window.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onClick);
            window.removeEventListener("keydown", onKey);
        };
    }, [open]);

    const toggle = () => {
        if (!open) setLoggedIn(!!localStorage.getItem("my_app_token")); // check again each time it opens
        setOpen((o) => !o);
    };

    const handleLogout = () => {
        localStorage.removeItem("my_app_token");
        clearRoleStorage();
        localStorage.removeItem("user");
        setLoggedIn(false);
        setProfile(null);
        setOpen(false);
        navigate("/");
    };

    const picture = fileUrl(profile?.profilePictureUrl);

    return (
        <div ref={boxRef} className="relative">
            {/* 👤 User Profile Icon */}
            <button
                type="button"
                onClick={toggle}
                aria-label="Profile"
                aria-haspopup="dialog"
                aria-expanded={open}
                className="flex items-center justify-center p-2 rounded-xl bg-gray-50 text-gray-600 hover:text-[#54B435] hover:bg-green-50 border border-gray-100 transition-all shadow-sm"
            >
                <User size={20} />
            </button>

            {open && (
                <div role="dialog" aria-label="Profile" className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl border border-gray-100 shadow-xl p-5 z-50">
                    {!loggedIn ? (
                        <>
                            <p className="text-sm font-medium text-gray-800 mb-4">
                                Please login first. If you haven't an account, create an account.
                            </p>
                            <div className="flex gap-2">
                                <button type="button" onClick={() => navigate("/register")} className="flex-1 rounded-xl border-2 border-green-600 text-green-700 hover:bg-green-50 font-semibold py-2 text-xs">
                                    Create an Account
                                </button>
                                <button type="button" onClick={() => navigate("/login")} className="flex-1 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold py-2 text-xs">
                                    Login
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            {isLoading && !profile && <p className="text-sm text-gray-500">Loading...</p>}
                            {errorText && <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-3">{errorText}</p>}

                            {profile && (
                                <div className="flex flex-col items-center text-center gap-1 mb-4">
                                    {picture ? (
                                        <img src={picture} alt={profile.username} className="w-16 h-16 rounded-full object-cover border border-gray-100" />
                                    ) : (
                                        <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 text-2xl font-semibold flex items-center justify-center">
                                            {(profile.username ?? "?").charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <p className="mt-2 font-semibold text-gray-900">{profile.username}</p>
                                    <p className="text-sm text-gray-500 break-all">{profile.email}</p>
                                    <div className="mt-1 flex flex-wrap justify-center gap-1.5">
                                        {roleLabels(profile).map((label) => (
                                            <span key={label} className="rounded-full border border-green-200 bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700">{label}</span>
                                        ))}
                                    </div>
                                    {profile.phoneNumber && <p className="mt-2 text-sm text-gray-600">{profile.phoneNumber}</p>}
                                    {profile.address && <p className="text-sm text-gray-600">{profile.address}</p>}
                                </div>
                            )}

                            <BecomeTransportButton
                                className="mb-3"
                                onSuccess={(updated) => setProfile((prev) => ({ ...prev, ...updated }))}
                            />

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2.5 text-sm"
                            >
                                <LogOut size={16} /> Logout
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default ProfileMenu;
