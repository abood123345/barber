import { motion } from 'framer-motion';
import { CheckCircle, Calendar, Clock, User, Scissors, Home, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

const BookingSuccess = ({ data }) => {
  return (
    <div className="bg-dark-800/50 rounded-2xl p-8 text-center">
      {/* Success Animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="mb-8"
      >
        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">تم حجز موعدك بنجاح!</h2>
        <p className="text-gray-400 text-lg">
          شكراً لك، سنراك قريباً في صالوننا
        </p>
      </motion.div>

      {/* Booking Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-dark-700/50 rounded-lg p-6 mb-8"
      >
        <h3 className="text-white font-semibold text-lg mb-6">تفاصيل موعدك</h3>
        
        <div className="space-y-4 text-right">
          {/* Service */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 space-x-reverse">
              <Scissors className="w-5 h-5 text-primary-500" />
              <span className="text-gray-300">الخدمة:</span>
            </div>
            <span className="text-white font-medium">{data.service?.nameAr}</span>
          </div>

          {/* Barber */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 space-x-reverse">
              <User className="w-5 h-5 text-primary-500" />
              <span className="text-gray-300">الحلاق:</span>
            </div>
            <span className="text-white font-medium">
              {data.barber?.firstName} {data.barber?.lastName}
            </span>
          </div>

          {/* Date */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 space-x-reverse">
              <Calendar className="w-5 h-5 text-primary-500" />
              <span className="text-gray-300">التاريخ:</span>
            </div>
            <span className="text-white font-medium">
              {format(data.date, 'EEEE، d MMMM yyyy', { locale: ar })}
            </span>
          </div>

          {/* Time */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 space-x-reverse">
              <Clock className="w-5 h-5 text-primary-500" />
              <span className="text-gray-300">الوقت:</span>
            </div>
            <span className="text-white font-medium">{data.time}</span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between border-t border-dark-600 pt-4">
            <span className="text-gray-300 font-medium">المجموع:</span>
            <span className="text-primary-500 font-bold text-xl">
              {data.service?.price} ريال
            </span>
          </div>
        </div>
      </motion.div>

      {/* Important Notes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-8"
      >
        <h4 className="text-blue-400 font-medium mb-3">تذكير مهم:</h4>
        <ul className="text-blue-300 text-sm space-y-2 text-right">
          <li>• احضر قبل 10 دقائق من موعدك</li>
          <li>• أحضر هويتك الشخصية</li>
          <li>• سنرسل لك رسالة تذكير قبل الموعد بـ 24 ساعة</li>
          <li>• للإلغاء أو التعديل، اتصل بنا قبل 24 ساعة على الأقل</li>
        </ul>
      </motion.div>

      {/* Contact Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="bg-dark-700/30 rounded-lg p-4 mb-8"
      >
        <h4 className="text-white font-medium mb-3">معلومات التواصل:</h4>
        <div className="flex justify-center space-x-6 space-x-reverse text-sm">
          <div className="text-gray-300">
            <span className="text-primary-500">الهاتف:</span> +966 50 123 4567
          </div>
          <div className="text-gray-300">
            <span className="text-primary-500">العنوان:</span> الرياض، حي الملز
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Link
          to="/"
          className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold transition-all flex items-center justify-center"
        >
          <Home className="w-5 h-5 ml-2" />
          العودة للرئيسية
        </Link>
        
        <Link
          to="/profile"
          className="border border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white px-8 py-3 rounded-lg font-semibold transition-all flex items-center justify-center"
        >
          <Calendar className="w-5 h-5 ml-2" />
          مواعيدي
        </Link>
        
        <a
          href="tel:+966501234567"
          className="border border-gray-600 text-gray-300 hover:border-gray-500 hover:text-white px-8 py-3 rounded-lg font-semibold transition-all flex items-center justify-center"
        >
          <MessageCircle className="w-5 h-5 ml-2" />
          اتصل بنا
        </a>
      </motion.div>
    </div>
  );
};

export default BookingSuccess;