import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Clock,
  Calendar,
  Save,
  X,
  Coffee,
  Settings,
} from "lucide-react";
import toast from "react-hot-toast";

const TimeManagement = () => {
  const [workingDays, setWorkingDays] = useState([
    { 
      id: 'sunday', 
      name: 'الأحد', 
      nameHe: 'ראשון', 
      enabled: true,
      openTime: '09:00',
      closeTime: '21:00',
      slotDuration: 40 // minutes
    },
    { 
      id: 'monday', 
      name: 'الاثنين', 
      nameHe: 'שני', 
      enabled: true,
      openTime: '09:00',
      closeTime: '21:00',
      slotDuration: 20 // minutes - special for Monday
    },
    { 
      id: 'tuesday', 
      name: 'الثلاثاء', 
      nameHe: 'שלישי', 
      enabled: true,
      openTime: '09:00',
      closeTime: '21:00',
      slotDuration: 40
    },
    { 
      id: 'wednesday', 
      name: 'الأربعاء', 
      nameHe: 'רביעי', 
      enabled: true,
      openTime: '09:00',
      closeTime: '21:00',
      slotDuration: 40
    },
    { 
      id: 'thursday', 
      name: 'الخميس', 
      nameHe: 'חמישי', 
      enabled: true,
      openTime: '09:00',
      closeTime: '21:00',
      slotDuration: 40
    },
    { 
      id: 'friday', 
      name: 'الجمعة', 
      nameHe: 'שישי', 
      enabled: false,
      openTime: '14:00',
      closeTime: '18:00',
      slotDuration: 40
    },
    { 
      id: 'saturday', 
      name: 'السبت', 
      nameHe: 'שבת', 
      enabled: false,
      openTime: '09:00',
      closeTime: '21:00',
      slotDuration: 40
    },
  ]);

  const [breakTime, setBreakTime] = useState({
    enabled: true,
    startTime: '12:00',
    endTime: '13:00'
  });

  const [editingDay, setEditingDay] = useState(null);

  const toggleDay = (dayId) => {
    setWorkingDays(prev => 
      prev.map(day => 
        day.id === dayId ? { ...day, enabled: !day.enabled } : day
      )
    );
  };

  const updateDayTimes = (dayId, openTime, closeTime) => {
    setWorkingDays(prev => 
      prev.map(day => 
        day.id === dayId ? { ...day, openTime, closeTime } : day
      )
    );
    setEditingDay(null);
    toast.success('تم تحديث أوقات العمل');
  };

  const generateTimeSlots = (day) => {
    if (!day.enabled) return [];
    
    const slots = [];
    const start = new Date(`2000-01-01T${day.openTime}:00`);
    const end = new Date(`2000-01-01T${day.closeTime}:00`);
    const breakStart = breakTime.enabled ? new Date(`2000-01-01T${breakTime.startTime}:00`) : null;
    const breakEnd = breakTime.enabled ? new Date(`2000-01-01T${breakTime.endTime}:00`) : null;
    
    let current = new Date(start);
    
    while (current < end) {
      const slotEnd = new Date(current.getTime() + day.slotDuration * 60000);
      
      // Check if slot overlaps with break time
      const isBreakTime = breakStart && breakEnd && 
        ((current >= breakStart && current < breakEnd) || 
         (slotEnd > breakStart && slotEnd <= breakEnd) ||
         (current < breakStart && slotEnd > breakEnd));
      
      if (!isBreakTime && slotEnd <= end) {
        slots.push({
          time: current.toTimeString().slice(0, 5),
          duration: day.slotDuration,
          available: true
        });
      }
      
      current = new Date(current.getTime() + day.slotDuration * 60000);
    }
    
    return slots;
  };

  const saveSettings = () => {
    const settings = {
      workingDays,
      breakTime,
      lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem('timeManagementSettings', JSON.stringify(settings));
    toast.success('تم حفظ الإعدادات بنجاح');
  };

  useEffect(() => {
    const savedSettings = localStorage.getItem('timeManagementSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      if (settings.workingDays) setWorkingDays(settings.workingDays);
      if (settings.breakTime) setBreakTime(settings.breakTime);
    }
  }, []);

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">إدارة أوقات العمل</h1>
            <p className="text-gray-400">تحديد أيام وأوقات العمل المتاحة للحجز</p>
          </div>
          <button
            onClick={saveSettings}
            className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center"
          >
            <Save className="w-5 h-5 ml-2" />
            حفظ الإعدادات
          </button>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Working Days */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="xl:col-span-2 bg-dark-800/50 rounded-lg p-6"
          >
            <div className="flex items-center mb-6">
              <Calendar className="w-6 h-6 text-primary-500 ml-3" />
              <h2 className="text-xl font-bold text-white">أيام وأوقات العمل</h2>
            </div>

            <div className="space-y-4">
              {workingDays.map((day) => (
                <div
                  key={day.id}
                  className="p-4 bg-dark-700/50 rounded-lg border border-dark-600"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-white font-medium text-lg">{day.name}</span>
                      <span className="text-gray-400 text-sm mr-2">({day.nameHe})</span>
                      {day.id === 'monday' && (
                        <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs mr-2">
                          {day.slotDuration} دقيقة
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-3 space-x-reverse">
                      {day.enabled && (
                        <button
                          onClick={() => setEditingDay(editingDay === day.id ? null : day.id)}
                          className="text-blue-400 hover:text-blue-300 p-2 rounded-lg hover:bg-blue-400/10 transition-all"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => toggleDay(day.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          day.enabled ? 'bg-primary-500' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            day.enabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {day.enabled && (
                    <div className="space-y-3">
                      {editingDay === day.id ? (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-gray-400 text-sm mb-1">وقت الفتح</label>
                            <input
                              type="time"
                              value={day.openTime}
                              onChange={(e) => setWorkingDays(prev => 
                                prev.map(d => d.id === day.id ? {...d, openTime: e.target.value} : d)
                              )}
                              className="w-full px-3 py-2 bg-dark-600 border border-dark-500 rounded-lg text-white focus:outline-none focus:border-primary-500"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-400 text-sm mb-1">وقت الإغلاق</label>
                            <input
                              type="time"
                              value={day.closeTime}
                              onChange={(e) => setWorkingDays(prev => 
                                prev.map(d => d.id === day.id ? {...d, closeTime: e.target.value} : d)
                              )}
                              className="w-full px-3 py-2 bg-dark-600 border border-dark-500 rounded-lg text-white focus:outline-none focus:border-primary-500"
                            />
                          </div>
                          <div className="col-span-2 flex justify-end space-x-2 space-x-reverse">
                            <button
                              onClick={() => updateDayTimes(day.id, day.openTime, day.closeTime)}
                              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm transition-all"
                            >
                              حفظ
                            </button>
                            <button
                              onClick={() => setEditingDay(null)}
                              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-all"
                            >
                              إلغاء
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-300">
                            من {day.openTime} إلى {day.closeTime}
                          </span>
                          <span className="text-primary-400">
                            {generateTimeSlots(day).length} فترة متاحة
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Break Time & Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {/* Break Time Settings */}
            <div className="bg-dark-800/50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Coffee className="w-6 h-6 text-primary-500 ml-3" />
                  <h2 className="text-xl font-bold text-white">فترة الاستراحة</h2>
                </div>
                <button
                  onClick={() => setBreakTime(prev => ({...prev, enabled: !prev.enabled}))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    breakTime.enabled ? 'bg-primary-500' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      breakTime.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {breakTime.enabled && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">بداية الاستراحة</label>
                    <input
                      type="time"
                      value={breakTime.startTime}
                      onChange={(e) => setBreakTime(prev => ({...prev, startTime: e.target.value}))}
                      className="w-full px-3 py-2 bg-dark-600 border border-dark-500 rounded-lg text-white focus:outline-none focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">نهاية الاستراحة</label>
                    <input
                      type="time"
                      value={breakTime.endTime}
                      onChange={(e) => setBreakTime(prev => ({...prev, endTime: e.target.value}))}
                      className="w-full px-3 py-2 bg-dark-600 border border-dark-500 rounded-lg text-white focus:outline-none focus:border-primary-500"
                    />
                  </div>
                </div>
              )}

              <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="text-yellow-400 text-sm">
                  <strong>ملاحظة:</strong> فترة الاستراحة ستُستثنى من جميع الأيام المفعلة
                </p>
              </div>
            </div>

            {/* Time Slots Preview */}
            <div className="bg-dark-800/50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Settings className="w-5 h-5 text-primary-500 ml-2" />
                <h3 className="text-white font-semibold">معاينة الفترات</h3>
              </div>
              
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {workingDays.filter(day => day.enabled).map(day => (
                  <div key={day.id} className="border-b border-dark-600 pb-2">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white text-sm font-medium">{day.name}</span>
                      <span className="text-gray-400 text-xs">
                        {generateTimeSlots(day).length} فترة
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {generateTimeSlots(day).slice(0, 6).map((slot, index) => (
                        <span
                          key={index}
                          className="bg-primary-500/20 text-primary-400 px-2 py-1 rounded text-xs"
                        >
                          {slot.time}
                        </span>
                      ))}
                      {generateTimeSlots(day).length > 6 && (
                        <span className="text-gray-400 text-xs px-2 py-1">
                          +{generateTimeSlots(day).length - 6} المزيد
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8 bg-dark-800/50 rounded-lg p-6"
        >
          <h3 className="text-white font-semibold text-lg mb-4">ملخص الإعدادات</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-gray-400 font-medium mb-2">أيام العمل النشطة:</h4>
              <div className="flex flex-wrap gap-2">
                {workingDays.filter(day => day.enabled).map(day => (
                  <span
                    key={day.id}
                    className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-sm"
                  >
                    {day.name}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-gray-400 font-medium mb-2">إجمالي الفترات المتاحة:</h4>
              <div className="space-y-1 text-sm">
                <p className="text-white">
                  يومياً: <span className="text-primary-500">
                    {Math.round(workingDays.filter(d => d.enabled).reduce((sum, day) => 
                      sum + generateTimeSlots(day).length, 0) / workingDays.filter(d => d.enabled).length || 0)}
                  </span> فترة
                </p>
                <p className="text-white">
                  أسبوعياً: <span className="text-green-400">
                    {workingDays.filter(d => d.enabled).reduce((sum, day) => 
                      sum + generateTimeSlots(day).length, 0)}
                  </span> فترة
                </p>
              </div>
            </div>
            <div>
              <h4 className="text-gray-400 font-medium mb-2">فترة الاستراحة:</h4>
              <p className="text-white text-sm">
                {breakTime.enabled 
                  ? `${breakTime.startTime} - ${breakTime.endTime}` 
                  : 'معطلة'
                }
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TimeManagement;