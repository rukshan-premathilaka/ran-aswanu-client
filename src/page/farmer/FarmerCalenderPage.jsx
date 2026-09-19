import React, { useState, useEffect } from 'react';
import SimpleCalendar from '@/component/Calendar.jsx';
import { farmerService } from '@/api/farmerService';

function CalendarPage() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentNote, setCurrentNote] = useState("");

    const dateKey = selectedDate.toISOString().split('T')[0];

    useEffect(() => {
        loadNoteForDate(dateKey);
    }, [dateKey]);

    const loadNoteForDate = async (formattedDate) => {
        try {
            const data = await farmerService.getCalendarDate(formattedDate);
            setCurrentNote(data?.note || "");
        } catch (error) {
            setCurrentNote("");
        }
    };

    const handleSave = async () => {
        try {
            await farmerService.saveCalendarDate(dateKey, { note: currentNote, date: dateKey });
            alert("කැලැන්ඩර් විස්තර සාර්ථකව සුරකින ලදී!");
        } catch (error) {
            alert("දත්ත සුරැකීම අසාර්ථක විය.");
        }
    };

    const handleDelete = async () => {
        try {
            await farmerService.deleteCalendarDate(dateKey);
            setCurrentNote("");
            alert("දත්ත ඉවත් කරන ලදී.");
        } catch(e) {
            alert("ඉවත් කිරීම අසාර්ථකයි.");
        }
    }

    return (
        <div className="w-full h-full font-sans max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">My Calendar</h1>
            <div className="flex flex-col lg:flex-row gap-8 items-start">
                <SimpleCalendar onDateSelect={setSelectedDate} />
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex-1 flex flex-col h-[400px]">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-700">Daily Details</h3>
                        <span className="bg-[#D2E9C4] text-green-800 px-3 py-1 rounded-lg text-sm font-semibold">{selectedDate.toDateString()}</span>
                    </div>
                    <textarea className="w-full flex-1 p-4 border rounded-xl bg-gray-50 focus:outline-none" value={currentNote} onChange={(e) => setCurrentNote(e.target.value)}></textarea>
                    <div className="mt-4 flex justify-end gap-3">
                        <button onClick={handleDelete} className="bg-red-500 text-white font-bold py-2.5 px-6 rounded-xl">Delete</button>
                        <button onClick={handleSave} className="bg-[#8dc63f] text-white font-bold py-2.5 px-6 rounded-xl">Save</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CalendarPage;