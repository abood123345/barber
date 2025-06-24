const BookingSummary = ({ onContinue, updateData, data }) => {
  const formatDate = (date) => {
    const months = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    return `يونيو ${date.getDate()}، ${date.getFullYear()}`;
  };

  const getTotalPrice = () => {
    return data.appointments.reduce((total, appointment) => total + appointment.price, 0);
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">ملخص الحجز</h2>
        <button className="text-gray-500 hover:text-gray-700">
          ←
        </button>
      </div>

      {/* Warning message */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-2 space-x-reverse">
          <span className="text-yellow-600 text-xl">⚠️</span>
          <div>
            <p className="text-sm text-yellow-800 font-medium">التعارف الآمنة أم لا</p>
            <p className="text-xs text-yellow-700">
              4 التعارف الأمنية التي تحذيرها مطموعة عليك أخيراً اتخذ التعارف الأمنية
            </p>
          </div>
        </div>
      </div>

      {/* Appointments list */}
      <div className="space-y-3 mb-6">
        {data.appointments.map((appointment, index) => (
          <div key={appointment.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">
                  {index + 1}. {formatDate(appointment.date)} {appointment.time}
                </span>
              </div>
              <button className="text-gray-500 hover:text-gray-700">
                ⋮
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="border-t pt-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="font-bold">المجموع:</span>
          <span className="font-bold">₹{getTotalPrice().toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={onContinue}
        className="w-full py-3 rounded-lg font-medium bg-gray-800 text-white hover:bg-gray-700 transition-all"
      >
        استمر
      </button>
    </div>
  );
};

export default BookingSummary;