import React, { useState } from 'react';

// Pass the selected date to the main page using onDateSelect
function Calendar({ onDateSelect }) {

    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    const [selectedDate, setSelectedDate] = useState(new Date().getDate());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const monthList = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Go to next month
    const clickNext = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    // Go to previous month
    const clickPrev = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    // Get total days and the first day of the month
    let daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    let firstDay = new Date(currentYear, currentMonth, 1).getDay();

    let calendarBoxes = [];

    // Create empty boxes for days before the 1st of the month
    for (let i = 0; i < firstDay; i++) {
        calendarBoxes.push(<div key={"empty" + i} className="w-10 h-10 md:w-12 md:h-12"></div>);
    }

    // Create boxes for actual dates
    for (let d = 1; d <= daysInMonth; d++) {

        // Check if this box is the selected date
        let isSelected = false;
        if (d === selectedDate && currentMonth === selectedMonth && currentYear === selectedYear) {
            isSelected = true;
        }

        // Check if this box is today's date
        let todayDate = new Date();
        let isToday = false;
        if (d === todayDate.getDate() && currentMonth === todayDate.getMonth() && currentYear === todayDate.getFullYear()) {
            isToday = true;
        }

        // Base styles for the day box
        let boxStyle = "w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full text-sm cursor-pointer transition-all duration-200 ";

        if (isSelected === true) {
            boxStyle += "bg-green-600 text-white font-bold shadow-md";
        } else if (isToday === true) {
            boxStyle += "bg-[#D2E9C4] text-gray-900 border border-green-400 font-bold";
        } else {
            boxStyle += "text-gray-700 hover:bg-gray-100 hover:text-gray-900";
        }

        calendarBoxes.push(
            <div
                key={d}
                className={boxStyle}
                onClick={() => {
                    setSelectedDate(d);
                    setSelectedMonth(currentMonth);
                    setSelectedYear(currentYear);

                    // Send the clicked date to CalendarPage
                    if (onDateSelect) {
                        onDateSelect(new Date(currentYear, currentMonth, d));
                    }
                }}
            >
                {d}
            </div>
        );
    }

    return (
        <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
                <button onClick={clickPrev} className="bg-gray-50 text-gray-600 p-2 rounded-xl hover:bg-gray-100 font-semibold cursor-pointer transition-colors">
                    Prev
                </button>
                <h2 className="text-lg md:text-xl font-bold text-gray-800">
                    {monthList[currentMonth]} {currentYear}
                </h2>
                <button onClick={clickNext} className="bg-gray-50 text-gray-600 p-2 rounded-xl hover:bg-gray-100 font-semibold cursor-pointer transition-colors">
                    Next
                </button>
            </div>

            <div className="grid grid-cols-7 mb-4 text-center text-gray-400 font-semibold text-xs md:text-sm">
                <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
            </div>

            <div className="grid grid-cols-7 gap-1 md:gap-2 place-items-center">
                {calendarBoxes}
            </div>
        </div>
    );
}

export default Calendar;