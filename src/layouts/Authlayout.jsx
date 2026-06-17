import React from 'react';

const AuthLayout = ({ children, imageSrc }) => {
    return (

        <div className="min-h-screen w-full bg-white flex items-center justify-center p-0 md:p-4">


            <div className="w-full max-w-6xl min-h-[90vh] md:min-h-[80vh] bg-white md:rounded-3xl md:shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">


                <div className="hidden md:block relative w-full h-full min-h-[500px]">
                    <img
                        src={imageSrc}
                        alt="Authentication Background"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                </div>


                <div className="w-full bg-brandLightBg flex flex-col justify-center items-center px-6 py-12 md:px-12 lg:px-20 rounded-t-[40px] md:rounded-t-none">


                    <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center">
                        {children}
                    </div>

                </div>

            </div>
        </div>
    );
};

export default AuthLayout;