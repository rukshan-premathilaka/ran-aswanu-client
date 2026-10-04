import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/api/ApiService.js";
import ENDPOINTS from "@/api/endpoints.js";
import { getApiError } from "@/api/apiError.js";
import FormInput from "@/component/FormInput.jsx";
import logoImg from "@/assets/farmerImg/logo.png";
import { notifyAuthChanged, onAuthModalOpen } from "@/utils/authModal.js";

const TOKEN_KEY = "my_app_token";

// Log in / sign up card that opens OVER the current page (the page behind it is blurred).
function AuthDialog({ mode, notice, onModeChange, onClose }) {
    const navigate = useNavigate();
    const isLogin = mode === "login";

    const [form, setForm] = useState({ username: "", email: "", password: "" });
    const [fieldErrors, setFieldErrors] = useState({});
    const [formError, setFormError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Esc closes, and the page behind does not scroll while the popup is open
    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        const oldOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = oldOverflow;
        };
    }, [onClose]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
        if (formError) setFormError("");
    };

    // POST /auth/login -> save the token. Returns true on success.
    const login = async (email, password) => {
        const data = await api.call(ENDPOINTS.AUTH.LOGIN, { email, password });
        if (!data?.token) throw new Error("no token");
        localStorage.setItem(TOKEN_KEY, data.token);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFieldErrors({});
        setFormError("");
        setIsSubmitting(true);

        try {
            if (isLogin) {
                await login(form.email, form.password);
            } else {
                await api.call(ENDPOINTS.AUTH.REGISTER, {
                    username: form.username,
                    email: form.email,
                    password: form.password,
                });
                // Registered. Log in straight away so the user stays on this page, already signed in.
                try {
                    await login(form.email, form.password);
                } catch {
                    onModeChange("login", "Account created. Please log in.");
                    return;
                }
            }
            notifyAuthChanged(); // header shows the profile, pages reload their user data
            onClose();           // blur goes away, the same page stays
        } catch (error) {
            const err = getApiError(error);
            if (err.status === 400 && Object.keys(err.fieldErrors).length > 0) {
                setFieldErrors(err.fieldErrors);
            } else if (isLogin && [401, 403, 404].includes(err.status)) {
                setFormError("Invalid email or password.");
            } else {
                setFormError(err.message);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
            onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-label={isLogin ? "Log in" : "Sign up"}
                className="relative w-full max-w-sm max-h-[92vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
            >
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                >
                    ✕
                </button>

                <img src={logoImg} alt="Ran Aswanu logo" className="h-10 w-10 object-contain" />
                <h2 className="mt-3 text-2xl font-semibold text-neutral-900">
                    {isLogin ? "Welcome back" : "Create your account"}
                </h2>
                <p className="mt-1 text-sm text-neutral-500">
                    {isLogin ? "Log in to continue." : "Join Ran Aswanu in a few seconds."}
                </p>

                {/* Log in / Sign up switch */}
                <div className="mt-5 grid grid-cols-2 gap-1 rounded-xl bg-gray-100 p-1">
                    {[
                        ["login", "Log in"],
                        ["register", "Sign up"],
                    ].map(([key, label]) => (
                        <button
                            key={key}
                            type="button"
                            onClick={() => onModeChange(key)}
                            className={`rounded-lg py-2 text-sm font-medium ${
                                mode === key ? "bg-white text-green-700 shadow-sm" : "text-gray-500"
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
                    {notice && !formError && (
                        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                            {notice}
                        </div>
                    )}
                    {formError && (
                        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {formError}
                        </div>
                    )}

                    {!isLogin && (
                        <FormInput
                            id="auth-username"
                            name="username"
                            label="Username"
                            value={form.username}
                            onChange={handleChange}
                            error={fieldErrors.username}
                            placeholder="rukshan_farmer"
                            autoComplete="username"
                        />
                    )}
                    <FormInput
                        id="auth-email"
                        name="email"
                        label="Email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        error={fieldErrors.email}
                        placeholder="rukshan@example.com"
                        autoComplete="email"
                    />
                    <FormInput
                        id="auth-password"
                        name="password"
                        label="Password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        error={fieldErrors.password}
                        placeholder={isLogin ? "Enter your password" : "At least 8 characters"}
                        autoComplete={isLogin ? "current-password" : "new-password"}
                    />

                    {isLogin && (
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => {
                                    onClose();
                                    navigate("/forgot-password");
                                }}
                                className="text-sm font-medium text-green-700 hover:underline"
                            >
                                Forgot password?
                            </button>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting
                            ? isLogin ? "Logging in…" : "Creating account…"
                            : isLogin ? "Log in" : "Create account"}
                    </button>
                </form>
            </div>
        </div>
    );
}

// Mounted ONCE in AppCopy.jsx. Any page opens it with openAuthModal("login" | "register").
export default function AuthModal() {
    const [dialog, setDialog] = useState(null); // null | { mode, notice }

    useEffect(() => onAuthModalOpen((mode) => setDialog({ mode, notice: "" })), []);

    if (!dialog) return null;
    return (
        <AuthDialog
            key={dialog.mode}  // a fresh form each time the mode changes
            mode={dialog.mode}
            notice={dialog.notice}
            onModeChange={(mode, notice = "") => setDialog({ mode, notice })}
            onClose={() => setDialog(null)}
        />
    );
}