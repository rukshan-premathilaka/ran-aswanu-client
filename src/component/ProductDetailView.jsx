import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import ProductClick from "@/page/public/ProductClick.jsx";

// Opens the product detail page (ProductClick, used as-is) for one product, with a back bar on top.
// onBack = go back to the list the user came from.
export default function ProductDetailView({ product, onBack }) {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [product]);

    const name = product.name ?? product.productName ?? product.title ?? "Product";
    const farmer = product.farmerName ?? product.farmer ?? product.sellerName;
    const location = product.location ?? product.district;
    const price = product.price ?? product.pricePerKg ?? product.unitPrice;
    const image = product.imageUrl ?? product.image;
    const description =
        product.description ??
        `Fresh ${name}${farmer ? ` grown by ${farmer}` : ""}${location ? ` in ${location}` : ""}. Harvested fresh and delivered straight from the farm.`;

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
            <ProductClick image={image} name={name} description={description} price={price ?? "N/A"} />
        </div>
    );
}