import AuthLayout from "@/layouts/Authlayout.jsx";
import Leftimg from "@/assets/LeftImg.jpg"
import InputField from "@/component/InputField.jsx";
import CustomButton from "@/component/CustomButton.jsx";
import GoogleIcon from "@/assets/GoogleIcon.svg";

function signIn() {
    return(
        <div>
            <AuthLayout imageSrc={Leftimg}>
                    <h1 className="text-center font-bold text-gray-500 text-2xl"> Create New Account</h1>
                    <p className="text-center mt-3 text-gray-500 text-sm mb-5">Flow is an AI filmmaking tool that lets you seamlessly create cinematic</p>

                   <form>
                        <InputField
                            type="text"
                            name="name"
                            placeholder="Enter your Name"
                            value={""}
                            onChange={""}
                        />
                        <InputField
                            type="text"
                            name="email"
                            placeholder="Enter your email address"
                            value={""}
                            onChange={""}
                        />


                        <InputField
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={""}
                            onChange={""}
                        />

                        <InputField
                            type="password"
                            name="password"
                            placeholder="Re-enter your password"
                            value={""}
                            onChange={""}
                        />
                   </form>

                    <CustomButton
                        type ="submit"
                        text="Create Account"
                        onClick={signIn}
                        className="bg-brandGreen text-white rounded-full py-3 text-sm font-medium hover:bg-[#73b83f mt-3     ]"
                    />

                    <div className="w-full flex items-center justify-center my-6 gap-3">
                        <div className="h-[1px] bg-gray-200 flex-1"></div>
                        <span className="text-3xs text-gray-400 uppercase">or</span>
                        <div className="h-[1px] bg-gray-200 flex-1"></div>
                    </div>

                    <CustomButton
                        type="submit"
                        onClick ={() => alert("button clicked")}
                        className={"text-center text-gray-500 font-semibold hover:bg-lime-200 flex items-center justify-center  "}
                        text={
                            <>
                                <img src={GoogleIcon} alt="Google" className="w-5 h-5 flex flex-row items-center mr-4" />
                                Signin with Google
                            </>
                        }
                    />
                    <p className="text-center text-gray-500 mt-3 text-sm">You Already have an account <a href="https://www.google.com" className="text-center text-xs text-lime-400 mt-2">Login</a></p>









            </AuthLayout>
        </div>
    );
}
export default signIn;