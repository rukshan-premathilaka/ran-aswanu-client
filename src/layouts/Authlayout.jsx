import React from 'react';

const AuthLayout = ({ children }) => {
    return (
        <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center p-0 md:p-4">
            <div className="w-full max-w-4xl min-h-screen md:min-h-[600px] bg-white md:rounded-3xl shadow-xl flex flex-col md:flex-row overflow-hidden">

                <div className="w-full md:w-1/2 bg-gradient-to-b from-[#E8F5E9] to-[#C8E6C9] flex items-center justify-center p-6 rounded-b-[40px] md:rounded-b-none md:rounded-r-[40px]">
                    <div className="w-full flex items-center justify-center md:hidden">
                        {React.Children.toArray(children)[0]}
                    </div>
                    <div className="hidden md:block text-center font-bold text-gray-600">
                        [Desktop Left Image Here]
                    </div>
                </div>

                <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 bg-white">
                    <div className="w-full md:block hidden">
                        {children}
                    </div>
                    <div className="w-full md:hidden">
                        {React.Children.toArray(children)[1]}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AuthLayout;