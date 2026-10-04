import { useState } from "react";
import { Leaf, MapPin } from "lucide-react";
import { fileUrl } from "@/api/fileUrl.js";

// Product card used on the Home page and the Products page. No price is shown.
// Keys come straight from the backend (GET /products): productName, farmerName, category, productImage.
// tall = taller picture (used on the Products page)
export default function ProductTile({ product, tall = false, onClick }) {
    const [imageBroken, setImageBroken] = useState(false);

    const name = product.productName ?? "Product";
    const label = product.category ?? "Fresh Produce";
    const farmer = product.farmerName;
    const location = product.location; // not sent yet (backend to-do); hidden until it arrives
    const image = fileUrl(product.productImage); // null when the product has no picture -> leaf placeholder
    const sub = [farmer, location].filter(Boolean).join(", ");

    return (
        <div
            onClick={onClick}
            onKeyDown={(e) => onClick && (e.key === "Enter" || e.key === " ") && onClick()}
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
            className={`bg-white border border-stone-200 rounded-2xl p-4 flex flex-col gap-3 hover:shadow-lg transition-shadow group ${
                onClick ? "cursor-pointer" : ""
            }`}
        >
            <div className={`w-full ${tall ? "aspect-[3/4]" : "h-40"} rounded-xl overflow-hidden bg-green-50`}>
                {image && !imageBroken ? (
                    <img
                        src={image}
                        alt={name}
                        loading="lazy"
                        onError={() => setImageBroken(true)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Leaf className="w-10 h-10 text-green-600" />
                    </div>
                )}
            </div>
            <div>
                <p className="text-xs text-green-700 font-medium">{label}</p>
                <p className="font-semibold text-stone-900 mt-0.5">{name}</p>
                {sub && (
                    <p className="text-xs text-stone-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" /> {sub}
                    </p>
                )}
            </div>
        </div>
    );
}