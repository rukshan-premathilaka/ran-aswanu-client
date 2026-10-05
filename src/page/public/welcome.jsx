import { useNavigate } from "react-router-dom"; // 1. Import the hook
import CustomButton from "@/component/CustomButton.jsx";
import AuthLayout from "@/layouts/Authlayout.jsx";
import Leftimg from "@/assets/LeftImg.jpg";
import logoImg from "@/assets/farmerImg/logo.png";

const Welcome = () => {

    const navigate = useNavigate();


    const handleLanguageSelection = (language) => {
        localStorage.setItem("app_language", language);
        navigate("/login");
    };

    return (
        <AuthLayout imageSrc={Leftimg}>
            <div className="flex flex-col items-center mb-8 w-full">
                <div className="w-24 h-24 bg-white p-2 rounded-xl shadow-sm mb-4 border border-blue-400">
                    <img
                        src={logoImg}
                        alt="Ran Aswanu logo"
                        className="w-full h-full object-contain"
                    />
                </div>
                <h1 className="text-xl font-bold text-gray-800 text-center tracking-wider">
                    RAN ASWANU
                </h1>
                <p className="text-2xs text-gray-500 text-center mt-1 px-6 max-w-sm">
                    Ran Aswanu is a farm-to-table marketplace that connects Sri Lankan farmers, buyers and trusted transport partners.
                </p>
            </div>

            <div className="w-full text-center">
                <h2 className="text-md font-semibold text-gray-700 mb-5">
                    Select your language
                </h2>

                <div className="flex flex-col gap-4 px-4 w-full max-w-md mx-auto">
                    {/* 5. Update the onClick handlers to use your new function */}
                    <CustomButton
                        text="Sinhala"
                        className="bg-btnSinhala text-gray-800 border border-yellow-200/50"
                        onClick={() => handleLanguageSelection("Sinhala")}
                    />

                    <CustomButton
                        text="English"
                        className="bg-btnEnglish text-gray-800 border border-blue-200/50"
                        onClick={() => handleLanguageSelection("English")}
                    />

                    <CustomButton
                        text="Tamil"
                        className="bg-btnTamil text-gray-800 border border-red-200/50"
                        onClick={() => handleLanguageSelection("Tamil")}
                    />
                </div>
            </div>
        </AuthLayout>
    );
};

export default Welcome;