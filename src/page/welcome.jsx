
import CustomButton from "@/component/CustomButton.jsx";
import AuthLayout from "@/layouts/Authlayout.jsx";
import LeftImg from "@/assets/LeftImg.jpg"


const Welcome = () => {
    return (
        <AuthLayout imageSrc={LeftImg}>

            {/*logo */}
            <div className="flex flex-col items-center mb-8">
                <img
                    src={""}
                    alt="Ran Aswanna Logo"
                    className="w-20 h-20 object-contain mb-3"
                />
                <h1 className="text-2xl font-bold text-gray-500 text text-center tracking-wider">RAN ASWANU</h1>
                <p className="text-xs text-gray-500 text-center mt-1 px-4">Ran Aswanna is an AI matchmaking tool that lets you seamlessly create roommates.</p>
            </div>
            {/*langauge selection section*/}
            <div className="w-full text-center mb-6">
                <h2 className="text-lg font-medium text-gray-700 mb-6">Select Your Language</h2>

                {/*custom button*/}
                <div className="flex flex-col gap-4 px-4">
                    <CustomButton
                        text="Sinhala"
                        className="bg-red-400 text-gray-800"
                        onClick={() => console.log("clicked!")}

                    />

                    <CustomButton
                        text="English"
                        className="bg-lime-300 text-gray-800"
                        onClick={() => console.log("clicked!")}
                    />

                    <CustomButton
                        text="Tamil"
                        className="bg-blue-500 text-gray-800"
                        onClick={() => console.log("clicked!")}
                    />

                </div>

            </div>

        </AuthLayout>


    )

}
export default Welcome;