import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Scissors, ArrowRight, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import axios from 'axios';
import toast from 'react-hot-toast';

const BookingConfirmation = ({ data, updateData, onNext, onPrev }) => {
  const [notes, setNotes] = useState(data.notes || '');
  const [loading, setLoading] = useState(false);

  const handleNotesChange = (e) => {
    const value = e.target.value;
    setNotes(value);
    updateData({ notes: value });
  };

  const handleConfirmBooking = async () => {
    setLoading(true);
    try {
      const appointmentData = {
        service: data.service._id,
        barber: data.barber._id,
        date: data.date,
        time: data.time,
        notes: notes,
        totalPrice: data.service.price
      };

      const response = await axios.post('/api/appointments', appointmentData);
      
      if (response.data) {
        updateData({ appointmentId: response.data._id });
        toast.success('تم حجز الموعد بنجاح!');
        onNext();
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast.error('حدث خطأ في حجز الموعد. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-dark-800/50 rounded-2xl p-8">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-white mb-4">تأكيد الحجز</h3>
        <p className="text-gray-400">راجع تفاصيل موعدك قبل التأكيد</p>
      </div>

      {/* Booking Summary */}
      <div className="bg-dark-700/50 rounded-lg p-6 mb-8">
        <h4 className="text-white font-semibold text-lg mb-6">ملخص الحجز</h4>
        
        <div className="space-y-4">
          {/* Service */}
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center">
              <Scissors className="w-6 h-6 text-primary-500" />
            </div>
            <div className="flex-1">
              <h5 className="text-white font-medium">{data.service?.nameAr}</h5>
              <p className="text-gray-400 text-sm">{data.service?.duration} دقيقة</p>
            </div>
            <div className="text-primary-500 font-bold text-lg">
              {data.service?.price} ريال
            </div>
          </div>

          {/* Barber */}
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h5 className="text-white font-medium">
                {data.barber?.firstName} {data.barber?.lastName}
              </h5>
              <p className="text-gray-400 text-sm">حلاق محترف</p>
            </div>
          </div>

          {/* Date & Time */}
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary-500" />
            </div>
            <div className="flex-1">
              <h5 className="text-white font-medium">
                {format(data.date, 'EEEE، d MMMM yyyy', { locale: ar })}
              </h5>
              <div className="flex items-center text-gray-400 text-sm">
                <Clock className="w-4 h-4 ml-1" />
                {data.time}
              </div>
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="border-t border-dark-600 mt-6 pt-6">
          <div className="flex justify-between items-center">
            <span className="text-white font-semibold text-lg">المجموع:</span>
            <span className="text-primary-500 font-bold text-2xl">
              {data.service?.price} ريال
            </span>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="mb-8">
        <label className="block text-white font-medium mb-3">
          <MessageSquare className="w-5 h-5 inline ml-2" />
          ملاحظات إضافية (اختياري)
        </label>
        <textarea
          value={notes}
          onChange={handleNotesChange}
          placeholder="أضف أي ملاحظات أو طلبات خاصة..."
          className="w-full p-4 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 resize-none"
          rows={4}
        />
      </div>

      {/* Terms */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-8">
        <h5 className="text-yellow-400 font-medium mb-2">شروط الحجز:</h5>
        <ul className="text-yellow-300 text-sm space-y-1">
          <li>• يرجى الحضور قبل 10 دقائق من موعدك</li>
          <li>• في حالة التأخير أكثر من 15 دقيقة، قد يتم إلغاء الموعد</li>
          <li>• يمكن إلغاء أو تعديل الموعد قبل 24 ساعة على الأقل</li>
          <li>• الدفع نقداً أو بالبطاقة عند الانتهاء من الخدمة</li>
        </ul>
      </div>

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
          onClick={handleConfirmBooking}
          disabled={loading}
          className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'جاري الحجز...' : 'تأكيد الحجز'}
        </button>
      </div>
    </div>
  );
};

export default BookingConfirmation;