import React, { useState } from 'react';
import { farmerService } from '@/api/farmerService';

function FarmerHelpSupportPage() {
    const [msgSubject, setMsgSubject] = useState('');
    const [msgBody, setMsgBody] = useState('');
    const [sending, setSending] = useState(false);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        try {
            setSending(true);
            await farmerService.sendSupportMessage({ subject: msgSubject, body: msgBody });
            alert('Your message has been sent to our support team!');
            setMsgSubject('');
            setMsgBody('');
        } catch (error) {
            console.error('Support message error:', error);
            alert('Failed to send message.');
        } finally {
            setSending(false);
        }
    };

    const handleFAQClick = async (question) => {
        try {
            await farmerService.trackFaqClick({ question: question });
            alert('මෙම ප්‍රශ්නය ඔබ බැලූ බව Database හි සටහන් විය!');
        } catch (error) {
            console.error('FAQ track error:', error);
        }
    };

    return (
        <div className="w-full h-full font-sans max-w-5xl mx-auto p-4 sm:p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Help & Support</h1>

            <div className="grid lg:grid-cols-2 gap-8 items-start">
                <div className="flex flex-col gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-gray-700 mb-4">Frequently Asked Questions</h2>
                        <div className="space-y-3">
                            <div
                                onClick={() => handleFAQClick('How do I update my bank details?')}
                                className="p-3.5 bg-gray-50 rounded-xl cursor-pointer hover:bg-green-50 border border-gray-100 hover:border-green-200 transition-colors"
                            >
                                <p className="text-sm font-medium text-gray-700">How do I update my bank details?</p>
                            </div>
                            <div
                                onClick={() => handleFAQClick('What is the platform commission fee?')}
                                className="p-3.5 bg-gray-50 rounded-xl cursor-pointer hover:bg-green-50 border border-gray-100 hover:border-green-200 transition-colors"
                            >
                                <p className="text-sm font-medium text-gray-700">What is the platform commission fee?</p>
                            </div>
                            <div
                                onClick={() => handleFAQClick('How to handle a delayed customer order?')}
                                className="p-3.5 bg-gray-50 rounded-xl cursor-pointer hover:bg-green-50 border border-gray-100 hover:border-green-200 transition-colors"
                            >
                                <p className="text-sm font-medium text-gray-700">How to handle a delayed customer order?</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-700 mb-4">Send us a Message</h2>
                    <form onSubmit={handleSendMessage} className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-600 block mb-1 uppercase">Subject</label>
                            <input
                                type="text"
                                required
                                value={msgSubject}
                                onChange={(e) => setMsgSubject(e.target.value)}
                                placeholder="Issue or Inquiry subject"
                                className="w-full border border-green-700 rounded-xl px-4 py-2.5 bg-white text-gray-800 text-sm focus:outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/20 shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-600 block mb-1 uppercase">Message Details</label>
                            <textarea
                                required
                                rows="6"
                                value={msgBody}
                                onChange={(e) => setMsgBody(e.target.value)}
                                placeholder="Type your concern in detail..."
                                className="w-full border border-green-700 rounded-xl px-4 py-2.5 bg-white text-gray-800 text-sm focus:outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/20 resize-none shadow-sm"
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            disabled={sending}
                            className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3 rounded-xl transition-all shadow-md active:scale-95 text-sm disabled:opacity-50"
                        >
                            {sending ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default FarmerHelpSupportPage;