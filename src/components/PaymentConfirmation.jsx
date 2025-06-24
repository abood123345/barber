const PaymentConfirmation = ({ onContinue, updateData, data }) => {
  const getTotalPrice = () => {
    return data.appointments.reduce((total, appointment) => total + appointment.price, 0);
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-2xl">
      <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">تأكيد الدفع</h2>
      
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-bold text-lg mb-3">ملخص الطلب:</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>الخدمة:</span>
            <span>{data.service.name}</span>
          </div>
          <div className="flex justify-between">
            <span>عدد الأشخاص:</span>
            <span>{data.peopleCount}</span>
          </div>
          <div className="flex justify-between">
            <span>عدد المواعيد:</span>
            <span>{data.appointments.length}</span>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-bold">
              <span>المجموع:</span>
              <span>₹{getTotalPrice().toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-bold mb-3">طريقة الدفع:</h3>
        <div className="p-4 border border-green-300 bg-green-50 rounded-lg">
          <div className="flex items-center space-x-2 space-x-reverse">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="font-medium">دفع نقدي</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            سيتم الدفع نقداً عند الموعد
          </p>
        </div>
      </div>

      <button
        onClick={onContinue}
        className="w-full py-3 rounded-lg font-medium bg-green-600 text-white hover:bg-green-700 transition-all"
      >
        تأكيد الحجز والدفع
      </button>
    </div>
  );
};

export default PaymentConfirmation;