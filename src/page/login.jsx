import { useState } from "react";
import AuthLayout from "@/layouts/Authlayout.jsx";
import Leftimg from "@/assets/LeftImg.jpg"
import InputField from "@/component/InputField.jsx";
import CustomButton from "@/component/CustomButton.jsx";
import GoogleIcon from "@/assets/GoogleIcon.svg";
import { loginUser } from "@/api/authService.js";

function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [fieldErrors, setFieldErrors] = useState({
        email: "",
        password: "",
    });
    const [generalError, setGeneralError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (fieldErrors[name]) {
            setFieldErrors((prev) => ({ ...prev, [name]: "" }));
        }
        if (generalError) setGeneralError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGeneralError("");
        setSuccessMessage("");
        setFieldErrors({ email: "", password: "" });
        setLoading(true);

        try {
            const response = await loginUser({
                email: formData.email,
                password: formData.password,
            });

            console.log("LOGIN RESPONSE:", response.data);

            const { data } = response;
            if (data.token) {
                localStorage.setItem("token", data.token);
            }

            setSuccessMessage("Login successful! Redirecting...");
            setTimeout(() => {
                window.location.href = "/dashboard"; // change to your landing route
            }, 1000);
        } catch (err) {
            // Axios puts the server's error body in err.response.data
            const data = err.response?.data || {};
            console.log("LOGIN ERROR RESPONSE:", data);

            const newFieldErrors = { email: "", password: "" };
            let matchedAny = false;

            // Shape A: flat validation map -> { email: "...", password: "..." }
            for (const key of Object.keys(newFieldErrors)) {
                if (typeof data[key] === "string") {
                    newFieldErrors[key] = data[key];
                    matchedAny = true;
                }
            }

            // Shape B: Spring default -> { errors: [{ field, defaultMessage }] }
            if (!matchedAny && Array.isArray(data.errors)) {
                data.errors.forEach((fe) => {
                    const field = fe.field;
                    const message = fe.defaultMessage || fe.message;
                    if (field && newFieldErrors.hasOwnProperty(field) && message) {
                        newFieldErrors[field] = message;
                        matchedAny = true;
                    }
                });
            }

            if (matchedAny) {
                setFieldErrors(newFieldErrors);
            } else if (err.response) {
                // Server responded, but not with a field-shaped error (e.g. 401 invalid credentials)
                setGeneralError(data.error || data.message || "Invalid email or password.");
            } else {
                // No response at all -> network/server-down issue
                setGeneralError("Could not reach the server. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <AuthLayout imageSrc={Leftimg}>
                <h1 className="text-center font-bold text-gray-500 text-2xl">Welcome Back</h1>
                <p className="text-center mt-3 text-gray-500 text-sm mb-5">
                    Flow is an AI filmmaking tool that lets you seamlessly create cinematic
                </p>

                {successMessage && (
                    <div className="bg-green-50 border border-green-300 text-green-600 text-sm rounded-md px-4 py-2 mb-4 text-center">
                        {successMessage}
                    </div>
                )}

                {generalError && (
                    <div className="bg-red-50 border border-red-300 text-red-600 text-sm rounded-md px-4 py-2 mb-4 text-center">
                        {generalError}
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                    <InputField
                        type="text"
                        name="email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={handleChange}
                        error={fieldErrors.email}
                    />
                    <InputField
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        error={fieldErrors.password}
                    />

                    <div className="text-right mb-3">
                        <a href="/forgot-password" className="text-xs text-lime-400">
                            Forgot password?
                        </a>
                    </div>

                    <CustomButton
                        type="submit"
                        text={loading ? "Logging in..." : "Login"}
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
                            Login with Google
                        </>
                    }
                />

                <p className="text-center text-gray-500 mt-3 text-sm">
                    Don't have an account?{" "}
                    <a href="/signup" className="text-center text-xs text-lime-400 mt-2">Sign up</a>
                </p>
            </AuthLayout>
        </div>
    );
}
export default Login;