import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function ImageSlider({ images }) {
    const [activeIndex, setActiveIndex] = useState(0);

    const goPrev = () =>
        setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

    const goNext = () =>
        setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

    return (
        <div className="w-full flex flex-col gap-4">
            {/* main image */}
            <div className="relative w-full aspect-square bg-gray-50 rounded-2xl overflow-hidden">
                <img
                    src={images[activeIndex]}
                    alt={`Product image ${activeIndex + 1}`}
                    className="w-full h-full object-contain"
                />

                <button
                    onClick={goPrev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition"
                >
                    <ChevronLeft size={20} />
                </button>
                <button
                    onClick={goNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition"
                >
                    <ChevronRight size={20} />
                </button>
            </div>

            {/* thumbnails */}
            <div className="flex gap-3 justify-center">
                {images.map((img, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                            activeIndex === index
                                ? "border-green-500"
                                : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                    >
                        <img
                            src={img}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}

export default ImageSlider;