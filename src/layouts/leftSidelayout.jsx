import React from 'react';
import img from "@/assets/3985.jpg";

function LeftSidelayout({ children }) {
    return (
        <div className="w-1/2 flex flex-col gap-2 bg-lime-400">
            <div className="flex flex-col gap-2">

            </div>

            <div>
                {children}
            </div>

        </div>


    )
}

export default LeftSidelayout;