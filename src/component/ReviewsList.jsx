import { Star } from "lucide-react";

function ReviewsList({ reviews }) {
    return (
        <div className="w-full flex flex-col gap-4">
            <h2 className="text-xl font-bold text-gray-800">Customer Reviews</h2>

            {reviews.length === 0 && (
                <p className="text-gray-500 text-sm">No reviews yet.</p>
            )}

            {reviews.map((review) => (
                <div
                    key={review.id}
                    className="border border-gray-100 rounded-xl p-4 flex flex-col gap-2"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <img
                                src={review.userImage}
                                alt={review.userName}
                                className="w-8 h-8 rounded-full object-cover"
                            />
                            <span className="font-medium text-gray-800 text-sm">
                {review.userName}
              </span>
                        </div>
                        <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    size={14}
                                    className={
                                        star <= review.rating
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "fill-gray-200 text-gray-200"
                                    }
                                />
                            ))}
                        </div>
                    </div>
                    <p className="text-sm text-gray-600">{review.comment}</p>
                </div>
            ))}
        </div>
    );
}

export default ReviewsList;