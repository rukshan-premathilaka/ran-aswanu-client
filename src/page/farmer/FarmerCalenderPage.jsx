import React, { useState, useEffect } from 'react';
import SimpleCalendar from '@/component/Calendar.jsx';
import ApiService from '@/api/ApiService.js';

const api = new ApiService();

function CalendarPage() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [notes, setNotes] = useState({});
    const [currentNote, setCurrentNote] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const formatDateKey = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const dateKey = formatDateKey(selectedDate);

    // load calendar note for selected date
    const fetchNoteForDate = async (key) => {
        try {
            const data = await api.request('GET', `/farmer/calendar/${key}`);
            if (data && data.note !== undefined) {
                setCurrentNote(data.note);
                setNotes(prev => ({ ...prev, [key]: data.note }));
            } else if (notes[key]) {
                setCurrentNote(notes[key]);
            } else {
                setCurrentNote("");
            }
        } catch (err) {
            console.warn("Calendar note fetch failed, using local fallback:", err);
            setCurrentNote(notes[key] || "");
        }
    };

    useEffect(() => {
        fetchNoteForDate(dateKey);
    }, [dateKey]);

    const handleDateChange = (newDate) => {
        setSelectedDate(newDate);
        const newKey = formatDateKey(newDate);
        fetchNoteForDate(newKey);
    };

    // save calendar note to backend
    const handleSave = async () => {
        setIsSaving(true);
        try {
            await api.request('PUT', `/farmer/calendar/${dateKey}`, { note: currentNote });
            setNotes(prev => ({ ...prev, [dateKey]: currentNote }));
            alert("Details saved to Database!");
        } catch (error) {
            console.error("Failed to save calendar note:", error);
            setNotes(prev => ({ ...prev, [dateKey]: currentNote }));
            alert("Saved locally!");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="w-full h-full font-sans max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">My Calendar</h1>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                <div className="w-full lg:w-auto flex justify-center lg:justify-start">
                    <SimpleCalendar onDateSelect={handleDateChange} />
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 w-full lg:flex-1 flex flex-col h-[400px]">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-700">Daily Details</h3>
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-lg text-sm font-semibold">
                            {selectedDate.toDateString()}
                        </span>
                    </div>

                    <p className="text-gray-500 text-sm mb-4">
                        Enter crop management tasks or important information for this date.
                    </p>

                    <textarea
                        className="w-full flex-1 p-4 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent resize-none transition-all"
                        placeholder="e.g., Need to apply fertilizer today..."
                        value={currentNote}
                        onChange={(e) => setCurrentNote(e.target.value)}
                    ></textarea>

                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-6 rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                        >
                            {isSaving ? "Saving..." : "Save Details"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CalendarPage;