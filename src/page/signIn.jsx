import { useState } from "react";

import Leftimg from "@/assets/LeftImg.jpg"
import GoogleIcon from "@/assets/GoogleIcon.svg";
import AuthLayout from "../layouts/Authlayout.jsx";
import {registerUser} from "../api/authService.js";
import InputField from "../component/InputField.jsx";
import CustomButton from "../component/CustomButton.jsx";
import { useNavigate } from "react-router-dom";

function SignIn() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setFieldErrors({});

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const { confirmPassword, ...payload } = formData;
            const result = await registerUser(payload);
            console.log("Registered:", result);
            navigate("/login");
        } catch (err) {
            console.error(err);
            const data = err.response?.data;

            if (typeof data === "string") {
                // plain text error, e.g. "Username or Email already exists"
                setError(data);
            } else if (data && typeof data === "object") {
                // field-specific validation errors, e.g. { email: "...", password: "..." }
                setFieldErrors(data);
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return(
        <div>
            <AuthLayout imageSrc={Leftimg}>
                <h1 className="text-center font-bold text-gray-500 text-2xl">Create New Account</h1>
                <p className="text-center mt-3 text-gray-500 text-sm mb-5">Flow is an AI filmmaking tool that lets you seamlessly create cinematic</p>

                {error && (
                    <p className="text-center text-red-500 text-sm mb-3">{error}</p>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <InputField
                            type="text"
                            name="username"
                            placeholder="Enter your Name"
                            value={formData.username}
                            onChange={handleChange}
                            error={fieldErrors.username}
                        />
                    </div>

                    <div className="mb-4">
                        <InputField
                            type="text"
                            name="email"
                            placeholder="Enter your email address"
                            value={formData.email}
                            onChange={handleChange}
                            error={fieldErrors.email}
                        />
                    </div>

                    <div className="mb-4">
                        <InputField
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            error={fieldErrors.password}
                        />
                    </div>

                    <div className="mb-4">
                        <InputField
                            type="password"
                            name="confirmPassword"
                            placeholder="Re-enter your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
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
                            <img src={GoogleIcon} alt="Google" className="w-5 h-5 flex flex-row items-center mr-4" />
                            Signin with Google
                        </>
                    }
                />
                <p className="text-center text-gray-500 mt-3 text-sm">
                    You Already have an account <a href="/login" className="text-center text-xs text-lime-400 mt-2">Login</a>
                </p>
            </AuthLayout>
        </div>
    );
}
export default SignIn;