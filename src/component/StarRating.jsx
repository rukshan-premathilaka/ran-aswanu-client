import { Star } from "lucide-react";

function StarRating({ rating, reviewCount }) {
    return (
        <div className="flex items-center gap-2">
            <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={18}
                        className={
                            star <= Math.round(rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-gray-200 text-gray-200"
                        }
                    />
                ))}
            </div>
            <span className="text-sm text-gray-500">
        {rating.toFixed(1)} ({reviewCount} reviews)
      </span>
        </div>
    );
}

export default StarRating;