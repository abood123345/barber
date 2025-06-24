const RepeatOptions = ({ onContinue, updateData, data }) => {
  const handleRepeatChange = (wantRepeat) => {
    updateData({ wantRepeat });
  };

  const handleIntervalChange = (interval) => {
    updateData({ repeatInterval: interval });
  };

  const handleUnitChange = (unit) => {
    updateData({ repeatUnit: unit });
  };

  const handleCountChange = (count) => {
    updateData({ repeatCount: count });
  };

  const handleContinue = () => {
    if (data.wantRepeat) {
      // Generate appointments based on repeat settings
      const appointments = [];
      const baseDate = new Date(2025, 5, data.selectedDate); // June 2025
      
      for (let i = 0; i < data.repeatCount; i++) {
        const appointmentDate = new Date(baseDate);
        if (data.repeatUnit === 'يوم') {
          appointmentDate.setDate(appointmentDate.getDate() + (i * data.repeatInterval));
        } else if (data.repeatUnit === 'أسبوع') {
          appointmentDate.setDate(appointmentDate.getDate() + (i * data.repeatInterval * 7));
        } else if (data.repeatUnit === 'شهر') {
          appointmentDate.setMonth(appointmentDate.getMonth() + (i * data.repeatInterval));
        }
        
        appointments.push({
          id: i + 1,
          date: appointmentDate,
          time: data.selectedTime,
          price: data.service.price
        });
      }
      
      updateData({ appointments });
    } else {
      // Single appointment
      const appointments = [{
        id: 1,
        date: new Date(2025, 5, data.selectedDate),
        time: data.selectedTime,
        price: data.service.price
      }];
      updateData({ appointments });
    }
    
    onContinue();
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">حجز ثابت</h2>
        <button className="text-gray-500 hover:text-gray-700">
          ←
        </button>
      </div>

      {/* Repeat question */}
      <div className="mb-6">
        <label className="block text-gray-700 mb-3 font-medium">تكرار</label>
        <p className="text-sm text-gray-600 mb-4">هل تريد أن تكرار الموعد حجز مرة</p>
        
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="radio"
              name="repeat"
              checked={!data.wantRepeat}
              onChange={() => handleRepeatChange(false)}
              className="ml-2"
            />
            <span>مرة واحدة</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="repeat"
              checked={data.wantRepeat}
              onChange={() => handleRepeatChange(true)}
              className="ml-2"
            />
            <span>تكرار</span>
          </label>
        </div>
      </div>

      {/* Repeat options */}
      {data.wantRepeat && (
        <div className="mb-6">
          <label className="block text-gray-700 mb-3 font-medium">تكرر كل:</label>
          <div className="flex items-center space-x-2 space-x-reverse mb-4">
            <button
              onClick={() => handleIntervalChange(Math.max(1, data.repeatInterval - 1))}
              className="w-8 h-8 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
            >
              -
            </button>
            <span className="px-4 py-2 border rounded text-center min-w-[60px]">
              {data.repeatInterval}
            </span>
            <button
              onClick={() => handleIntervalChange(data.repeatInterval + 1)}
              className="w-8 h-8 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
            >
              +
            </button>
            <select
              value={data.repeatUnit}
              onChange={(e) => handleUnitChange(e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="يوم">يوم</option>
              <option value="أسبوع">أسبوع</option>
              <option value="شهر">شهر</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-medium">لمدة</label>
            <p className="text-sm text-gray-600 mb-2">كم عدد مرات تكرار</p>
            
            <div className="flex items-center space-x-2 space-x-reverse">
              <span>حتى التاريخ</span>
              <input
                type="date"
                className="border rounded px-3 py-2"
                disabled
              />
              <span>عدد</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 space-x-reverse">
            <span>مرة / مرات</span>
            <button
              onClick={() => handleCountChange(Math.max(1, data.repeatCount - 1))}
              className="w-8 h-8 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
            >
              -
            </button>
            <span className="px-4 py-2 border rounded text-center min-w-[60px]">
              {data.repeatCount}
            </span>
            <button
              onClick={() => handleCountChange(data.repeatCount + 1)}
              className="w-8 h-8 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
            >
              +
            </button>
            <span className="text-blue-600 cursor-pointer">بعد</span>
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded">
            <span className="text-sm text-gray-600">تكرار الموعد</span>
            <p className="text-sm">
              كل يوم من يونيو {data.selectedDate}، 2025 في {data.selectedTime}
              <br />
              عدد التكرارات: {data.repeatCount}
            </p>
          </div>
        </div>
      )}

      <button
        onClick={handleContinue}
        className="w-full py-3 rounded-lg font-medium bg-gray-800 text-white hover:bg-gray-700 transition-all"
      >
        استمر
      </button>
    </div>
  );
};

export default RepeatOptions;