import React, { useState } from 'react';
import { farmerService } from '@/api/farmerService';

function FarmerHelpSupportPage() {
    const [msgSubject, setMsgSubject] = useState("");
    const [msgBody, setMsgBody] = useState("");

    const handleSendMessage = async (e) => {
        e.preventDefault();
        try {
            await farmerService.sendSupportMessage({ subject: msgSubject, body: msgBody });
            alert("Your message has been sent to our support team!");
            setMsgSubject(""); setMsgBody("");
        } catch(e) { alert("Failed to send message."); }
    };

    const handleFAQClick = async (question) => {
        try {
            // FAQ එකක් click කල විට Database එකට යවයි
            await farmerService.trackFaqClick({ question: question });
            alert("මෙම ප්‍රශ්නය ඔබ බැලූ බව Database හි සටහන් විය!");
        } catch(e) { console.error(e); }
    };

    return (
        <div className="w-full h-full font-sans max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Help & Support</h1>

            <div className="grid lg:grid-cols-2 gap-8">
                <div className="flex flex-col gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-700 mb-4">Frequently Asked Questions</h3>
                        <div className="space-y-3">
                            <div onClick={() => handleFAQClick("How do I update my bank details?")} className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                                <p className="text-sm font-medium text-gray-700">How do I update my bank details?</p>
                            </div>
                            <div onClick={() => handleFAQClick("What is the platform commission fee?")} className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                                <p className="text-sm font-medium text-gray-700">What is the platform commission fee?</p>
                            </div>
                            <div onClick={() => handleFAQClick("How to handle a delayed customer order?")} className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                                <p className="text-sm font-medium text-gray-700">How to handle a delayed customer order?</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-700 mb-4">Send us a Message</h3>
                    <form onSubmit={handleSendMessage} className="space-y-5">
                        <input type="text" required value={msgSubject} onChange={(e) => setMsgSubject(e.target.value)} placeholder="Subject" className="w-full border rounded-xl px-4 py-2.5 bg-gray-50" />
                        <textarea required rows="6" value={msgBody} onChange={(e) => setMsgBody(e.target.value)} placeholder="Message Details..." className="w-full border rounded-xl px-4 py-2.5 bg-gray-50 resize-none"></textarea>
                        <button type="submit" className="w-full bg-[#8dc63f] text-white font-bold py-3 rounded-xl">Send Message</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default FarmerHelpSupportPage;