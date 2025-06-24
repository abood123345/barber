import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import {
  format,
  addDays,
  startOfWeek,
  isSameDay,
  isToday,
  isBefore,
} from "date-fns";
import { ar } from "date-fns/locale";

const DateTimeSelection = ({ data, updateData, onNext, onPrev }) => {
  const [selectedDate, setSelectedDate] = useState(data.date || new Date());
  const [selectedTime, setSelectedTime] = useState(data.time || null);

  // Generate next 14 days
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      dates.push(addDays(today, i));
    }
    return dates;
  };

  // Available time slots
  const timeSlots = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
  ];

  const dates = generateDates();

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    updateData({ date });
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    updateData({ time });
  };

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      onNext();
    }
  };

  const isTimeSlotAvailable = (time) => {
    // Mock availability check - in real app, check against existing appointments
    const now = new Date();
    const [hours, minutes] = time.split(":");
    const slotTime = new Date(selectedDate);
    slotTime.setHours(parseInt(hours), parseInt(minutes));

    return !isBefore(slotTime, now);
  };

  return (
    <div className="bg-dark-800/50 rounded-2xl p-8">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-white mb-4">
          اختر التاريخ والوقت
        </h3>
        <p className="text-gray-400">حدد الموعد المناسب لك</p>
      </div>

      {/* Selected Service & Barber Info */}
      <div className="bg-dark-700/50 rounded-lg p-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-white font-semibold mb-2">الخدمة:</h4>
            <p className="text-gray-300">{data.service?.nameAr}</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-2">الحلاق:</h4>
            <p className="text-gray-300">
              {data.barber?.firstName} {data.barber?.lastName}
            </p>
          </div>
        </div>
      </div>

      {/* Date Selection */}
      <div className="mb-8">
        <h4 className="text-white font-semibold mb-4 flex items-center">
          <Calendar className="w-5 h-5 ml-2" />
          اختر التاريخ
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
          {dates?.map((date, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => handleDateSelect(date)}
              className={`p-3 rounded-lg text-center transition-all ${
                isSameDay(selectedDate, date)
                  ? "bg-primary-500 text-white"
                  : "bg-dark-700 text-gray-300 hover:bg-dark-600"
              }`}
            >
              <div className="text-sm font-medium">
                {format(date, "EEE", { locale: ar })}
              </div>
              <div className="text-lg font-bold">{format(date, "d")}</div>
              <div className="text-xs">
                {format(date, "MMM", { locale: ar })}
              </div>
              {isToday(date) && (
                <div className="text-xs text-primary-300 mt-1">اليوم</div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Time Selection */}
      <div className="mb-8">
        <h4 className="text-white font-semibold mb-4 flex items-center">
          <Clock className="w-5 h-5 ml-2" />
          اختر الوقت
        </h4>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {timeSlots?.map((time, index) => {
            const isAvailable = isTimeSlotAvailable(time);
            return (
              <motion.button
                key={time}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.02 }}
                onClick={() => isAvailable && handleTimeSelect(time)}
                disabled={!isAvailable}
                className={`p-3 rounded-lg text-center transition-all ${
                  selectedTime === time
                    ? "bg-primary-500 text-white"
                    : isAvailable
                    ? "bg-dark-700 text-gray-300 hover:bg-dark-600"
                    : "bg-dark-800 text-gray-600 cursor-not-allowed"
                }`}
              >
                {time}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Selected DateTime Display */}
      {selectedDate && selectedTime && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary-500/10 border border-primary-500/30 rounded-lg p-4 mb-8"
        >
          <h4 className="text-primary-400 font-semibold mb-2">
            الموعد المحدد:
          </h4>
          <p className="text-white">
            {format(selectedDate, "EEEE، d MMMM yyyy", { locale: ar })} في{" "}
            {selectedTime}
          </p>
        </motion.div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={onPrev}
          className="flex items-center px-6 py-3 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowRight className="w-4 h-4 ml-2" />
          السابق
        </button>

        <button
          onClick={handleContinue}
          disabled={!selectedDate || !selectedTime}
          className={`px-8 py-3 rounded-lg font-semibold transition-all ${
            selectedDate && selectedTime
              ? "bg-primary-500 hover:bg-primary-600 text-white"
              : "bg-gray-600 text-gray-400 cursor-not-allowed"
          }`}
        >
          التالي
        </button>
      </div>
    </div>
  );
};

export default DateTimeSelection;
