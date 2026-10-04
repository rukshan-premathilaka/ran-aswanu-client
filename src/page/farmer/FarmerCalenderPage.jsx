import React, { useState, useEffect } from 'react';
import SimpleCalendar from '@/component/Calendar.jsx';
import ApiService from '@/api/ApiService.js';

const api = new ApiService();

function FarmerCalenderPage() {
    // Current selected date state
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentNote, setCurrentNote] = useState("");

    // Status and Loading states
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // Helper: Turn JavaScript Date into "YYYY-MM-DD"
    const formatDateKey = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const dateKey = formatDateKey(selectedDate);

    // 1. Database එකෙන් තෝරාගත් දිනයට අදාළ Note එක Load කරගැනීම (GET /api/farmer/calendar/{date})
    const loadNoteForDate = async (dateStr) => {
        setIsLoading(true);
        setErrorMessage("");
        setSuccessMessage("");

        try {
            const data = await api.request('GET', `/farmer/calendar/${dateStr}`);
            if (data && data.note !== undefined) {
                setCurrentNote(data.note || "");
            } else {
                setCurrentNote("");
            }
        } catch (error) {
            console.error("Failed to load note from Database:", error);
            setCurrentNote("");
            const serverMsg = error.response?.data?.error || "Could not connect to Database calendar.";
            setErrorMessage(serverMsg);
        } finally {
            setIsLoading(false);
        }
    };

    // දිනය වෙනස් වන සෑම විටම Database එකෙන් අදාළ Note එක Load කිරීම
    useEffect(() => {
        loadNoteForDate(dateKey);
    }, [dateKey]);

    // Calendar එකෙන් අලුත් දිනයක් Click කළ විට
    const handleDateSelect = (newDate) => {
        setSelectedDate(newDate);
        setSuccessMessage("");
        setErrorMessage("");
    };

    // 2. Note එක Database එකේ Save කිරීම (PUT /api/farmer/calendar/{date})
    const handleSaveNote = async () => {
        setSuccessMessage("");
        setErrorMessage("");

        if (currentNote.length > 500) {
            setErrorMessage("Note must be at most 500 characters.");
            return;
        }

        setIsSaving(true);

        const payload = {
            note: currentNote.trim()
        };

        try {
            await api.request('PUT', `/farmer/calendar/${dateKey}`, payload);
            setSuccessMessage("Calendar note successfully saved to Database!");
            await loadNoteForDate(dateKey);
        } catch (error) {
            console.error("Save calendar note error:", error);
            const serverMsg = error.response?.data?.error || error.response?.data?.message || "Failed to save note to Database.";
            setErrorMessage(serverMsg);
        } finally {
            setIsSaving(false);
        }
    };

    // 3. Note එක Database එකෙන් Delete / Clear කිරීම (DELETE /api/farmer/calendar/{date})
    const handleDeleteNote = async () => {
        if (!currentNote.trim()) {
            return;
        }

        if (!window.confirm("Are you sure you want to delete the note for this date?")) {
            return;
        }

        setSuccessMessage("");
        setErrorMessage("");
        setIsDeleting(true);

        try {
            await api.request('DELETE', `/farmer/calendar/${dateKey}`);
            setCurrentNote("");
            setSuccessMessage("Note deleted from Database successfully!");
        } catch (error) {
            console.error("Delete calendar note error:", error);
            const serverMsg = error.response?.data?.error || "Failed to delete note from Database.";
            setErrorMessage(serverMsg);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="w-full h-full font-sans max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">My Calendar</h1>
                <p className="text-sm text-gray-500 mt-1">Organize your farm tasks and never miss an important date.</p>
            </div>

            {/* Success and Error Alerts */}
            {successMessage && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-semibold">
                    {successMessage}
                </div>
            )}
            {errorMessage && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-semibold">
                    {errorMessage}
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Left Side: Calendar Component */}
                <div className="w-full lg:w-auto flex justify-center lg:justify-start">
                    <SimpleCalendar onDateSelect={handleDateSelect} />
                </div>

                {/* Right Side: Daily Details Input Box */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 w-full lg:flex-1 flex flex-col h-[420px]">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-base font-bold text-gray-700">Daily Details</h3>
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-lg text-xs font-bold">
                            {selectedDate.toDateString()}
                        </span>
                    </div>

                    <p className="text-gray-500 text-xs mb-3">
                        Enter crop management tasks or important information for this date. (Max 500 characters)
                    </p>

                    {isLoading ? (
                        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm font-semibold">
                            Loading notes from Database...
                        </div>
                    ) : (
                        <textarea
                            className="w-full flex-1 p-4 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 text-sm focus:outline-none focus:border-green-600 focus:bg-white resize-none transition-all"
                            placeholder="e.g., Need to apply fertilizer today, harvest inspection scheduled..."
                            maxLength={500}
                            value={currentNote}
                            onChange={(e) => setCurrentNote(e.target.value)}
                        ></textarea>
                    )}

                    {/* Character Counter & Action Buttons */}
                    <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-3">
                        <span className="text-xs text-gray-400">
                            {currentNote.length}/500 characters
                        </span>

                        <div className="flex items-center gap-2">
                            {/* Delete / Clear Button */}
                            {currentNote && (
                                <button
                                    type="button"
                                    onClick={handleDeleteNote}
                                    disabled={isDeleting || isSaving || isLoading}
                                    className="px-4 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl border border-red-200 cursor-pointer transition-colors disabled:opacity-50"
                                >
                                    {isDeleting ? "Deleting..." : "Clear Note"}
                                </button>
                            )}

                            {/* Save Button */}
                            <button
                                type="button"
                                onClick={handleSaveNote}
                                disabled={isSaving || isDeleting || isLoading}
                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-xl shadow-sm text-xs cursor-pointer transition-all active:scale-95 disabled:opacity-50"
                            >
                                {isSaving ? "Saving..." : "Save Details"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FarmerCalenderPage;