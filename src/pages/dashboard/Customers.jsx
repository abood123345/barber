import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  Filter,
  Phone,
  Mail,
  Calendar,
  Eye,
  MoreVertical,
} from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import axios from "axios";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";

const DashboardCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCustomers();
    fetchAppointments();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get("http://localhost:8090/api/customers");
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast.error("حدث خطأ في تحميل العملاء");
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

  const getCustomerAppointments = (customerId) => {
    return appointments.filter(apt => apt.customer?._id === customerId);
  };

  const getCustomerStats = (customerId) => {
    const customerAppointments = getCustomerAppointments(customerId);
    const totalAppointments = customerAppointments.length;
    const completedAppointments = customerAppointments.filter(apt => apt.status === 'completed').length;
    const totalSpent = customerAppointments
      .filter(apt => apt.status === 'completed')
      .reduce((sum, apt) => sum + apt.totalPrice, 0);
    
    return {
      totalAppointments,
      completedAppointments,
      totalSpent,
      lastVisit: customerAppointments.length > 0 
        ? new Date(Math.max(...customerAppointments.map(apt => new Date(apt.date))))
        : null
    };
  };

  const viewCustomerDetails = (customer) => {
    setSelectedCustomer(customer);
    setShowModal(true);
  };

  const filteredCustomers = customers.filter((customer) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      customer.firstName?.toLowerCase().includes(searchLower) ||
      customer.lastName?.toLowerCase().includes(searchLower) ||
      customer.email?.toLowerCase().includes(searchLower) ||
      customer.phone?.includes(searchTerm)
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
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">إدارة العملاء</h1>
          <p className="text-gray-400">عرض ومتابعة معلومات العملاء</p>
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
                <p className="text-gray-400 text-sm">إجمالي العملاء</p>
                <p className="text-white text-2xl font-bold">{customers.length}</p>
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
                <p className="text-gray-400 text-sm">عملاء نشطين</p>
                <p className="text-white text-2xl font-bold">
                  {customers.filter(c => c.isActive).length}
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
                <p className="text-gray-400 text-sm">عملاء جدد هذا الشهر</p>
                <p className="text-white text-2xl font-bold">
                  {customers.filter(c => {
                    const createdDate = new Date(c.createdAt);
                    const now = new Date();
                    return createdDate.getMonth() === now.getMonth() && 
                           createdDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
              <Users className="w-8 h-8 text-primary-500" />
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
                <p className="text-gray-400 text-sm">متوسط الزيارات</p>
                <p className="text-white text-2xl font-bold">
                  {customers.length > 0 
                    ? (appointments.length / customers.length).toFixed(1)
                    : 0
                  }
                </p>
              </div>
              <Calendar className="w-8 h-8 text-purple-500" />
            </div>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-dark-800/50 rounded-lg p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="البحث في العملاء..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-12 pl-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>
        </motion.div>

        {/* Customers Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-dark-800/50 rounded-lg overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-700">
                <tr>
                  <th className="px-6 py-4 text-right text-white font-semibold">العميل</th>
                  <th className="px-6 py-4 text-right text-white font-semibold">معلومات التواصل</th>
                  <th className="px-6 py-4 text-right text-white font-semibold">إحصائيات</th>
                  <th className="px-6 py-4 text-right text-white font-semibold">آخر زيارة</th>
                  <th className="px-6 py-4 text-right text-white font-semibold">الحالة</th>
                  <th className="px-6 py-4 text-right text-white font-semibold">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-600">
                {filteredCustomers.map((customer, index) => {
                  const stats = getCustomerStats(customer._id);
                  return (
                    <motion.tr
                      key={customer._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-dark-700/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium">
                              {customer.firstName?.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="text-white font-medium">
                              {customer.firstName} {customer.lastName}
                            </p>
                            <p className="text-gray-400 text-sm">
                              انضم في {format(new Date(customer.createdAt), 'MMM yyyy', { locale: ar })}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center text-gray-300 text-sm">
                            <Mail className="w-4 h-4 ml-2" />
                            {customer.email}
                          </div>
                          <div className="flex items-center text-gray-300 text-sm">
                            <Phone className="w-4 h-4 ml-2" />
                            {customer.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1 text-sm">
                          <p className="text-white">
                            {stats.totalAppointments} موعد
                          </p>
                          <p className="text-gray-400">
                            {stats.totalSpent} ريال إجمالي
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-300 text-sm">
                          {stats.lastVisit 
                            ? format(stats.lastVisit, 'dd/MM/yyyy', { locale: ar })
                            : 'لا توجد زيارات'
                          }
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            customer.isActive
                              ? "bg-green-400/10 text-green-400"
                              : "bg-red-400/10 text-red-400"
                          }`}
                        >
                          {customer.isActive ? "نشط" : "معطل"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <button
                            onClick={() => viewCustomerDetails(customer)}
                            className="text-blue-400 hover:text-blue-300 p-2 rounded-lg hover:bg-blue-400/10 transition-all"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-gray-400 hover:text-gray-300 p-2 rounded-lg hover:bg-gray-400/10 transition-all">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredCustomers.length === 0 && (
            <div className="text-center py-8">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold text-lg mb-2">
                لا يوجد عملاء
              </h3>
              <p className="text-gray-400">لا يوجد عملاء يطابقون معايير البحث</p>
            </div>
          )}
        </motion.div>

        {/* Customer Details Modal */}
        {showModal && selectedCustomer && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-dark-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  تفاصيل العميل
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Customer Info */}
                <div className="lg:col-span-1">
                  <div className="bg-dark-700/50 rounded-lg p-6">
                    <div className="text-center mb-6">
                      <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-white text-2xl font-bold">
                          {selectedCustomer.firstName?.charAt(0)}
                        </span>
                      </div>
                      <h3 className="text-white font-semibold text-xl">
                        {selectedCustomer.firstName} {selectedCustomer.lastName}
                      </h3>
                      <p className="text-gray-400">
                        عضو منذ {format(new Date(selectedCustomer.createdAt), 'MMMM yyyy', { locale: ar })}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center text-gray-300">
                        <Mail className="w-5 h-5 ml-3" />
                        {selectedCustomer.email}
                      </div>
                      <div className="flex items-center text-gray-300">
                        <Phone className="w-5 h-5 ml-3" />
                        {selectedCustomer.phone}
                      </div>
                    </div>

                    {(() => {
                      const stats = getCustomerStats(selectedCustomer._id);
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
                              <span className="text-gray-400">إجمالي الإنفاق</span>
                              <span className="text-primary-500 font-semibold">{stats.totalSpent} ريال</span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Appointments History */}
                <div className="lg:col-span-2">
                  <div className="bg-dark-700/50 rounded-lg p-6">
                    <h4 className="text-white font-semibold text-lg mb-4">
                      سجل المواعيد
                    </h4>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {getCustomerAppointments(selectedCustomer._id).map((appointment) => (
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
                                مع {appointment.barber?.firstName} {appointment.barber?.lastName}
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
                      
                      {getCustomerAppointments(selectedCustomer._id).length === 0 && (
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

export default DashboardCustomers;