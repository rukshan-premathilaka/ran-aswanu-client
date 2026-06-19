import AuthLayout from "@/layouts/Authlayout.jsx";
import InputField from "@/component/InputField.jsx";
import {useState} from "react";
import CustomButton from "@/component/CustomButton.jsx";
import GoogleIcon from "@/assets/GoogleIcon.svg"
import Leftimg from "@/assets/LeftImg.jpg"

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Login Details Submitted:", formData);
    };
    return (
        <div className="flex flex-col md:flex-row min-h-screen md:min-h-[600px] md:rounded-3xl">
            <AuthLayout imageSrc={Leftimg}>
                <h1 className="text-center font-bold text-gray-400 text-2xl mb-4">Login Your Account</h1>
                <p className="text-center mb-10">Ran Aswanna is an AI matchmaking tool that lets you seamlessly create roommates.</p>
                <form onSubmit={handleSubmit} className="w-full">
                <InputField
                    type="text"
                    name="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                />

                <InputField
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                />

                <CustomButton
                    type="submit"
                    text="Log In"
                    className="bg-brandGreen text-white rounded-full py-3 text-sm font-medium hover:bg-[#73b83f]"
                />
                </form>

                <div className="text-center text-xs text-lime-400 mt-2">
                    <a href="http://www.google.com" >forget password ? </a>
                </div>

                <div className="w-full flex items-center justify-center my-6 gap-3">
                    <div className="h-[1px] bg-gray-200 flex-1"></div>
                    <span className="text-3xs text-gray-400 uppercase">or</span>
                    <div className="h-[1px] bg-gray-200 flex-1"></div>
                </div>

                <CustomButton
                    type="submit"
                    onClick ={() => alert("button clicked")}
                    className={"text-center text-gray-500 font-semibold hover:bg-lime-200 flex items-center justify-center "}
                    text={
                        <>
                            <img src={GoogleIcon} alt="Google" className="w-5 h-5 flex flex-row items-center mr-4" />
                            Signin with Google
                        </>
                    }
                />

                <p className="text-center text-sm text-gray-400 text-lg mt-3">
                    You already have an account? <a href="https://www.google.com" className="text-lime-400">Login</a>
                </p>







            </AuthLayout>

        </div>
    )
}
export default Login;