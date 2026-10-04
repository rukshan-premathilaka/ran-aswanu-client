import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import FormInput from "@/component/FormInput";
import AuthShowcase from "@/component/AuthShowcase";
import ApiService from "@/api/ApiService";
import ENDPOINTS from "@/api/endpoints.js";

const apiService = new ApiService();

const INITIAL_FORM = {
    email: "",
    password: "",
};

function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const [form, setForm] = useState(INITIAL_FORM);
    const [fieldErrors, setFieldErrors] = useState({});
    const [formError, setFormError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));

        if (fieldErrors[name]) {
            setFieldErrors((prev) => {
                const next = { ...prev };
                delete next[name];
                return next;
            });
        }
        if (formError) setFormError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFieldErrors({});
        setFormError("");
        setIsSubmitting(true);

        try {
            const data = await apiService.request(
                ENDPOINTS.AUTH.LOGIN.method,
                ENDPOINTS.AUTH.LOGIN.url,
                form
            );

            if (data?.token) {
                localStorage.setItem("my_app_token", data.token);
            }

            // User Profile වෙතින් role එක ලබාගෙන localStorage හි තැන්පත් කිරීම
            try {
                const me = await apiService.request(
                    ENDPOINTS.ME.GET_PROFILE.method,
                    ENDPOINTS.ME.GET_PROFILE.url
                );

                if (me?.role) {
                    localStorage.setItem("user_role", me.role);
                }

                if (me?.role === "ADMIN") {
                    navigate("/admin", { replace: true });
                    return;
                }
            } catch {
                // If profile call fails, proceed to default redirect
            }

            // කලින් පිවිසීමට උත්සාහ කළ ආරක්ෂිත පිටුවක් ඇත්නම් එතැනට යොමු කිරීම
            const redirectTo = location.state?.from?.pathname || "/home";
            navigate(redirectTo, { replace: true });

        } catch (error) {
            const status = error?.response?.status;
            const data = error?.response?.data;

            if (status === 400 && data && typeof data === "object") {
                setFieldErrors(data);
            } else if (status === 404) {
                setFormError(data?.error || "Invalid email or password.");
            } else if (status === 401 || status === 403) {
                setFormError("Invalid email or password.");
            } else if (status) {
                setFormError(
                    data?.error || `Login failed (${status}). Please try again.`
                );
            } else {
                setFormError("Could not reach the server. Please check your connection.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full bg-white font-sans">
            <AuthShowcase />

            <div className="flex w-full flex-1 items-center justify-center px-6 py-10 sm:px-10 lg:w-1/2 lg:px-16">
                <div className="w-full max-w-sm">
                    <h1 className="text-2xl font-semibold text-neutral-900">
                        Welcome back
                    </h1>
                    <p className="mt-1.5 text-sm text-neutral-500">
                        Log in to manage your farm on Ranaswanu.
                    </p>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
                        {formError && (
                            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {formError}
                            </div>
                        )}

                        <FormInput
                            id="email"
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
                            id="password"
                            name="password"
                            label="Password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            error={fieldErrors.password}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                        />

                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => navigate("/forgot-password")}
                                className="text-sm font-medium text-lime-700 hover:underline cursor-pointer"
                            >
                                Forgot password?
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full rounded-lg bg-lime-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-lime-700 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                        >
                            {isSubmitting ? "Logging in..." : "Log in"}
                        </button>

                        <p className="text-center text-sm text-neutral-500">
                            Don't have an account?{" "}
                            <button
                                type="button"
                                onClick={() => navigate("/register")}
                                className="font-medium text-lime-700 hover:underline cursor-pointer"
                            >
                                Sign up
                            </button>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;