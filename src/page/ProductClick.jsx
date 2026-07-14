import { useState } from "react";
import CustomButton from "/src/component/CustomButton.jsx";
import Navbar from "@/component/Navbar.jsx";
import ImageSlider from "@/component/ImageSlider.jsx";
import StarRating from "@/component/StarRating.jsx";
import SellerInfo from "@/component/SellerInfo.jsx";
import ReviewsList from "@/component/ReviewsList.jsx";
import RelatedProducts from "@/component/RelatedProducts.jsx";

function ProductClick({ image, name, description, price }) {
    // dummy state until backend is connected
    const [product] = useState({
        images: [
            image || "https://placehold.co/400x400",
            "https://placehold.co/400x400/orange/white",
            "https://placehold.co/400x400/green/white",
        ],
        rating: 4.3,
        reviewCount: 128,
        seller: {
            name: "Green Valley Farms",
            image: "https://placehold.co/100x100",
            location: "Negombo, Western Province",
        },
        reviews: [
            {
                id: 1,
                userName: "Sahan P.",
                userImage: "https://placehold.co/50x50",
                rating: 5,
                comment: "Fresh and sweet, delivered on time!",
            },
            {
                id: 2,
                userName: "Amaya K.",
                userImage: "https://placehold.co/50x50",
                rating: 4,
                comment: "Good quality but slightly overripe.",
            },
        ],
        relatedProducts: [
            { id: 1, name: "Mango", price: 220, image: "https://placehold.co/200x200" },
            { id: 2, name: "Banana", price: 90, image: "https://placehold.co/200x200" },
            { id: 3, name: "Pineapple", price: 180, image: "https://placehold.co/200x200" },
            { id: 4, name: "Guava", price: 130, image: "https://placehold.co/200x200" },
        ],
    });

    return (
        <div className="w-full min-h-screen bg-white">
            <Navbar />

            {/* main product section */}
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 px-6 py-10">
                {/* left - image slider */}
                <div className="w-full md:w-1/2">
                    <ImageSlider images={product.images} />
                </div>

                {/* right - product details */}
                <div className="w-full md:w-1/2 flex flex-col gap-4">
                    <h1 className="text-3xl font-bold text-gray-800">{name}</h1>

                    <StarRating rating={product.rating} reviewCount={product.reviewCount} />

                    <p className="text-2xl font-bold text-green-600">LKR {price}.00</p>

                    <p className="text-gray-600 leading-relaxed">{description}</p>

                    <SellerInfo seller={product.seller} />

                    <div className="flex gap-4 mt-2">
                        <CustomButton type="button" text="Buy Now" size="sm" className="bg-blue-500 flex-1" />
                        <CustomButton type="button" text="Add to Cart" size="sm" className="bg-blue-500 flex-1" />
                    </div>
                </div>
            </div>

            {/* reviews */}
            <div className="max-w-6xl mx-auto px-6 py-10 border-t border-gray-100">
                <ReviewsList reviews={product.reviews} />
            </div>

            {/* related products */}
            <div className="max-w-6xl mx-auto px-6 py-10 border-t border-gray-100">
                <RelatedProducts products={product.relatedProducts} />
            </div>
        </div>
    );
}

export default ProductClick;