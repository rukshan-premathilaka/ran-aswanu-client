import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormInput from "@/component/FormInput";
import AuthShowcase from "@/component/AuthShowcase";
import ApiService from "@/api/ApiService";
import ENDPOINTS from "@/api/endpoints.js";

const apiService = new ApiService();

const INITIAL_FORM = {
    username: "",
    email: "",
    password: "",
};

function RegisterPage() {
    const navigate = useNavigate();

    const [form, setForm] = useState(INITIAL_FORM);
    const [fieldErrors, setFieldErrors] = useState({});
    const [formError, setFormError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));

        // Clear that field's error the moment the user edits it
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
            await apiService.request(
                ENDPOINTS.AUTH.REGISTER.method,
                ENDPOINTS.AUTH.REGISTER.url,
                form
            );

            setIsSuccess(true);
            setTimeout(() => navigate("/login"), 1500);
        } catch (error) {
            const status = error?.response?.status;
            const data = error?.response?.data;

            if (status === 400 && data && typeof data === "object") {
                // Backend sends { fieldName: "message", ... }
                setFieldErrors(data);
            } else if (status === 409) {
                setFormError(data?.error || "Username or email already exists.");
            } else if (status) {
                setFormError(
                    data?.error || `Registration failed (${status}). Please try again.`
                );
            } else {
                setFormError("Could not reach the server. Please check your connection.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col sm:flex-row min-h-screen w-full bg-white">
            <AuthShowcase />

            <div className="flex w-full flex-1 items-center justify-center px-6 py-10 sm:px-10 lg:w-1/2 lg:px-16">
                <div className="w-full max-w-sm">
                    <h1 className="text-2xl font-semibold text-neutral-900">
                        Create your account
                    </h1>
                    <p className="mt-1.5 text-sm text-neutral-500">
                        Join Ranaswanu to start managing your farm.
                    </p>

                    {isSuccess ? (
                        <div className="mt-8 rounded-lg border border-lime-200 bg-lime-50 px-4 py-3 text-sm text-lime-800">
                            Account created successfully. Redirecting to login…
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
                            {formError && (
                                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    {formError}
                                </div>
                            )}

                            <FormInput
                                id="username"
                                name="username"
                                label="Username"
                                value={form.username}
                                onChange={handleChange}
                                error={fieldErrors.username}
                                placeholder="rukshan_farmer"
                                autoComplete="username"
                            />

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
                                placeholder="At least 8 characters"
                                autoComplete="new-password"
                            />

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full rounded-lg bg-lime-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-lime-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isSubmitting ? "Creating account…" : "Create account"}
                            </button>

                            <p className="text-center text-sm text-neutral-500">
                                Already have an account?{" "}
                                <button
                                    type="button"
                                    onClick={() => navigate("/login")}
                                    className="font-medium text-lime-700 hover:underline"
                                >
                                    Log in
                                </button>
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
