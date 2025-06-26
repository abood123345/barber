import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, AlertCircle } from "lucide-react";
import {
  format,
  addDays,
  isSameDay,
  isToday,
  isBefore,
  getDay,
} from "date-fns";
import { ar } from "date-fns/locale";
import axios from "axios";

const DateTimeSelection = ({ data, updateData, onNext, onPrev }) => {
  const [selectedDate, setSelectedDate] = useState(data.date || new Date());
  const [selectedTime, setSelectedTime] = useState(data.time || null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [workingDays, setWorkingDays] = useState([]);
  const [breakTime, setBreakTime] = useState(null);
  const [loading, setLoading] = useState(true);

  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  useEffect(() => {
    loadTimeSettings();
    if (selectedDate) {
      fetchBookedSlots(selectedDate);
    }
  }, [selectedDate]);

  const loadTimeSettings = () => {
    const savedSettings = localStorage.getItem('timeManagementSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setWorkingDays(settings.workingDays || []);
      setBreakTime(settings.breakTime || null);
    } else {
      // Default settings
      setWorkingDays([
        { id: 'sunday', enabled: true, openTime: '09:00', closeTime: '21:00', slotDuration: 40 },
        { id: 'monday', enabled: true, openTime: '09:00', closeTime: '21:00', slotDuration: 20 },
        { id: 'tuesday', enabled: true, openTime: '09:00', closeTime: '21:00', slotDuration: 40 },
        { id: 'wednesday', enabled: true, openTime: '09:00', closeTime: '21:00', slotDuration: 40 },
        { id: 'thursday', enabled: true, openTime: '09:00', closeTime: '21:00', slotDuration: 40 },
        { id: 'friday', enabled: false, openTime: '14:00', closeTime: '18:00', slotDuration: 40 },
        { id: 'saturday', enabled: false, openTime: '09:00', closeTime: '21:00', slotDuration: 40 },
      ]);
      setBreakTime({ enabled: true, startTime: '12:00', endTime: '13:00' });
    }
    setLoading(false);
  };

  const fetchBookedSlots = async (date) => {
    try {
      const response = await axios.get(`http://localhost:8090/api/appointments`);
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayBookings = response.data.filter(apt => {
        const aptDate = format(new Date(apt.date), 'yyyy-MM-dd');
        return aptDate === dateStr && apt.status !== 'cancelled';
      });
      
      setBookedSlots(dayBookings.map(apt => apt.time));
    } catch (error) {
      console.error('Error fetching booked slots:', error);
      setBookedSlots([]);
    }
  };

  const generateTimeSlots = (date) => {
    const dayIndex = getDay(date);
    const dayName = dayNames[dayIndex];
    const dayConfig = workingDays.find(d => d.id === dayName);
    
    if (!dayConfig || !dayConfig.enabled) return [];
    
    const slots = [];
    const start = new Date(`2000-01-01T${dayConfig.openTime}:00`);
    const end = new Date(`2000-01-01T${dayConfig.closeTime}:00`);
    const breakStart = breakTime?.enabled ? new Date(`2000-01-01T${breakTime.startTime}:00`) : null;
    const breakEnd = breakTime?.enabled ? new Date(`2000-01-01T${breakTime.endTime}:00`) : null;
    
    let current = new Date(start);
    
    while (current < end) {
      const slotEnd = new Date(current.getTime() + dayConfig.slotDuration * 60000);
      const timeStr = current.toTimeString().slice(0, 5);
      
      // Check if slot overlaps with break time
      const isBreakTime = breakStart && breakEnd && 
        ((current >= breakStart && current < breakEnd) || 
         (slotEnd > breakStart && slotEnd <= breakEnd) ||
         (current < breakStart && slotEnd > breakEnd));
      
      // Check if slot is in the past
      const now = new Date();
      const slotDateTime = new Date(date);
      const [hours, minutes] = timeStr.split(':');
      slotDateTime.setHours(parseInt(hours), parseInt(minutes));
      const isPast = isBefore(slotDateTime, now);
      
      // Check if slot is booked
      const isBooked = bookedSlots.includes(timeStr);
      
      if (!isBreakTime && slotEnd <= end) {
        slots.push({
          time: timeStr,
          duration: dayConfig.slotDuration,
          available: !isPast && !isBooked,
          isPast,
          isBooked
        });
      }
      
      current = new Date(current.getTime() + dayConfig.slotDuration * 60000);
    }
    
    return slots;
  };

  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = addDays(today, i);
      const dayIndex = getDay(date);
      const dayName = dayNames[dayIndex];
      const dayConfig = workingDays.find(d => d.id === dayName);
      
      if (dayConfig && dayConfig.enabled) {
        dates.push(date);
        if (dates.length >= 14) break;
      }
    }
    return dates;
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    updateData({ date, time: null });
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

  if (loading) {
    return (
      <div className="bg-dark-800/50 rounded-2xl p-8 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-400">جاري تحميل الأوقات المتاحة...</p>
      </div>
    );
  }

  const dates = generateAvailableDates();
  const timeSlots = generateTimeSlots(selectedDate);

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
            <p className="text-gray-400 text-sm">{data.service?.duration} دقيقة</p>
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
          {selectedDate && (
            <span className="text-gray-400 text-sm mr-4">
              ({timeSlots.filter(slot => slot.available).length} فترة متاحة)
            </span>
          )}
        </h4>
        
        {timeSlots.length === 0 ? (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <p className="text-red-400">لا توجد أوقات متاحة في هذا اليوم</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {timeSlots?.map((slot, index) => (
              <motion.button
                key={slot.time}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.02 }}
                onClick={() => slot.available && handleTimeSelect(slot.time)}
                disabled={!slot.available}
                className={`p-3 rounded-lg text-center transition-all relative ${
                  selectedTime === slot.time
                    ? "bg-primary-500 text-white"
                    : slot.available
                    ? "bg-dark-700 text-gray-300 hover:bg-dark-600"
                    : slot.isBooked
                    ? "bg-red-500/20 text-red-400 cursor-not-allowed"
                    : "bg-dark-800 text-gray-600 cursor-not-allowed"
                }`}
              >
                <div className="text-sm font-medium">{slot.time}</div>
                {slot.isBooked && (
                  <div className="text-xs mt-1">محجوز</div>
                )}
                {slot.isPast && !slot.isBooked && (
                  <div className="text-xs mt-1">منتهي</div>
                )}
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Break Time Notice */}
      {breakTime?.enabled && (
        <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <div className="flex items-center">
            <Coffee className="w-5 h-5 text-yellow-400 ml-2" />
            <span className="text-yellow-400 font-medium">فترة الاستراحة:</span>
            <span className="text-yellow-300 mr-2">
              {breakTime.startTime} - {breakTime.endTime}
            </span>
          </div>
        </div>
      )}

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