import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, ArrowRight } from 'lucide-react';
import axios from 'axios';
import LoadingSpinner from '../LoadingSpinner';

const BarberSelection = ({ data, updateData, onNext, onPrev }) => {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBarbers();
  }, []);

  const fetchBarbers = async () => {
    try {
      const response = await axios.get('/api/barbers');
      setBarbers(response.data);
    } catch (error) {
      console.error('Error fetching barbers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBarberSelect = (barber) => {
    updateData({ barber });
  };

  const handleContinue = () => {
    if (data.barber) {
      onNext();
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-dark-800/50 rounded-2xl p-8">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-white mb-4">اختر الحلاق المفضل</h3>
        <p className="text-gray-400">اختر من بين فريقنا المتخصص من الحلاقين</p>
      </div>

      {/* Selected Service Info */}
      {data.service && (
        <div className="bg-dark-700/50 rounded-lg p-4 mb-8">
          <h4 className="text-white font-semibold mb-2">الخدمة المختارة:</h4>
          <div className="flex justify-between items-center">
            <span className="text-gray-300">{data.service.nameAr}</span>
            <span className="text-primary-500 font-semibold">{data.service.price} ريال</span>
          </div>
        </div>
      )}

      {/* Barbers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {barbers?.map((barber, index) => (
          <motion.div
            key={barber._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            onClick={() => handleBarberSelect(barber)}
            className={`p-6 rounded-lg border-2 cursor-pointer transition-all hover:scale-105 ${
              data.barber?._id === barber._id
                ? 'border-primary-500 bg-primary-500/10'
                : 'border-dark-600 bg-dark-700/50 hover:border-primary-500/50'
            }`}
          >
            <div className="flex items-center space-x-4 space-x-reverse mb-4">
              <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center">
                {barber.avatar ? (
                  <img 
                    src={barber.avatar} 
                    alt={barber.firstName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white text-xl font-bold">
                    {barber.firstName?.charAt(0)}
                  </span>
                )}
              </div>
              <div>
                <h4 className="text-white font-semibold text-lg">
                  {barber.firstName} {barber.lastName}
                </h4>
                <p className="text-gray-400 text-sm">حلاق محترف</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {[...Array(5)]?.map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                ))}
                <span className="text-gray-400 text-sm mr-2">5.0</span>
              </div>
              <span className="text-primary-500 text-sm">متاح</span>
            </div>
          </motion.div>
        ))}
      </div>

      {barbers.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">لا يوجد حلاقين متاحين حالياً</p>
        </div>
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
          disabled={!data.barber}
          className={`px-8 py-3 rounded-lg font-semibold transition-all ${
            data.barber
              ? 'bg-primary-500 hover:bg-primary-600 text-white'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          التالي
        </button>
      </div>
    </div>
  );
};

export default BarberSelection;