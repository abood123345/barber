const FinalConfirmation = ({ data, onRestart }) => {
  const formatDate = (date) => {
    return `يونيو ${date.getDate()}، ${date.getFullYear()}`;
  };

  const getTotalPrice = () => {
    return data.appointments.reduce((total, appointment) => total + appointment.price, 0);
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-2xl">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-green-600 text-2xl">✓</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">تم تأكيد الحجز!</h2>
        <p className="text-gray-600">شكراً لك، تم حفظ بياناتك بنجاح</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="font-bold text-lg mb-3">تفاصيل الحجز:</h3>
        
        <div className="space-y-3">
          <div>
            <span className="font-medium">الخدمة:</span>
            <span className="mr-2">{data.service.name}</span>
          </div>
          
          <div>
            <span className="font-medium">عدد الأشخاص:</span>
            <span className="mr-2">{data.peopleCount}</span>
          </div>

          <div>
            <span className="font-medium">المواعيد:</span>
            <div className="mt-2 space-y-1">
              {data.appointments.map((appointment, index) => (
                <div key={appointment.id} className="text-sm bg-white p-2 rounded">
                  {index + 1}. {formatDate(appointment.date)} في {appointment.time}
                </div>
              ))}
            </div>
          </div>

          <div>
            <span className="font-medium">المعلومات الشخصية:</span>
            <div className="mt-2 text-sm">
              <div>الاسم: {data.userInfo.firstName} {data.userInfo.lastName}</div>
              <div>الموبايل: {data.userInfo.mobile}</div>
              <div>البريد الإلكتروني: {data.userInfo.email}</div>
            </div>
          </div>

          <div>
            <span className="font-medium">طريقة الدفع:</span>
            <span className="mr-2">دفع نقدي</span>
          </div>

          <div className="border-t pt-3 mt-3">
            <div className="flex justify-between font-bold text-lg">
              <span>المجموع الإجمالي:</span>
              <span>₹{getTotalPrice().toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center space-y-3">
        <p className="text-sm text-gray-600">
          سنرسل لك رسالة تأكيد على البريد الإلكتروني والجوال
        </p>
        
        <button
          onClick={onRestart}
          className="w-full py-3 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-all"
        >
          حجز جديد
        </button>
      </div>
    </div>
  );
};

export default FinalConfirmation;