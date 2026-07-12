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
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // stop the browser's default form POST/reload
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
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

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message || "Registration failed");
            }

            const data = await response.json();
            console.log("Registered:", data);
            // e.g. redirect to login page
            window.location.href = "/login";
        } catch (err) {
            setError(err.message);
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

                {error && (
                    <p className="text-center text-red-500 text-sm mb-3">{error}</p>
                )}

                <form onSubmit={handleSubmit}>
                    <InputField
                        type="text"
                        name="name"
                        placeholder="Enter your Name"
                        value={formData.name}
                        onChange={handleChange}
                        error={fieldErrors.username}
                    />
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
                    <InputField
                        type="password"
                        name="confirmPassword"
                        placeholder="Re-enter your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        error={fieldErrors.confirmPassword}
                    />

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