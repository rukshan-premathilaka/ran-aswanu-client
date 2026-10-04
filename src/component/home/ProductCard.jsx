import { Leaf, ArrowRight } from "lucide-react";
import { fileUrl } from "@/api/fileUrl.js";
import { formatLkr } from "./homeUtils.js";
import ImageWithFallback from "./ImageWithFallback.jsx";

// Fresh Picks card. Answers 4 questions at a glance: what is it, who sells it, how much, is it available.
// Uses the real keys from GET /products. A line is hidden if the backend did not send that value.
export default function ProductCard({ product, onClick }) {
    const name = product.productName ?? "Product";
    const category = product.category ?? "Fresh Produce";
    const unit = product.unitOfMeasurement ?? "";
    const price = formatLkr(product.pricePerUnit);
    const stockKnown = product.availableStock !== undefined && product.availableStock !== null && product.availableStock !== "";
    const stock = stockKnown ? Number(product.availableStock) : null;
    const outOfStock = stock !== null && !(stock > 0);
    const image = fileUrl(product.productImage);

    return (
        <article
            onClick={onClick}
            className="group lift h-full flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-xl hover:border-green-300 cursor-pointer"
        >
            <div className="relative aspect-[4/3] overflow-hidden bg-green-50">
                {image ? (
                    <ImageWithFallback src={image} alt={name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Leaf className="w-12 h-12 text-green-600" aria-hidden="true" />
                    </div>
                )}
                <span className="absolute top-3 left-3 rounded-full bg-white/95 px-3 py-1 text-sm font-semibold text-green-800 shadow-sm">
                    {category}
                </span>
                {outOfStock && (
                    <span className="absolute top-3 right-3 rounded-full bg-red-600 px-3 py-1 text-sm font-semibold text-white shadow-sm">
                        Out of stock
                    </span>
                )}
            </div>

            <div className="flex flex-1 flex-col p-5">
                <h3 className="text-xl font-bold text-slate-900 leading-snug">{name}</h3>
                {price && (
                    <p className="mt-2 text-lg font-bold text-green-700">
                        LKR {price}
                        {unit && <span className="text-base font-medium text-slate-500"> / {unit}</span>}
                    </p>
                )}
                {stock !== null && !outOfStock && (
                    <p className="mt-1 text-base text-slate-600">
                        Available: {stock.toLocaleString()} {unit}
                    </p>
                )}
                {product.farmerName && <p className="mt-1 text-base text-slate-600">By {product.farmerName}</p>}

                <button
                    type="button"
                    className="btn-lift mt-5 inline-flex items-center justify-center gap-2 rounded-full border-2 border-green-600 px-5 py-2.5 text-base font-semibold text-green-700 transition-colors group-hover:bg-green-600 group-hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-green-300"
                >
                    View Product <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
            </div>
        </article>
    );
}
