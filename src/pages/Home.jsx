import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Scissors, 
  Clock, 
  Users, 
  Star, 
  Calendar,
  CheckCircle,
  Award,
  MapPin
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const features = [
    {
      icon: <Scissors className="w-8 h-8" />,
      title: 'خدمات احترافية',
      description: 'حلاقين محترفين بخبرة عالية'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'مواعيد مرنة',
      description: 'احجز موعدك في الوقت المناسب لك'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'خدمة عملاء ممتازة',
      description: 'فريق متخصص لخدمتك على مدار الساعة'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'جودة عالية',
      description: 'نستخدم أفضل المنتجات والأدوات'
    }
  ];

  const services = [
    {
      name: 'قص الشعر الكلاسيكي',
      price: '50 ريال',
      duration: '30 دقيقة',
      image: 'https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      name: 'تهذيب اللحية',
      price: '30 ريال',
      duration: '20 دقيقة',
      image: 'https://images.pexels.com/photos/1570807/pexels-photo-1570807.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      name: 'قص وتصفيف',
      price: '80 ريال',
      duration: '45 دقيقة',
      image: 'https://images.pexels.com/photos/1570806/pexels-photo-1570806.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const testimonials = [
    {
      name: 'أحمد محمد',
      rating: 5,
      comment: 'خدمة ممتازة وحلاقين محترفين. أنصح بشدة!'
    },
    {
      name: 'سعد العتيبي',
      rating: 5,
      comment: 'أفضل صالون حلاقة في المدينة. جودة عالية وأسعار معقولة.'
    },
    {
      name: 'محمد الأحمد',
      rating: 5,
      comment: 'موظفين ودودين ونتائج رائعة. سأعود بالتأكيد.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900" />
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1570807/pexels-photo-1570807.jpeg?auto=compress&cs=tinysrgb&w=1200')] bg-cover bg-center opacity-10" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              أفضل صالون حلاقة
              <span className="block gradient-text">في المدينة</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              احجز موعدك الآن واستمتع بأفضل خدمات الحلاقة والعناية على يد خبراء محترفين
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={user ? "/booking" : "/register"}
                className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                <Calendar className="w-5 h-5 inline ml-2" />
                احجز موعدك الآن
              </Link>
              <Link
                to="/services"
                className="border border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white px-8 py-4 rounded-lg font-semibold transition-all"
              >
                تصفح الخدمات
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute top-20 left-10 w-20 h-20 bg-primary-500/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute bottom-20 right-10 w-32 h-32 bg-primary-600/10 rounded-full blur-xl"
        />
      </section>

      {/* Features Section */}
      <section className="py-20 bg-dark-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              لماذا تختارنا؟
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              نقدم أفضل خدمات الحلاقة والعناية بجودة عالية وأسعار منافسة
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="text-center p-6 rounded-lg bg-dark-700/50 hover:bg-dark-700 transition-all group"
              >
                <div className="text-primary-500 mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              خدماتنا المميزة
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              مجموعة متنوعة من الخدمات المتخصصة لتلبية جميع احتياجاتك
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-dark-700/50 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all group"
              >
                <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${service.image})` }} />
                <div className="p-6">
                  <h3 className="text-white font-semibold text-lg mb-2">{service.name}</h3>
                  <div className="flex justify-between items-center text-gray-400 text-sm mb-4">
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 ml-1" />
                      {service.duration}
                    </span>
                    <span className="text-primary-500 font-semibold">{service.price}</span>
                  </div>
                  <Link
                    to={user ? "/booking" : "/register"}
                    className="w-full bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg transition-colors text-center block"
                  >
                    احجز الآن
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-dark-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              آراء عملائنا
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              اكتشف ما يقوله عملاؤنا عن خدماتنا
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-dark-700/50 p-6 rounded-lg"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4">"{testimonial.comment}"</p>
                <p className="text-primary-500 font-semibold">{testimonial.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 md:p-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              جاهز لتجربة أفضل حلاقة؟
            </h2>
            <p className="text-primary-100 text-lg mb-8">
              احجز موعدك الآن واستمتع بخدمة استثنائية
            </p>
            <Link
              to={user ? "/booking" : "/register"}
              className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg inline-flex items-center"
            >
              <Calendar className="w-5 h-5 ml-2" />
              احجز موعدك الآن
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;