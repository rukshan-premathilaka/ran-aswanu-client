import React, { useState } from 'react';
import { PhoneCall, Mail, MessageSquare, Send, ChevronRight } from 'lucide-react';

function FarmerHelpSupportPage() {
    const [msgSubject, setMsgSubject] = useState("");
    const [msgBody, setMsgBody] = useState("");

    const handleSendMessage = (e) => {
        e.preventDefault();
        console.log("Sending Message:", { subject: msgSubject, body: msgBody });
        alert("Your message has been sent to our support team. We will contact you soon!");
        setMsgSubject("");
        setMsgBody("");
    };

    return (
        <div className="w-full h-full font-sans max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Help & Support</h1>
                <p className="text-gray-500 mt-2">Need assistance? Contact our support team or check the FAQ below.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                {/* Left Side: Contact Methods & FAQ */}
                <div className="flex flex-col gap-6">
                    {/* Contact Cards */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-700 mb-4">Direct Contact</h3>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-green-300 transition-colors cursor-pointer">
                                <div className="p-3 bg-green-100 text-green-600 rounded-lg"><PhoneCall className="w-6 h-6" /></div>
                                <div><p className="text-sm font-bold text-gray-800">Call Us</p><p className="text-xs text-gray-500 mt-0.5">+94 71 234 5678 (9 AM - 5 PM)</p></div>
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-300 transition-colors cursor-pointer">
                                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><Mail className="w-6 h-6" /></div>
                                <div><p className="text-sm font-bold text-gray-800">Email Support</p><p className="text-xs text-gray-500 mt-0.5">support@ranaswanna.com</p></div>
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-green-400 transition-colors cursor-pointer">
                                <div className="p-3 bg-[#D2E9C4] text-green-800 rounded-lg"><MessageSquare className="w-6 h-6" /></div>
                                <div><p className="text-sm font-bold text-gray-800">WhatsApp Chat</p><p className="text-xs text-gray-500 mt-0.5">Instant messaging support</p></div>
                            </div>
                        </div>
                    </div>

                    {/* Simple FAQ Section */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-700 mb-4">Frequently Asked Questions</h3>
                        <div className="space-y-3">
                            <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between cursor-pointer hover:bg-gray-100">
                                <p className="text-sm font-medium text-gray-700">How do I update my bank details?</p><ChevronRight className="w-4 h-4 text-gray-400" />
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between cursor-pointer hover:bg-gray-100">
                                <p className="text-sm font-medium text-gray-700">What is the platform commission fee?</p><ChevronRight className="w-4 h-4 text-gray-400" />
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between cursor-pointer hover:bg-gray-100">
                                <p className="text-sm font-medium text-gray-700">How to handle a delayed customer order?</p><ChevronRight className="w-4 h-4 text-gray-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Message Box Form */}
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-700 mb-2">Send us a Message</h3>
                    <p className="text-sm text-gray-500 mb-6">If you have any issues with your account or marketplace listings, drop us a message directly.</p>

                    <form onSubmit={handleSendMessage} className="space-y-5">
                        <div>
                            <label className="text-sm font-bold text-gray-700 mb-1.5 block">Subject / Topic</label>
                            <input type="text" required value={msgSubject} onChange={(e) => setMsgSubject(e.target.value)} placeholder="e.g., Payment issue for Order #002" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#8dc63f] bg-gray-50" />
                        </div>

                        <div>
                            <label className="text-sm font-bold text-gray-700 mb-1.5 block">Message Details</label>
                            <textarea required rows="6" value={msgBody} onChange={(e) => setMsgBody(e.target.value)} placeholder="Explain your problem clearly here..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#8dc63f] bg-gray-50 resize-none"></textarea>
                        </div>

                        <div className="pt-2">
                            <button type="submit" className="w-full bg-[#8dc63f] hover:bg-green-600 text-white font-bold py-3 rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2">
                                <Send className="w-4 h-4" /> Send Message
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
}

export default FarmerHelpSupportPage;