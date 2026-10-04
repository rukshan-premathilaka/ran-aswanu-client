import { useNavigate } from "react-router-dom";

// Popup for the "Become a farmer" button on the home page (see utils/useBecomeFarmer.js).
function BecomeFarmerDialog({ status, message, onClose }) {
    const navigate = useNavigate();
    if (status === "idle") return null;

    const working = status === "working";
    const success = status === "success";

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/50"
            onClick={() => !working && !success && onClose()}
        >
            <div
                role="dialog"
                aria-label="Become a farmer"
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center"
            >
                {status === "login" && (
                    <>
                        <p className="text-base font-semibold text-gray-900 mb-6">
                            Please login first. If you haven't an account, create an account.
                        </p>
                        <div className="flex gap-3">
                            <button type="button" onClick={() => navigate("/register")} className="flex-1 rounded-xl border-2 border-green-600 text-green-700 hover:bg-green-50 font-semibold py-2.5 text-sm">
                                Create an Account
                            </button>
                            <button type="button" onClick={() => navigate("/login")} className="flex-1 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 text-sm">
                                Login
                            </button>
                        </div>
                    </>
                )}

                {working && <p role="status" className="text-sm font-medium text-gray-700">Switching your account to a farmer account...</p>}

                {success && (
                    <p role="status" className="text-sm font-semibold text-green-700">
                        You are now a farmer! Taking you to your farmer dashboard...
                    </p>
                )}

                {status === "error" && (
                    <>
                        <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3 mb-4">{message}</p>
                        <button type="button" onClick={onClose} className="rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2.5 text-sm">
                            Close
                        </button>
                    </>
                )}

                {status === "login" && (
                    <button type="button" onClick={onClose} className="mt-4 text-xs text-gray-400 hover:text-gray-600">Close</button>
                )}
            </div>
        </div>
    );
}

export default BecomeFarmerDialog;
