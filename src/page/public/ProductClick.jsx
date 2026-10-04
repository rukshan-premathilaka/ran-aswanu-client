import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CustomButton from "/src/component/CustomButton.jsx";
import Navbar from "@/component/Navbar.jsx";
import ImageSlider from "@/component/ImageSlider.jsx";
import StarRating from "@/component/StarRating.jsx";
import SellerInfo from "@/component/SellerInfo.jsx";
import ReviewsList from "@/component/ReviewsList.jsx";
import RelatedProducts from "@/component/RelatedProducts.jsx";
import MessageBox from "@/component/MessageBox.jsx";
import CheckoutModal from "@/component/CheckoutModal.jsx";
import ReviewForm from "@/component/ReviewForm.jsx";
import { api } from "@/api/ApiService.js";
import ENDPOINTS from "@/api/endpoints.js";
import { getApiError } from "@/api/Apierror.js";
import { fileUrl } from "@/api/fileurl.js";
import { fetchProductById, fetchRelatedProducts } from "@/api/fetchProducts.js";
import { addToCart } from "@/utils/cart.js";

// Product detail. Route: /product/:listId  (or <ProductClick listId=... /> from ProductDetailView).
// Everything on this page comes from the backend; there is no sample data.
function ProductClick({ listId: listIdProp, initialProduct = null }) {
    const navigate = useNavigate();
    const params = useParams();
    const listId = listIdProp ?? params.listId;

    const [product, setProduct] = useState(initialProduct);
    const [isLoading, setIsLoading] = useState(true);
    const [errorText, setErrorText] = useState("");

    const [reviewData, setReviewData] = useState({ averageRating: 0, totalReviews: 0, reviews: [] });
    const [reviewsNote, setReviewsNote] = useState("");
    const [related, setRelated] = useState([]);

    const [quantity, setQuantity] = useState("");
    const [actionMessage, setActionMessage] = useState({ type: "error", text: "" });
    const [checkoutItems, setCheckoutItems] = useState(null);

    // 1. Load the product (loading / error / product)
    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            setIsLoading(true);
            setErrorText("");
            try {
                const data = await fetchProductById(listId);
                if (cancelled) return;
                setProduct(data);
                setQuantity(String(data.minimumOrderQuantity ?? 1));
            } catch (error) {
                if (cancelled) return;
                const err = getApiError(error);
                setProduct(null);
                setErrorText(err.status === 404 ? "Product not found." : err.message);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };
        load();
        window.scrollTo(0, 0);
        return () => {
            cancelled = true;
        };
    }, [listId]);

    // 2. Reviews of the seller and related products (after the product is known)
    useEffect(() => {
        if (!product?.farmerId) return;
        let cancelled = false;

        const loadReviews = async () => {
            setReviewsNote("");
            try {
                const data = await api.call(ENDPOINTS.RATINGS.LIST_FOR_USER(product.farmerId));
                if (!cancelled) setReviewData(data);
            } catch (error) {
                if (cancelled) return;
                const err = getApiError(error);
                // Visitors get 401 until the backend opens this call: show a hint, do not crash
                setReviewsNote(err.status === 401 ? "Log in to see reviews." : err.message);
            }
        };
        const loadRelated = async () => {
            try {
                const list = await fetchRelatedProducts(product);
                if (!cancelled) setRelated(list);
            } catch {
                if (!cancelled) setRelated([]);
            }
        };
        loadReviews();
        loadRelated();
        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product?.listId, product?.farmerId]);

    // Check quantity against the minimum order and the stock before add-to-cart / buy
    const validQuantity = () => {
        const qty = Number(quantity);
        if (!(qty > 0)) {
            setActionMessage({ type: "error", text: "Enter a quantity above 0." });
            return null;
        }
        if (product.minimumOrderQuantity && qty < Number(product.minimumOrderQuantity)) {
            setActionMessage({ type: "error", text: `The minimum order is ${product.minimumOrderQuantity} ${product.unitOfMeasurement}.` });
            return null;
        }
        if (qty > Number(product.availableStock)) {
            setActionMessage({ type: "error", text: `Only ${product.availableStock} ${product.unitOfMeasurement} in stock.` });
            return null;
        }
        return qty;
    };

    const handleAddToCart = () => {
        const qty = validQuantity();
        if (qty === null) return;
        addToCart(product, qty);
        setActionMessage({ type: "success", text: "Added to cart." });
    };

    const handleBuyNow = () => {
        const qty = validQuantity();
        if (qty === null) return;
        setActionMessage({ type: "error", text: "" });
        setCheckoutItems([{ ...product, quantity: qty }]);
    };

    const handleChatWithSeller = async () => {
        setActionMessage({ type: "error", text: "" });
        try {
            const chat = await api.call(ENDPOINTS.CHAT.START, { otherUserId: product.farmerId });
            navigate("/chat?chatId=" + chat.chatId);
        } catch (error) {
            const err = getApiError(error);
            if (err.status === 401) {
                localStorage.removeItem("my_app_token");
                navigate("/login");
                return;
            }
            setActionMessage({ type: "error", text: err.message }); // e.g. "You cannot chat with yourself"
        }
    };

    // After a new review is saved, load the seller's reviews again
    const refreshReviews = async () => {
        try {
            setReviewData(await api.call(ENDPOINTS.RATINGS.LIST_FOR_USER(product.farmerId)));
            setReviewsNote("");
        } catch {
            /* keep the list that is already on screen */
        }
    };

    if (isLoading && !product) {
        return (
            <div className="w-full min-h-screen bg-white">
                <Navbar />
                <p className="max-w-6xl mx-auto px-6 py-10 text-sm text-gray-500">Loading...</p>
            </div>
        );
    }

    if (errorText || !product) {
        return (
            <div className="w-full min-h-screen bg-white">
                <Navbar />
                <div className="max-w-6xl mx-auto px-6 py-10">
                    <MessageBox type="error" text={errorText || "Product not found."} />
                </div>
            </div>
        );
    }

    const images = [fileUrl(product.productImage)].filter(Boolean); // the backend stores ONE image per product
    const outOfStock = !(Number(product.availableStock) > 0);

    // Map the backend review keys to what the components read
    const reviews = (reviewData.reviews ?? []).map((r) => ({
        id: r.ratingId,
        userName: r.reviewerName,
        userImage: null, // not sent by the backend; ReviewsList shows the first letter of the name
        rating: r.score,
        comment: r.comment,
    }));
    const seller = {
        name: product.farmerName,
        image: fileUrl(product.farmerProfilePicture), // 🔧 backend to-do; letter avatar until it arrives
        location: product.location ?? "", // 🔧 backend to-do
    };
    const relatedCards = related.map((p) => ({
        id: p.listId,
        name: p.productName,
        price: p.pricePerUnit,
        image: fileUrl(p.productImage),
    }));

    return (
        <div className="w-full min-h-screen bg-white">
            <Navbar />

            {/* main product section */}
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 px-6 py-10">
                {/* left - image slider */}
                <div className="w-full md:w-1/2">
                    <ImageSlider images={images} />
                </div>

                {/* right - product details */}
                <div className="w-full md:w-1/2 flex flex-col gap-4">
                    <h1 className="text-3xl font-bold text-gray-800">{product.productName}</h1>

                    <StarRating rating={reviewData.averageRating} reviewCount={reviewData.totalReviews} />

                    <p className="text-2xl font-bold text-green-600">
                        LKR {product.pricePerUnit} / {product.unitOfMeasurement}
                    </p>

                    <p className="text-gray-600 leading-relaxed">{product.description}</p>

                    <p className="text-sm text-gray-500">
                        In stock: {product.availableStock} {product.unitOfMeasurement}
                        {product.minimumOrderQuantity ? ` · Minimum order: ${product.minimumOrderQuantity} ${product.unitOfMeasurement}` : ""}
                    </p>

                    <SellerInfo seller={seller} showStoreButton={false} />

                    <div className="flex items-center gap-3">
                        <label htmlFor="qty" className="text-sm font-medium text-gray-800">
                            Quantity ({product.unitOfMeasurement})
                        </label>
                        <input
                            id="qty"
                            type="number"
                            min={product.minimumOrderQuantity ?? 1}
                            max={product.availableStock}
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="w-28 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:ring-2 focus:ring-green-100 outline-none"
                        />
                    </div>

                    <MessageBox type={actionMessage.type} text={actionMessage.text} />

                    <div className="flex gap-4 mt-2">
                        <CustomButton type="button" text="Buy Now" size="sm" className="bg-blue-500 flex-1" onClick={handleBuyNow} disabled={outOfStock} />
                        <CustomButton type="button" text="Add to Cart" size="sm" className="bg-blue-500 flex-1" onClick={handleAddToCart} disabled={outOfStock} />
                    </div>
                    <div className="flex">
                        <CustomButton type="button" text="Chat with seller" size="sm" className="bg-green-600 text-white flex-1" onClick={handleChatWithSeller} />
                    </div>
                    {outOfStock && <p className="text-sm text-red-600">This product is out of stock.</p>}
                </div>
            </div>

            {/* reviews */}
            <div className="max-w-6xl mx-auto px-6 py-10 border-t border-gray-100">
                {reviewsNote ? (
                    <>
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Customer Reviews</h2>
                        <p className="text-sm text-gray-500">{reviewsNote}</p>
                    </>
                ) : (
                    <ReviewsList reviews={reviews} />
                )}

                {/* rate the seller: stars + comment (below the reviews) */}
                <div className="mt-8">
                    <ReviewForm farmerId={product.farmerId} onSubmitted={refreshReviews} />
                </div>
            </div>

            {/* related products */}
            <div className="max-w-6xl mx-auto px-6 py-10 border-t border-gray-100">
                <RelatedProducts products={relatedCards} onSelect={(id) => navigate(`/product/${id}`)} />
            </div>

            {checkoutItems && (
                <CheckoutModal
                    items={checkoutItems}
                    onClose={() => setCheckoutItems(null)}
                    onSuccess={() => setProduct((p) => ({ ...p, availableStock: Number(p.availableStock) - Number(checkoutItems[0].quantity) }))}
                />
            )}
        </div>
    );
}

export default ProductClick;