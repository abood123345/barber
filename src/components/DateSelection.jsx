import { useState } from 'react';

const DateSelection = ({ onContinue, updateData, data }) => {
  const [currentMonth, setCurrentMonth] = useState(6); // June = 6
  const [currentYear, setCurrentYear] = useState(2025);
  const [selectedDate, setSelectedDate] = useState(data.selectedDate);
  const [selectedTime, setSelectedTime] = useState(data.selectedTime);

  const months = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  const weekDays = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  const getDaysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month - 1, 1).getDay();
  };

  const generateCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = selectedDate === day;
      const isToday = day === 24; // Highlighting 24th as shown in the image
      
      days.push(
        <button
          key={day}
          onClick={() => setSelectedDate(day)}
          className={`h-10 w-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
            isSelected
              ? 'bg-gray-800 text-white'
              : isToday
              ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
              : 'hover:bg-gray-100'
          }`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const timeSlots = ['7:00 م', '8:00 م'];

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      updateData({ selectedDate, selectedTime });
      onContinue();
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">التاريخ والوقت</h2>
        <button className="text-gray-500 hover:text-gray-700">
          ←
        </button>
      </div>

      {/* Month/Year selector */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentMonth(prev => prev === 1 ? 12 : prev - 1)}
          className="p-2 hover:bg-gray-100 rounded"
        >
          ←
        </button>
        <div className="text-center">
          <div className="font-medium">{months[currentMonth - 1]}</div>
          <div className="text-sm text-gray-600">{currentYear}</div>
        </div>
        <button
          onClick={() => setCurrentMonth(prev => prev === 12 ? 1 : prev + 1)}
          className="p-2 hover:bg-gray-100 rounded"
        >
          →
        </button>
      </div>

      {/* Week days header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-gray-600">
            {day.slice(0, 3)}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 mb-6">
        {generateCalendar()}
      </div>

      {/* Selected date display */}
      {selectedDate && (
        <div className="text-center mb-4 text-sm text-gray-600">
          يونيو {selectedDate}، {currentYear} - 7:00 م
        </div>
      )}

      {/* Time slots */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {timeSlots.map(time => (
          <button
            key={time}
            onClick={() => setSelectedTime(time)}
            className={`py-2 px-4 rounded-lg border font-medium transition-all ${
              selectedTime === time
                ? 'bg-gray-800 text-white border-gray-800'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            {time}
          </button>
        ))}
      </div>

      <button
        onClick={handleContinue}
        disabled={!selectedDate || !selectedTime}
        className={`w-full py-3 rounded-lg font-medium transition-all ${
          selectedDate && selectedTime
            ? 'bg-gray-800 text-white hover:bg-gray-700'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        استمر
      </button>
    </div>
  );
};

export default DateSelection;