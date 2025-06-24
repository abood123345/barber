import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Clock, Star, Calendar } from "lucide-react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { user } = useAuth();

  const categories = [
    { id: "all", name: "جميع الخدمات" },
    { id: "haircut", name: "قص الشعر" },
    { id: "beard", name: "تهذيب اللحية" },
    { id: "styling", name: "تصفيف الشعر" },
    { id: "treatment", name: "علاجات الشعر" },
    { id: "package", name: "باقات خاصة" },
  ];

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get("http://localhost:8090/api/services");
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices =
    selectedCategory === "all"
      ? services
      : services.filter((service) => service.category === selectedCategory);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            خدماتنا المتميزة
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            اكتشف مجموعة واسعة من خدمات الحلاقة والعناية المتخصصة
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                selectedCategory === category.id
                  ? "bg-primary-500 text-white"
                  : "bg-dark-700 text-gray-300 hover:bg-dark-600"
              }`}
            >
              {category.name}
            </button>
          ))}
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service, index) => (
            <motion.div
              key={service._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-dark-700/50 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all group"
            >
              <div className="h-48 bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                {service.image ? (
                  <img
                    src={service.image}
                    alt={service.nameAr}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-white text-6xl">✂️</div>
                )}
              </div>

              <div className="p-6">
                <h3 className="text-white font-semibold text-xl mb-2">
                  {service.nameAr}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {service.descriptionAr}
                </p>

                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center text-gray-400 text-sm">
                    <Clock className="w-4 h-4 ml-1" />
                    <span>{service.duration} دقيقة</span>
                  </div>
                  <div className="text-primary-500 font-bold text-lg">
                    {service.price} ريال
                  </div>
                </div>

                {service.popularity > 0 && (
                  <div className="flex items-center mb-4">
                    <Star className="w-4 h-4 text-yellow-500 fill-current ml-1" />
                    <span className="text-gray-400 text-sm">خدمة مميزة</span>
                  </div>
                )}

                <Link
                  to={user ? "/booking" : "/register"}
                  className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 px-4 rounded-lg transition-colors text-center block font-medium"
                >
                  <Calendar className="w-4 h-4 inline ml-2" />
                  احجز الآن
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-400 text-lg">
              لا توجد خدمات في هذه الفئة حالياً
            </p>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mt-20"
        >
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              لم تجد ما تبحث عنه؟
            </h2>
            <p className="text-primary-100 text-lg mb-8">
              تواصل معنا وسنساعدك في العثور على الخدمة المناسبة لك
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={user ? "/booking" : "/register"}
                className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                احجز استشارة مجانية
              </Link>
              <a
                href="tel:+966501234567"
                className="border border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 rounded-lg font-semibold transition-all"
              >
                اتصل بنا الآن
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Services;
