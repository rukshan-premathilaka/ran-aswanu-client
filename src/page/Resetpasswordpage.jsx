import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import FormInput from "../common/FormInput";
import AuthShowcase from "./AuthShowcase";
import ApiService from "@/api/ApiService";
import ENDPOINTS from "@/api/ENDPOINTS";

const apiService = new ApiService();

function ResetPasswordPage() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const token = searchParams.get("token"); // ?token=... from the email link

	const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
	const [fieldErrors, setFieldErrors] = useState({});
	const [formError, setFormError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);

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

		// Client-side check before hitting the backend at all
		if (form.newPassword !== form.confirmPassword) {
			setFieldErrors({ confirmPassword: "Passwords do not match" });
			return;
		}

		setIsSubmitting(true);
		try {
			await apiService.request(
				ENDPOINTS.AUTH.RESET_PASSWORD.method,
				ENDPOINTS.AUTH.RESET_PASSWORD.url,
				{ token, newPassword: form.newPassword }
			);

			setIsSuccess(true);
			setTimeout(() => navigate("/login"), 1500);
		} catch (error) {
			const status = error?.response?.status;
			const data = error?.response?.data;

			if (status === 400 && data && typeof data === "object") {
				setFieldErrors(data);
			} else if (status === 404 || status === 410) {
				// Adjust if your backend uses a different status for an
				// expired/invalid/already-used token
				setFormError(
					data?.error || "This reset link is invalid or has expired. Please request a new one."
				);
			} else if (status) {
				setFormError(
					data?.error || `Request failed (${status}). Please try again.`
				);
			} else {
				setFormError("Could not reach the server. Please check your connection.");
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	// No token in the URL at all -> the link is malformed, don't even show the form
	if (!token) {
		return (
			<div className="flex min-h-screen w-full bg-white">
				<AuthShowcase />
				<div className="flex w-full flex-1 items-center justify-center px-6 py-10 sm:px-10 lg:w-1/2 lg:px-16">
					<div className="w-full max-w-sm">
						<h1 className="text-2xl font-semibold text-neutral-900">
							Invalid reset link
						</h1>
						<div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
							This link is missing its reset token. Please use the link
							from your email, or request a new one.
						</div>
						<button
							type="button"
							onClick={() => navigate("/forgot-password")}
							className="mt-5 w-full rounded-lg bg-lime-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-lime-700"
						>
							Request a new link
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex min-h-screen w-full bg-white">
			<AuthShowcase />

			<div className="flex w-full flex-1 items-center justify-center px-6 py-10 sm:px-10 lg:w-1/2 lg:px-16">
				<div className="w-full max-w-sm">
					<h1 className="text-2xl font-semibold text-neutral-900">
						Set a new password
					</h1>
					<p className="mt-1.5 text-sm text-neutral-500">
						Choose a new password for your account.
					</p>

					{isSuccess ? (
						<div className="mt-8 rounded-lg border border-lime-200 bg-lime-50 px-4 py-3 text-sm text-lime-800">
							Your password has been reset. Redirecting to login…
						</div>
					) : (
						<form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
							{formError && (
								<div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
									{formError}
								</div>
							)}

							<FormInput
								id="newPassword"
								name="newPassword"
								label="New password"
								type="password"
								value={form.newPassword}
								onChange={handleChange}
								error={fieldErrors.newPassword}
								placeholder="At least 8 characters"
								autoComplete="new-password"
							/>

							<FormInput
								id="confirmPassword"
								name="confirmPassword"
								label="Confirm new password"
								type="password"
								value={form.confirmPassword}
								onChange={handleChange}
								error={fieldErrors.confirmPassword}
								placeholder="Re-enter your new password"
								autoComplete="new-password"
							/>

							<button
								type="submit"
								disabled={isSubmitting}
								className="w-full rounded-lg bg-lime-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-lime-700 disabled:cursor-not-allowed disabled:opacity-60"
							>
								{isSubmitting ? "Resetting…" : "Reset password"}
							</button>
						</form>
					)}
				</div>
			</div>
		</div>
	);
}

export default ResetPasswordPage;