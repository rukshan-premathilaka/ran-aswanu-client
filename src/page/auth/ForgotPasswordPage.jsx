import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormInput from "@/component/FormInput";
import AuthShowcase from "@/component/AuthShowcase";
import ApiService from "@/api/ApiService";
import ENDPOINTS from "@/api/ENDPOINTS";

const apiService = new ApiService();

function ForgotPasswordPage() {
	const navigate = useNavigate();

	const [email, setEmail] = useState("");
	const [fieldErrors, setFieldErrors] = useState({});
	const [formError, setFormError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);

	const handleChange = (e) => {
		setEmail(e.target.value);
		if (fieldErrors.email) {
			setFieldErrors((prev) => {
				const next = { ...prev };
				delete next.email;
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
				ENDPOINTS.AUTH.FORGOT_PASSWORD.method,
				ENDPOINTS.AUTH.FORGOT_PASSWORD.url,
				{ email }
			);

			setIsSuccess(true);
		} catch (error) {
			const status = error?.response?.status;
			const data = error?.response?.data;

			if (status === 400 && data && typeof data === "object") {
				// @NotBlank / @Email have no custom message() set, so Spring's
				// defaults come through, e.g. "must not be blank" / "must be a
				// well-formed email address"
				setFieldErrors(data);
			} else if (status === 404) {
				setFormError(data?.error || "No account found with that email.");
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

	return (
		<div className="flex min-h-screen w-full bg-white">
			<AuthShowcase />

			<div className="flex w-full flex-1 items-center justify-center px-6 py-10 sm:px-10 lg:w-1/2 lg:px-16">
				<div className="w-full max-w-sm">
					<h1 className="text-2xl font-semibold text-neutral-900">
						Forgot your password?
					</h1>
					<p className="mt-1.5 text-sm text-neutral-500">
						Enter your email and we'll send you a link to reset it.
					</p>

					{isSuccess ? (
						<div className="mt-8 space-y-5">
							<div className="rounded-lg border border-lime-200 bg-lime-50 px-4 py-3 text-sm text-lime-800">
								If an account exists for <span className="font-medium">{email}</span>,
								a reset link has been sent. Check your inbox.
							</div>
							<button
								type="button"
								onClick={() => navigate("/login")}
								className="w-full rounded-lg border border-neutral-300 py-2.5 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-50"
							>
								Back to login
							</button>
						</div>
					) : (
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
								value={email}
								onChange={handleChange}
								error={fieldErrors.email}
								placeholder="rukshan@example.com"
								autoComplete="email"
							/>

							<button
								type="submit"
								disabled={isSubmitting}
								className="w-full rounded-lg bg-lime-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-lime-700 disabled:cursor-not-allowed disabled:opacity-60"
							>
								{isSubmitting ? "Sending…" : "Send reset link"}
							</button>

							<p className="text-center text-sm text-neutral-500">
								Remembered your password?{" "}
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

export default ForgotPasswordPage;