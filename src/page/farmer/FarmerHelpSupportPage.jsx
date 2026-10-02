import React, { useState } from 'react';
import ApiService from '@/api/ApiService.js';

const api = new ApiService();

function FarmerHelpSupportPage() {
    // Form Inputs
    const [msgSubject, setMsgSubject] = useState("");
    const [msgBody, setMsgBody] = useState("");

    // Status States
    const [isSending, setIsSending] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // Message Submit Handler (POST /api/support/messages)
    const handleSendMessage = async (e) => {
        e.preventDefault();
        setSuccessMessage("");
        setErrorMessage("");

        if (!msgSubject.trim() || !msgBody.trim()) {
            setErrorMessage("Please fill in both subject and message details.");
            return;
        }

        if (msgSubject.length > 100) {
            setErrorMessage("Subject must be at most 100 characters.");
            return;
        }

        if (msgBody.length > 1000) {
            setErrorMessage("Message must be at most 1000 characters.");
            return;
        }

        setIsSending(true);

        const payload = {
            subject: msgSubject.trim(),
            message: msgBody.trim()
        };

        try {
            await api.request('POST', '/support/messages', payload);
            setSuccessMessage("Your message has been sent to our support team!");
            setMsgSubject("");
            setMsgBody("");
        } catch (error) {
            console.error("Support message error:", error);
            const serverMsg = error.response?.data?.error || error.response?.data?.message || "Failed to send message to backend support.";
            setErrorMessage(serverMsg);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="w-full h-full font-sans max-w-5xl mx-auto">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Help & Support</h1>
                <p className="text-sm text-gray-500 mt-1">Call our direct hotlines or send a message directly to our support desk.</p>
            </div>

            {/* Status Notifications */}
            {successMessage && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-semibold">
                    {successMessage}
                </div>
            )}
            {errorMessage && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-semibold">
                    {errorMessage}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

                {/* Left Side: Contact Numbers Only */}
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4">
                    <h3 className="text-base font-bold text-gray-700 mb-2 pb-2 border-b border-gray-100">
                        Direct Contact Numbers
                    </h3>

                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Farmer Support Helpline</p>
                        <p className="text-lg font-bold text-green-700 mt-1">+94 71 234 5678</p>
                        <p className="text-xs text-gray-500 mt-1">Available: Monday - Saturday (8:00 AM - 6:00 PM)</p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Field Officer Hotline</p>
                        <p className="text-lg font-bold text-gray-800 mt-1">+94 77 987 6543</p>
                        <p className="text-xs text-gray-500 mt-1">For immediate crop issue inquiries & urgent field advice</p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Head Office Emergency Desk</p>
                        <p className="text-lg font-bold text-gray-800 mt-1">+94 11 234 5670</p>
                        <p className="text-xs text-gray-500 mt-1">General platform administration & order disputes</p>
                    </div>
                </div>

                {/* Right Side: Send Message Form */}
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-base font-bold text-gray-700 mb-1">Send us a Message</h3>
                    <p className="text-xs text-gray-500 mb-5">Have a problem with your harvests, plots, or account? Write to us below.</p>

                    <form onSubmit={handleSendMessage} className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-700 mb-1.5 block">Subject / Topic</label>
                            <input
                                type="text"
                                required
                                maxLength={100}
                                value={msgSubject}
                                onChange={(e) => setMsgSubject(e.target.value)}
                                placeholder="e.g., Payment delay or Carrot plot stage issue"
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-green-600"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label className="text-xs font-bold text-gray-700 block">Message Details</label>
                                <span className="text-xs text-gray-400">{msgBody.length}/1000</span>
                            </div>
                            <textarea
                                required
                                rows="6"
                                maxLength={1000}
                                value={msgBody}
                                onChange={(e) => setMsgBody(e.target.value)}
                                placeholder="Explain your inquiry or issue clearly..."
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-green-600 resize-none"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={isSending}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer text-sm disabled:opacity-50"
                        >
                            {isSending ? "Sending Message..." : "Send Message"}
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
}

export default FarmerHelpSupportPage;