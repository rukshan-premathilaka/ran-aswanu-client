import { useState } from "react";
import AuthLayout from "@/layouts/Authlayout.jsx";
import Leftimg from "@/assets/LeftImg.jpg"
import InputField from "@/component/InputField.jsx";
import CustomButton from "@/component/CustomButton.jsx";
import GoogleIcon from "@/assets/GoogleIcon.svg";

const API_BASE_URL = "http://localhost:8080/api";

function SignIn() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    // one slot per field, plus one for form-wide errors (like 409 conflict)
    const [fieldErrors, setFieldErrors] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [generalError, setGeneralError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // clear that field's error as soon as the user edits it
        if (fieldErrors[name]) {
            setFieldErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGeneralError("");
        setFieldErrors({ username: "", email: "", password: "", confirmPassword: "" });

        if (formData.password !== formData.confirmPassword) {
            setFieldErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }));
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                // Case 1: 409 conflict -> { timestamp, status, error }
                // This is a whole-form error, not tied to one input
                if (data.error && data.status) {
                    setGeneralError(data.error);
                    return;
                }

                // Case 2: 400 validation -> { username: "...", email: "...", password: "..." }
                // Each key here IS a field name, so route it straight into fieldErrors
                const newFieldErrors = { username: "", email: "", password: "", confirmPassword: "" };
                let matchedAny = false;
                for (const key of Object.keys(newFieldErrors)) {
                    if (data[key]) {
                        newFieldErrors[key] = data[key];
                        matchedAny = true;
                    }
                }

                if (matchedAny) {
                    setFieldErrors(newFieldErrors);
                } else {
                    // fallback: something unexpected shaped-wise, just show it generally
                    setGeneralError(data.message || "Registration failed. Please try again.");
                }
                return;
            }

            console.log("Registered:", data);
            window.location.href = "/login";
        } catch (err) {
            setGeneralError("Could not reach the server. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <AuthLayout imageSrc={Leftimg}>
                <h1 className="text-center font-bold text-gray-500 text-2xl">Create New Account</h1>
                <p className="text-center mt-3 text-gray-500 text-sm mb-5">
                    Flow is an AI filmmaking tool that lets you seamlessly create cinematic
                </p>

                {/* General/banner error - shows at the top, e.g. the 409 conflict */}
                {generalError && (
                    <div className="bg-red-50 border border-red-300 text-red-600 text-sm rounded-md px-4 py-2 mb-4 text-center">
                        {generalError}
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-1">
                        {fieldErrors.username && (
                            <p className="text-red-500 text-xs mb-1">{fieldErrors.username}</p>
                        )}
                        <InputField
                            type="text"
                            name="name"
                            placeholder="Enter your Name"
                            value={formData.name}
                            onChange={handleChange}
                            className={fieldErrors.username ? "border border-red-500" : ""}
                        />
                    </div>

                    <div className="mb-1">
                        {fieldErrors.email && (
                            <p className="text-red-500 text-xs mb-1">{fieldErrors.email}</p>
                        )}
                        <InputField
                            type="text"
                            name="email"
                            placeholder="Enter your email address"
                            value={formData.email}
                            onChange={handleChange}
                            className={fieldErrors.email ? "border border-red-500" : ""}
                        />
                    </div>

                    <div className="mb-1">
                        {fieldErrors.password && (
                            <p className="text-red-500 text-xs mb-1">{fieldErrors.password}</p>
                        )}
                        <InputField
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            className={fieldErrors.password ? "border border-red-500" : ""}
                        />
                    </div>

                    <div className="mb-1">
                        {fieldErrors.confirmPassword && (
                            <p className="text-red-500 text-xs mb-1">{fieldErrors.confirmPassword}</p>
                        )}
                        <InputField
                            type="password"
                            name="confirmPassword"
                            placeholder="Re-enter your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={fieldErrors.confirmPassword ? "border border-red-500" : ""}
                        />
                    </div>

                    <CustomButton
                        type="submit"
                        text={loading ? "Creating..." : "Create Account"}
                        disabled={loading}
                        className="bg-brandGreen text-white rounded-full py-3 text-sm font-medium hover:bg-[#73b83f] mt-3"
                    />
                </form>

                <div className="w-full flex items-center justify-center my-6 gap-3">
                    <div className="h-[1px] bg-gray-200 flex-1"></div>
                    <span className="text-3xs text-gray-400 uppercase">or</span>
                    <div className="h-[1px] bg-gray-200 flex-1"></div>
                </div>

                <CustomButton
                    type="button"
                    onClick={() => alert("button clicked")}
                    className="text-center text-gray-500 font-semibold hover:bg-lime-200 flex items-center justify-center"
                    text={
                        <>
                            <img src={GoogleIcon} alt="Google" className="w-5 h-5 mr-4" />
                            Signin with Google
                        </>
                    }
                />

                <p className="text-center text-gray-500 mt-3 text-sm">
                    You Already have an account{" "}
                    <a href="/login" className="text-center text-xs text-lime-400 mt-2">Login</a>
                </p>
            </AuthLayout>
        </div>
    );
}
export default SignIn;