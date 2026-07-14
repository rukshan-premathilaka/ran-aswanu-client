// ResetPasswordPage.jsx
import { useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff, Lock, CheckCircle2, Sprout } from "lucide-react";

function getPasswordStrength(password) {
	if (!password) return 0;
	let score = 0;
	if (password.length >= 8) score++;
	if (password.length >= 12) score++;
	if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
	if (/[0-9]/.test(password)) score++;
	if (/[^A-Za-z0-9]/.test(password)) score++;
	return Math.min(score, 4);
}

const strengthLabels = ["Too short", "Weak", "Fair", "Good", "Strong"];

function ResetPasswordPage() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const token = searchParams.get("token");

	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);

	const strength = useMemo(() => getPasswordStrength(newPassword), [newPassword]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		if (newPassword !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		if (strength < 2) {
			setError("Choose a stronger password (at least 8 characters)");
			return;
		}

		setLoading(true);
		try {
			await axios.post("http://localhost:8080/api/auth/reset-password", {
				token,
				newPassword,
			});
			setSuccess(true);
			setTimeout(() => navigate("/login"), 2000);
		} catch (err) {
			setError(
				err.response?.data?.error || "This link may have expired. Request a new one."
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-[#FAFAF3] flex items-center justify-center p-4 relative overflow-hidden">
			{/* Soft ambient background blobs */}
			<div className="absolute -top-24 -left-24 w-96 h-96 bg-[#ECFCCB] rounded-full blur-3xl opacity-70" />
			<div className="absolute -bottom-32 -right-16 w-96 h-96 bg-[#D9F99D] rounded-full blur-3xl opacity-50" />

			<div className="relative w-full max-w-md">
				<div className="bg-white rounded-3xl shadow-xl shadow-lime-900/5 border border-lime-100 p-8 sm:p-10">

					{!token ? (
						<div className="text-center py-6">
							<div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-red-50 flex items-center justify-center">
								<Lock className="w-6 h-6 text-red-400" />
							</div>
							<h2 className="text-xl font-semibold text-[#1A2E05]">Invalid reset link</h2>
							<p className="mt-2 text-sm text-[#57633F]">
								This link is missing or malformed. Request a new password reset email to continue.
							</p>
						</div>
					) : success ? (
						<div className="text-center py-6">
							<div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-lime-100 flex items-center justify-center">
								<CheckCircle2 className="w-7 h-7 text-lime-600" />
							</div>
							<h2 className="text-xl font-semibold text-[#1A2E05]">Password reset</h2>
							<p className="mt-2 text-sm text-[#57633F]">
								Taking you to the login page...
							</p>
						</div>
					) : (
						<>
							<div className="w-12 h-12 rounded-2xl bg-lime-100 flex items-center justify-center mb-5">
								<Sprout className="w-6 h-6 text-lime-600" />
							</div>

							<h2 className="text-2xl font-semibold text-[#1A2E05]">Set a new password</h2>
							<p className="mt-1 mb-6 text-sm text-[#57633F]">
								Choose something you haven't used before.
							</p>

							<form onSubmit={handleSubmit} className="space-y-5">
								<div>
									<label className="block text-sm font-medium text-[#1A2E05] mb-1.5">
										New password
									</label>
									<div className="relative">
										<input
											type={showPassword ? "text" : "password"}
											value={newPassword}
											onChange={(e) => setNewPassword(e.target.value)}
											placeholder="Enter new password"
											required
											className="w-full rounded-xl border border-lime-200 bg-lime-50/30 px-4 py-3 pr-11 text-sm text-[#1A2E05] placeholder:text-[#9CA88A] focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent transition"
										/>
										<button
											type="button"
											onClick={() => setShowPassword((v) => !v)}
											className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA88A] hover:text-lime-600 transition"
											tabIndex={-1}
										>
											{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
										</button>
									</div>

									{newPassword && (
										<div className="mt-2">
											<div className="flex gap-1 h-1">
												{[0, 1, 2, 3].map((i) => (
													<div
														key={i}
														className={`flex-1 rounded-full transition-colors ${
															i < strength
																? strength <= 1
																	? "bg-orange-300"
																	: strength === 2
																		? "bg-lime-400"
																		: "bg-lime-600"
																: "bg-lime-100"
														}`}
													/>
												))}
											</div>
											<p className="mt-1 text-xs text-[#8A9678]">{strengthLabels[strength]}</p>
										</div>
									)}
								</div>

								<div>
									<label className="block text-sm font-medium text-[#1A2E05] mb-1.5">
										Confirm password
									</label>
									<div className="relative">
										<input
											type={showConfirm ? "text" : "password"}
											value={confirmPassword}
											onChange={(e) => setConfirmPassword(e.target.value)}
											placeholder="Re-enter new password"
											required
											className="w-full rounded-xl border border-lime-200 bg-lime-50/30 px-4 py-3 pr-11 text-sm text-[#1A2E05] placeholder:text-[#9CA88A] focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent transition"
										/>
										<button
											type="button"
											onClick={() => setShowConfirm((v) => !v)}
											className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA88A] hover:text-lime-600 transition"
											tabIndex={-1}
										>
											{showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
										</button>
									</div>
								</div>

								{error && (
									<p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
								)}

								<button
									type="submit"
									disabled={loading}
									className="w-full rounded-xl bg-lime-600 hover:bg-lime-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-3 text-sm transition shadow-sm shadow-lime-600/20"
								>
									{loading ? "Resetting..." : "Reset password"}
								</button>
							</form>
						</>
					)}
				</div>
			</div>
		</div>
	);
}

export default ResetPasswordPage;