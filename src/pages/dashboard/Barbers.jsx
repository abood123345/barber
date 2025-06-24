import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Users,
  Star,
  Calendar,
  DollarSign,
  Eye,
  EyeOff,
  Phone,
  Mail,
} from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import axios from "axios";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";

const DashboardBarbers = () => {
  const [barbers, setBarbers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingBarber, setEditingBarber] = useState(null);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    avatar: "",
    isActive: true,
  });

  useEffect(() => {
    fetchBarbers();
    fetchAppointments();
  }, []);

  const fetchBarbers = async () => {
    try {
      const response = await axios.get("http://localhost:8090/api/barbers");
      setBarbers(response.data);
    } catch (error) {
      console.error("Error fetching barbers:", error);
      toast.error("حدث خطأ في تحميل الحلاقين");
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await axios.get("http://localhost:8090/api/appointments");
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const getBarberStats = (barberId) => {
    const barberAppointments = appointments.filter(apt => apt.barber?._id === barberId);
    const totalAppointments = barberAppointments.length;
    const completedAppointments = barberAppointments.filter(apt => apt.status === 'completed').length;
    const totalEarnings = barberAppointments
      .filter(apt => apt.status === 'completed')
      .reduce((sum, apt) => sum + apt.totalPrice, 0);
    
    const today = new Date();
    const todayAppointments = barberAppointments.filter(apt => {
      const aptDate = new Date(apt.date);
      return aptDate.toDateString() === today.toDateString();
    }).length;

    return {
      totalAppointments,
      completedAppointments,
      totalEarnings,
      todayAppointments,
      rating: 4.8 // Mock rating
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBarber) {
        // For editing, we would need an update endpoint
        toast.info("تعديل الحلاق غير متاح حالياً");
      } else {
        await axios.post("http://localhost:8090/api/barbers", {
          ...formData,
          role: 'barber'
        });
        toast.success("تم إضافة الحلاق بنجاح");
        fetchBarbers();
        resetForm();
      }
    } catch (error) {
      console.error("Error saving barber:", error);
      toast.error("حدث خطأ في حفظ بيانات الحلاق");
    }
  };

  const handleEdit = (barber) => {
    setEditingBarber(barber);
    setFormData({
      firstName: barber.firstName,
      lastName: barber.lastName,
      email: barber.email,
      phone: barber.phone,
      password: "",
      avatar: barber.avatar || "",
      isActive: barber.isActive,
    });
    setShowModal(true);
  };

  const viewBarberDetails = (barber) => {
    setSelectedBarber(barber);
    setShowDetailsModal(true);
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      avatar: "",
      isActive: true,
    });
    setEditingBarber(null);
    setShowModal(false);
  };

  const filteredBarbers = barbers.filter((barber) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      barber.firstName?.toLowerCase().includes(searchLower) ||
      barber.lastName?.toLowerCase().includes(searchLower) ||
      barber.email?.toLowerCase().includes(searchLower) ||
      barber.phone?.includes(searchTerm)
    );
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
            <h1 className="text-3xl font-bold text-white mb-2">إدارة الحلاقين</h1>
            <p className="text-gray-400">إضافة ومتابعة فريق الحلاقين</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center"
          >
            <Plus className="w-5 h-5 ml-2" />
            إضافة حلاق جديد
          </button>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-dark-800/50 rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">إجمالي الحلاقين</p>
                <p className="text-white text-2xl font-bold">{barbers.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-dark-800/50 rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">حلاقين نشطين</p>
                <p className="text-white text-2xl font-bold">
                  {barbers.filter(b => b.isActive).length}
                </p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-dark-800/50 rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">مواعيد اليوم</p>
                <p className="text-white text-2xl font-bold">
                  {appointments.filter(apt => {
                    const today = new Date();
                    const aptDate = new Date(apt.date);
                    return aptDate.toDateString() === today.toDateString();
                  }).length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-primary-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-dark-800/50 rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">متوسط التقييم</p>
                <p className="text-white text-2xl font-bold">4.8</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </motion.div>
        </div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-dark-800/50 rounded-lg p-6 mb-8"
        >
          <div className="relative max-w-md">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="البحث في الحلاقين..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-12 pl-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
            />
          </div>
        </motion.div>

        {/* Barbers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBarbers.map((barber, index) => {
            const stats = getBarberStats(barber._id);
            return (
              <motion.div
                key={barber._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-dark-800/50 rounded-lg p-6 border border-dark-600 hover:border-primary-500/50 transition-all"
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
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg">
                      {barber.firstName} {barber.lastName}
                    </h3>
                    <p className="text-gray-400 text-sm">حلاق محترف</p>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(stats.rating)
                              ? "text-yellow-500 fill-current"
                              : "text-gray-600"
                          }`}
                        />
                      ))}
                      <span className="text-gray-400 text-sm mr-2">{stats.rating}</span>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      barber.isActive
                        ? "bg-green-400/10 text-green-400"
                        : "bg-red-400/10 text-red-400"
                    }`}
                  >
                    {barber.isActive ? "نشط" : "معطل"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-white font-semibold">{stats.totalAppointments}</p>
                    <p className="text-gray-400 text-xs">إجمالي المواعيد</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white font-semibold">{stats.todayAppointments}</p>
                    <p className="text-gray-400 text-xs">مواعيد اليوم</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 ml-1" />
                    {barber.phone}
                  </div>
                  <div className="text-primary-500 font-semibold">
                    {stats.totalEarnings} ريال
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <button
                    onClick={() => viewBarberDetails(barber)}
                    className="text-blue-400 hover:text-blue-300 p-2 rounded-lg hover:bg-blue-400/10 transition-all"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(barber)}
                    className="text-yellow-400 hover:text-yellow-300 p-2 rounded-lg hover:bg-yellow-400/10 transition-all"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredBarbers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-dark-800/50 rounded-lg p-8 text-center"
          >
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-white font-semibold text-lg mb-2">
              لا يوجد حلاقين
            </h3>
            <p className="text-gray-400">لا يوجد حلاقين يطابقون معايير البحث</p>
          </motion.div>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-dark-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                {editingBarber ? "تعديل الحلاق" : "إضافة حلاق جديد"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">
                      الاسم الأول *
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      required
                      className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">
                      الاسم الأخير *
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      required
                      className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    البريد الإلكتروني *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    رقم الجوال *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  />
                </div>

                {!editingBarber && (
                  <div>
                    <label className="block text-white font-medium mb-2">
                      كلمة المرور *
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      required={!editingBarber}
                      minLength={6}
                      className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-white font-medium mb-2">
                    رابط الصورة الشخصية
                  </label>
                  <input
                    type="url"
                    value={formData.avatar}
                    onChange={(e) =>
                      setFormData({ ...formData, avatar: e.target.value })
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
                    حلاق نشط
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
                    {editingBarber ? "تحديث" : "إضافة"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Barber Details Modal */}
        {showDetailsModal && selectedBarber && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-dark-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  تفاصيل الحلاق
                </h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Barber Info */}
                <div className="lg:col-span-1">
                  <div className="bg-dark-700/50 rounded-lg p-6">
                    <div className="text-center mb-6">
                      <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        {selectedBarber.avatar ? (
                          <img
                            src={selectedBarber.avatar}
                            alt={selectedBarber.firstName}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-white text-2xl font-bold">
                            {selectedBarber.firstName?.charAt(0)}
                          </span>
                        )}
                      </div>
                      <h3 className="text-white font-semibold text-xl">
                        {selectedBarber.firstName} {selectedBarber.lastName}
                      </h3>
                      <p className="text-gray-400">حلاق محترف</p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center text-gray-300">
                        <Mail className="w-5 h-5 ml-3" />
                        {selectedBarber.email}
                      </div>
                      <div className="flex items-center text-gray-300">
                        <Phone className="w-5 h-5 ml-3" />
                        {selectedBarber.phone}
                      </div>
                    </div>

                    {(() => {
                      const stats = getBarberStats(selectedBarber._id);
                      return (
                        <div className="mt-6 pt-6 border-t border-dark-600">
                          <h4 className="text-white font-semibold mb-4">إحصائيات</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-400">إجمالي المواعيد</span>
                              <span className="text-white">{stats.totalAppointments}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">المواعيد المكتملة</span>
                              <span className="text-white">{stats.completedAppointments}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">إجمالي الأرباح</span>
                              <span className="text-primary-500 font-semibold">{stats.totalEarnings} ريال</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">التقييم</span>
                              <div className="flex items-center">
                                <Star className="w-4 h-4 text-yellow-500 fill-current ml-1" />
                                <span className="text-white">{stats.rating}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Recent Appointments */}
                <div className="lg:col-span-2">
                  <div className="bg-dark-700/50 rounded-lg p-6">
                    <h4 className="text-white font-semibold text-lg mb-4">
                      المواعيد الأخيرة
                    </h4>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {appointments
                        .filter(apt => apt.barber?._id === selectedBarber._id)
                        .slice(0, 10)
                        .map((appointment) => (
                          <div
                            key={appointment._id}
                            className="bg-dark-800/50 rounded-lg p-4"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h5 className="text-white font-medium">
                                  {appointment.service?.nameAr}
                                </h5>
                                <p className="text-gray-400 text-sm">
                                  {appointment.customer?.firstName} {appointment.customer?.lastName}
                                </p>
                              </div>
                              <span className="text-primary-500 font-semibold">
                                {appointment.totalPrice} ريال
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-400">
                                {format(new Date(appointment.date), 'dd/MM/yyyy', { locale: ar })} - {appointment.time}
                              </span>
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  appointment.status === 'completed'
                                    ? 'bg-green-400/10 text-green-400'
                                    : appointment.status === 'cancelled'
                                    ? 'bg-red-400/10 text-red-400'
                                    : 'bg-yellow-400/10 text-yellow-400'
                                }`}
                              >
                                {appointment.status === 'completed' ? 'مكتمل' :
                                 appointment.status === 'cancelled' ? 'ملغي' : 'معلق'}
                              </span>
                            </div>
                          </div>
                        ))}
                      
                      {appointments.filter(apt => apt.barber?._id === selectedBarber._id).length === 0 && (
                        <div className="text-center py-8">
                          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-400">لا توجد مواعيد</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardBarbers;