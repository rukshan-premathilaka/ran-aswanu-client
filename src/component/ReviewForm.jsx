import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import MessageBox from "@/component/MessageBox.jsx";
import { api } from "@/api/ApiService.js";
import ENDPOINTS from "@/api/endpoints.js";
import { getApiError } from "@/api/Apierror.js";

const MAX_COMMENT = 500;

// "Write a review" box: 5 stars (lime when selected, like the Play Store) + a comment.
// The backend rates an ORDER: POST /api/orders/{orderId}/rating (COMPLETED orders only, one rating per order).
// So the review is sent to the buyer's latest completed order from this seller that is not rated yet.
function ReviewForm({ farmerId, onSubmitted }) {
    const navigate = useNavigate();
    const [score, setScore] = useState(0);
    const [comment, setComment] = useState("");
    const [message, setMessage] = useState({ type: "error", text: "" });
    const [needLogin, setNeedLogin] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: "error", text: "" });

        // Not logged in: ask the user to log in or create an account
        if (!localStorage.getItem("my_app_token")) {
            setNeedLogin(true);
            return;
        }
        setNeedLogin(false);

        if (score < 1) {
            setMessage({ type: "error", text: "Please select a star rating (1 to 5)." });
            return;
        }

        setIsSubmitting(true);
        try {
            // completed orders of this buyer from this seller, newest first
            const orders = await api.call(ENDPOINTS.BUYER_ORDERS.LIST_MINE);
            const candidates = orders
                .filter((o) => o.orderStatus === "COMPLETED" && Number(o.farmerId) === Number(farmerId))
                .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

            if (candidates.length === 0) {
                setMessage({ type: "error", text: "You can review a seller after you receive a completed order from them." });
                return;
            }

            let saved = false;
            for (const order of candidates) {
                try {
                    await api.call(ENDPOINTS.RATINGS.SUBMIT(order.orderId), { score, comment: comment.trim() });
                    saved = true;
                    break;
                } catch (error) {
                    if (getApiError(error).status === 409) continue; // this order is already rated, try the next one
                    throw error;
                }
            }

            if (!saved) {
                setMessage({ type: "error", text: "You have already reviewed all your completed orders from this seller." });
                return;
            }

            setScore(0);
            setComment("");
            setMessage({ type: "success", text: "Thank you! Your review has been submitted." });
            onSubmitted?.();
        } catch (error) {
            const err = getApiError(error);
            if (err.status === 401) {
                localStorage.removeItem("my_app_token"); // token expired or invalid
                setNeedLogin(true);
                return;
            }
            setMessage({ type: "error", text: err.fieldErrors?.score || err.fieldErrors?.comment || err.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} noValidate className="border border-gray-100 rounded-xl p-4 flex flex-col gap-3">
            <h3 className="text-lg font-semibold text-gray-800">Write a review</h3>

            {/* 5 stars: click a star and every star up to it turns lime */}
            <div role="radiogroup" aria-label="Your rating" className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        role="radio"
                        aria-checked={score === star}
                        aria-label={`${star} star${star > 1 ? "s" : ""}`}
                        onClick={() => setScore(star)}
                        className="p-0.5 rounded transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-500"
                    >
                        <Star size={32} className={star <= score ? "fill-lime-500 text-lime-500" : "text-gray-300"} />
                    </button>
                ))}
            </div>

            <div>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    maxLength={MAX_COMMENT}
                    rows={4}
                    placeholder="Share your feedback about this seller..."
                    aria-label="Your feedback"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:ring-2 focus:ring-green-100 outline-none resize-none"
                />
                <p className="text-xs text-gray-400 text-right">{comment.length}/{MAX_COMMENT}</p>
            </div>

            {needLogin && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <p className="text-sm font-medium text-gray-800 mb-3">
                        Please login first. If you haven't an account, create an account.
                    </p>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => navigate("/register")}
                            className="flex-1 rounded-xl border-2 border-green-600 text-green-700 hover:bg-green-50 font-semibold py-2 text-sm"
                        >
                            Create an Account
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                            className="flex-1 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold py-2 text-sm"
                        >
                            Login
                        </button>
                    </div>
                </div>
            )}

            <MessageBox type={message.type} text={message.text} />

            <button
                type="submit"
                disabled={isSubmitting}
                className="self-start rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2.5 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {isSubmitting ? "Submitting..." : "Submit review"}
            </button>
        </form>
    );
}

export default ReviewForm;
