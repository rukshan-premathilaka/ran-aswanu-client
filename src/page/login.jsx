import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import LeftSidelayout from "../layouts/leftSidelayout.jsx";
import Button from "@/pages/button.jsx";

function Login() {
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = () => {
        alert("Login Button Clicked!");
    };

    return (
        <LeftSidelayout>
            <div className="w-full text-center flex flex-col gap-2">
                <h1 className="text-3xl font-semibold text-gray-900 tracking-tight ml-auto">Login with you account</h1>
                <p className="text-sm text-gray-600 ml-auto">
                    Flow is an AI filmmaking tool that lets you seamlessly create cinematic
                </p>
            </div>

            <div className="w-full flex flex-col gap-4">
                <input
                    type="email"
                    id="username"
                    placeholder="Enter your email address"
                    className="rounded-full border border-gray-300 px-6 py-3.5 bg-white w-full text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm shadow-sm"
                />

                <div className="relative w-full flex items-center">
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        placeholder="Enter your password"
                        className="rounded-full border border-gray-300 px-6 py-3.5 bg-white w-full text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm shadow-sm"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 text-gray-500 hover:text-green-700 focus:outline-none z-10"
                    >
                        {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                        ) : (
                            <Eye className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </div>

            <div className="w-full flex flex-col items-center gap-3">
                <Button
                    onClick={handleLogin}
                    className={`w-full flex items-center justify-center font-bold rounded-full transition shadow-md border-none cursor-pointer ${className}`}
                >
                    Log In
                </Button>

                <a
                    href="#"
                    className="text-xs font-medium text-gray-600 hover:underline transition"
                >
                    Forgot password?
                </a>
            </div>

            <div className="w-full flex items-center justify-center my-2 relative">
                <div className="border-t border-gray-300 w-full"></div>
                <span className="px-3 text-xs text-gray-500 bg-[#edf8e3] absolute">or</span>
            </div>

            <div className="w-full flex flex-col gap-4">
                <button className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-50 transition text-sm font-medium text-gray-700">
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-.1.14 1.14 2.34l3.22 2.5c1.88-1.73 2.97-4.28 2.97-7.14z"/>
                        <path fill="#34A853" d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.22-2.5c-.9.6-2.05.96-3.32.96-2.55 0-4.72-1.73-5.5-4.05L4.57 18.04C6.55 21.97 10.58 24 12 24z"/>
                        <path fill="#FBBC05" d="M6.5 15.5c-.2-.6-.32-1.24-.32-1.9s.12-1.3.32-1.9l-3.35-2.6C2.42 10.53 2 11.24 2 12s.42 1.47 1.15 2.9l3.35-2.6z"/>
                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.4-3.4C17.96 1.19 15.24 0 12 0 10.58 0 6.55 2.03 4.57 5.96l3.35 2.6c.78-2.32 2.95-4.05 5.5-4.05z"/>
                    </svg>
                    Signin with Google
                </button>

                <p className="text-xs text-gray-600 text-center">
                    Already have an account? <a href="#" className="text-green-700 font-semibold hover:underline">Sign in</a>
                </p>
            </div>
        </LeftSidelayout>
    );
}

export default Login;