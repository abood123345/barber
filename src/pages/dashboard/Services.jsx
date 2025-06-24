import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Clock,
  DollarSign,
  Star,
  Eye,
  EyeOff,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";

const DashboardServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    nameAr: "",
    description: "",
    descriptionAr: "",
    price: "",
    duration: "",
    category: "haircut",
    image: "",
    isActive: true,
  });

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
      toast.error("حدث خطأ في تحميل الخدمات");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingService) {
        await axios.put(
          `http://localhost:8090/api/services/${editingService._id}`,
          formData
        );
        toast.success("تم تحديث الخدمة بنجاح");
      } else {
        await axios.post("http://localhost:8090/api/services", formData);
        toast.success("تم إضافة الخدمة بنجاح");
      }
      fetchServices();
      resetForm();
    } catch (error) {
      console.error("Error saving service:", error);
      toast.error("حدث خطأ في حفظ الخدمة");
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name || "",
      nameAr: service.nameAr,
      description: service.description || "",
      descriptionAr: service.descriptionAr,
      price: service.price.toString(),
      duration: service.duration.toString(),
      category: service.category,
      image: service.image || "",
      isActive: service.isActive,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذه الخدمة؟")) return;

    try {
      await axios.delete(`http://localhost:8090/api/services/${id}`);
      setServices(services.filter((service) => service._id !== id));
      toast.success("تم حذف الخدمة بنجاح");
    } catch (error) {
      console.error("Error deleting service:", error);
      toast.error("حدث خطأ في حذف الخدمة");
    }
  };

  const toggleServiceStatus = async (id, currentStatus) => {
    try {
      await axios.put(`http://localhost:8090/api/services/${id}`, {
        isActive: !currentStatus,
      });
      setServices(
        services.map((service) =>
          service._id === id
            ? { ...service, isActive: !currentStatus }
            : service
        )
      );
      toast.success("تم تحديث حالة الخدمة");
    } catch (error) {
      console.error("Error updating service status:", error);
      toast.error("حدث خطأ في تحديث الخدمة");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      nameAr: "",
      description: "",
      descriptionAr: "",
      price: "",
      duration: "",
      category: "haircut",
      image: "",
      isActive: true,
    });
    setEditingService(null);
    setShowModal(false);
  };

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">إدارة الخدمات</h1>
            <p className="text-gray-400">إضافة وتعديل خدمات الصالون</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center"
          >
            <Plus className="w-5 h-5 ml-2" />
            إضافة خدمة جديدة
          </button>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-dark-800/50 rounded-lg p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="البحث في الخدمات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-12 pl-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-4 space-x-reverse">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service, index) => (
            <motion.div
              key={service._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-dark-800/50 rounded-lg p-6 border border-dark-600 hover:border-primary-500/50 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg mb-1">
                    {service.nameAr}
                  </h3>
                  {service.name && (
                    <p className="text-gray-400 text-sm">{service.name}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <button
                    onClick={() => toggleServiceStatus(service._id, service.isActive)}
                    className={`p-2 rounded-lg transition-all ${
                      service.isActive
                        ? "text-green-400 hover:bg-green-400/10"
                        : "text-gray-400 hover:bg-gray-400/10"
                    }`}
                  >
                    {service.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleEdit(service)}
                    className="text-blue-400 hover:text-blue-300 p-2 rounded-lg hover:bg-blue-400/10 transition-all"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(service._id)}
                    className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-400/10 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                {service.descriptionAr}
              </p>

              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center text-gray-400 text-sm">
                  <Clock className="w-4 h-4 ml-1" />
                  {service.duration} دقيقة
                </div>
                <div className="flex items-center text-primary-500 font-bold">
                  <DollarSign className="w-4 h-4 ml-1" />
                  {service.price} ريال
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm capitalize">
                  {categories.find(cat => cat.id === service.category)?.name}
                </span>
                <div className="flex items-center">
                  {service.popularity > 0 && (
                    <div className="flex items-center text-yellow-500">
                      <Star className="w-4 h-4 fill-current ml-1" />
                      <span className="text-sm">مميزة</span>
                    </div>
                  )}
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium mr-2 ${
                      service.isActive
                        ? "bg-green-400/10 text-green-400"
                        : "bg-gray-400/10 text-gray-400"
                    }`}
                  >
                    {service.isActive ? "نشطة" : "معطلة"}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-dark-800/50 rounded-lg p-8 text-center"
          >
            <h3 className="text-white font-semibold text-lg mb-2">
              لا توجد خدمات
            </h3>
            <p className="text-gray-400">لا توجد خدمات تطابق معايير البحث</p>
          </motion.div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-dark-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                {editingService ? "تعديل الخدمة" : "إضافة خدمة جديدة"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">
                      اسم الخدمة (عربي) *
                    </label>
                    <input
                      type="text"
                      value={formData.nameAr}
                      onChange={(e) =>
                        setFormData({ ...formData, nameAr: e.target.value })
                      }
                      required
                      className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">
                      اسم الخدمة (إنجليزي)
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    وصف الخدمة (عربي) *
                  </label>
                  <textarea
                    value={formData.descriptionAr}
                    onChange={(e) =>
                      setFormData({ ...formData, descriptionAr: e.target.value })
                    }
                    required
                    rows={3}
                    className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    وصف الخدمة (إنجليزي)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">
                      السعر (ريال) *
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      required
                      min="0"
                      className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">
                      المدة (دقيقة) *
                    </label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({ ...formData, duration: e.target.value })
                      }
                      required
                      min="15"
                      className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">
                      الفئة *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      required
                      className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                    >
                      {categories.slice(1).map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    رابط الصورة
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="ml-2"
                  />
                  <label htmlFor="isActive" className="text-white">
                    خدمة نشطة
                  </label>
                </div>

                <div className="flex justify-end space-x-4 space-x-reverse">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-600 transition-all"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-all"
                  >
                    {editingService ? "تحديث" : "إضافة"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardServices;