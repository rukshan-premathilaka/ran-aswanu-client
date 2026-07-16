import React, { useState } from 'react';
import SimpleCalendar from '../component/Calendar';

function CalendarPage() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [notes, setNotes] = useState({});
    const [currentNote, setCurrentNote] = useState("");

    const dateKey = `${selectedDate.getFullYear()}-${selectedDate.getMonth()}-${selectedDate.getDate()}`;

    const handleDateChange = (newDate) => {
        setSelectedDate(newDate);
        const newKey = `${newDate.getFullYear()}-${newDate.getMonth()}-${newDate.getDate()}`;

        if (notes[newKey]) {
            setCurrentNote(notes[newKey]);
        } else {
            setCurrentNote("");
        }
    };

    const handleSave = () => {
        setNotes({
            ...notes,
            [dateKey]: currentNote
        });
        alert("Details saved successfully!");
    };

    return (
        <div className="w-full h-full font-sans max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">My Calendar</h1>

            {/* Changed from md:flex-row to lg:flex-row for better tablet spacing */}
            <div className="flex flex-col lg:flex-row gap-8 items-start">

                <div className="w-full lg:w-auto flex justify-center lg:justify-start">
                    <SimpleCalendar onDateSelect={handleDateChange} />
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 w-full lg:flex-1 flex flex-col h-[400px]">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-700">
                            Daily Details
                        </h3>
                        <span className="bg-[#D2E9C4] text-green-800 px-3 py-1 rounded-lg text-sm font-semibold">
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
                            className="bg-[#8dc63f] hover:bg-green-600 text-white font-semibold py-2.5 px-6 rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer"
                        >
                            Save Details
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default CalendarPage;