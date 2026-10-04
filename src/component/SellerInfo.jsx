import { MapPin } from "lucide-react";

function SellerInfo({ seller, showStoreButton = true }) {
    return (
        <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-3">
                {seller.image ? (
                    <img
                        src={seller.image}
                        alt={seller.name}
                        className="w-11 h-11 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-11 h-11 rounded-full bg-green-100 text-green-700 font-semibold flex items-center justify-center">
                        {(seller.name ?? "?").charAt(0).toUpperCase()}
                    </div>
                )}
                <div>
                    <p className="font-medium text-gray-800">{seller.name}</p>
                    {seller.location && (
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                            <MapPin size={14} />
                            <span>{seller.location}</span>
                        </div>
                    )}
                </div>
            </div>
            {showStoreButton && (
                <button className="text-sm font-medium text-green-600 hover:text-green-700">
                    Visit Store
                </button>
            )}
        </div>
    );
}

export default SellerInfo;