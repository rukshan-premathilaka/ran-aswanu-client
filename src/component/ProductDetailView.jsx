import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import ProductClick from "@/page/public/ProductClick.jsx";


export default function ProductDetailView({ product, onBack }) {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [product]);

    return (
        <div>
            <div className="px-6 py-3 bg-white border-b border-gray-100">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to products
                </button>
            </div>
            <ProductClick listId={product.listId} initialProduct={product} />
        </div>
    );
}