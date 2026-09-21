import React, { useState, useEffect } from 'react';
import SimpleCalendar from '@/component/Calendar.jsx';
import { farmerService } from '@/api/farmerService';

function CalendarPage() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentNote, setCurrentNote] = useState('');
    const [saving, setSaving] = useState(false);

    const dateKey = selectedDate.toISOString().split('T')[0];

    useEffect(() => {
        loadNoteForDate(dateKey);
    }, [dateKey]);

    const loadNoteForDate = async (formattedDate) => {
        try {
            const data = await farmerService.getCalendarDate(formattedDate);
            setCurrentNote(data?.note || '');
        } catch (error) {
            setCurrentNote('');
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await farmerService.saveCalendarDate(dateKey, { note: currentNote, date: dateKey });
            alert('කැලැන්ඩර් විස්තර සාර්ථකව සුරකින ලදී!');
        } catch (error) {
            console.error('Calendar save error:', error);
            alert('දත්ත සුරැකීම අසාර්ථක විය.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        const confirmed = window.confirm('Are you sure you want to clear notes for this day?');
        if (!confirmed) return;

        try {
            await farmerService.deleteCalendarDate(dateKey);
            setCurrentNote('');
            alert('දත්ත ඉවත් කරන ලදී.');
        } catch (error) {
            console.error('Calendar delete error:', error);
            alert('ඉවත් කිරීම අසාර්ථකයි.');
        }
    };

    return (
        <div className="w-full h-full font-sans max-w-6xl mx-auto p-4 sm:p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">My Farm Calendar</h1>
            <div className="flex flex-col lg:flex-row gap-8 items-start">
                <SimpleCalendar onDateSelect={setSelectedDate} />
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex-1 flex flex-col h-[400px] w-full">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-gray-700">Daily Details</h2>
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-lg text-sm font-semibold border border-green-200">
                            {selectedDate.toDateString()}
                        </span>
                    </div>
                    <textarea
                        className="w-full flex-1 p-4 border border-green-700 rounded-xl bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/20 resize-none text-sm transition-all"
                        placeholder="Enter daily crop activities, irrigation logs, fertilizer usage..."
                        value={currentNote}
                        onChange={(e) => setCurrentNote(e.target.value)}
                    ></textarea>
                    <div className="mt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2.5 px-6 rounded-xl border border-red-200 text-sm transition-colors"
                        >
                            Delete
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-green-700 hover:bg-green-800 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-all shadow-sm active:scale-95 disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save Note'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CalendarPage;