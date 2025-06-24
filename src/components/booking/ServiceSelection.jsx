import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Star } from "lucide-react";
import axios from "axios";
import LoadingSpinner from "../LoadingSpinner";

const ServiceSelection = ({ data, updateData, onNext }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

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
      const response = await axios.get("/api/services");
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceSelect = (service) => {
    updateData({ service });
  };

  const handleContinue = () => {
    if (data.service) {
      onNext();
    }
  };

  const filteredServices = Array.isArray(services)
    ? selectedCategory === "all"
      ? services
      : services.filter((service) => service.category === selectedCategory)
    : [];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-dark-800/50 rounded-2xl p-8">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-white mb-4">
          اختر الخدمة المطلوبة
        </h3>
        <p className="text-gray-400">اختر من بين خدماتنا المتنوعة</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-3 mb-8">
        {categories?.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedCategory === category.id
                ? "bg-primary-500 text-white"
                : "bg-dark-700 text-gray-300 hover:bg-dark-600"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {filteredServices?.map((service, index) => (
          <motion.div
            key={service._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            onClick={() => handleServiceSelect(service)}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:scale-105 ${
              data.service?._id === service._id
                ? "border-primary-500 bg-primary-500/10"
                : "border-dark-600 bg-dark-700/50 hover:border-primary-500/50"
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <h4 className="text-white font-semibold text-lg">
                {service.nameAr}
              </h4>
              <div className="text-primary-500 font-bold text-lg">
                {service.price} ريال
              </div>
            </div>

            <p className="text-gray-400 text-sm mb-3 line-clamp-2">
              {service.descriptionAr}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-400 text-sm">
                <Clock className="w-4 h-4 ml-1" />
                <span>{service.duration} دقيقة</span>
              </div>

              {service.popularity > 0 && (
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 fill-current ml-1" />
                  <span className="text-yellow-500 text-sm">مميزة</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">لا توجد خدمات في هذه الفئة حالياً</p>
        </div>
      )}

      {/* Continue Button */}
      <div className="flex justify-end">
        <button
          onClick={handleContinue}
          disabled={!data.service}
          className={`px-8 py-3 rounded-lg font-semibold transition-all ${
            data.service
              ? "bg-primary-500 hover:bg-primary-600 text-white"
              : "bg-gray-600 text-gray-400 cursor-not-allowed"
          }`}
        >
          التالي
        </button>
      </div>
    </div>
  );
};

export default ServiceSelection;
