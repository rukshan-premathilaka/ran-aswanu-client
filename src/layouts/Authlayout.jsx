import React from 'react';

const AuthLayout = ({ children, imageSrc }) => {
    return (
        <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center p-0 md:p-4">
            <div className="w-full max-w-4xl min-h-screen md:min-h-[600px] bg-white md:rounded-3xl shadow-xl flex flex-col md:flex-row overflow-hidden relative">


                <div className="w-full h-[300px] md:h-auto md:w-1/2 relative">
                    <img
                        src={imageSrc}
                        alt="Auth Background"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/10 md:hidden"></div>
                </div>


                <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 bg-[#F0F9ED] md:bg-white relative -mt-10 md:mt-0 rounded-t-[40px] md:rounded-t-none z-10 flex-1">
                    <div className="w-full">
                        {children}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AuthLayout;