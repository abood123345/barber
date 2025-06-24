import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Calendar,
  Clock,
  Star,
  Edit,
  Phone,
  Mail,
  ImportIcon,
} from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { Link } from "react-router-dom";
const Profile = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("appointments");
  const { user } = useAuth();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8090/api/appointments"
      );
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "text-green-400 bg-green-400/10";
      case "pending":
        return "text-yellow-400 bg-yellow-400/10";
      case "completed":
        return "text-blue-400 bg-blue-400/10";
      case "cancelled":
        return "text-red-400 bg-red-400/10";
      default:
        return "text-gray-400 bg-gray-400/10";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "confirmed":
        return "مؤكد";
      case "pending":
        return "في الانتظار";
      case "completed":
        return "مكتمل";
      case "cancelled":
        return "ملغي";
      default:
        return status;
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-dark-800/50 rounded-2xl p-8 mb-8"
        >
          <div className="flex items-center space-x-6 space-x-reverse">
            <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.firstName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-white text-2xl font-bold">
                  {user?.firstName?.charAt(0)}
                </span>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">
                {user?.firstName} {user?.lastName}
              </h1>
              <div className="flex items-center space-x-4 space-x-reverse text-gray-400">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 ml-1" />
                  {user?.email}
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 ml-1" />
                  {user?.phone}
                </div>
              </div>
            </div>
            <button className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center">
              <Edit className="w-4 h-4 ml-2" />
              تعديل الملف
            </button>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex space-x-4 space-x-reverse mb-8">
          <button
            onClick={() => setActiveTab("appointments")}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === "appointments"
                ? "bg-primary-500 text-white"
                : "bg-dark-700 text-gray-300 hover:bg-dark-600"
            }`}
          >
            <Calendar className="w-4 h-4 inline ml-2" />
            مواعيدي
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === "history"
                ? "bg-primary-500 text-white"
                : "bg-dark-700 text-gray-300 hover:bg-dark-600"
            }`}
          >
            <Clock className="w-4 h-4 inline ml-2" />
            السجل
          </button>
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {activeTab === "appointments" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">
                المواعيد القادمة
              </h2>

              {appointments.filter(
                (apt) =>
                  apt.status !== "completed" && apt.status !== "cancelled"
              ).length === 0 ? (
                <div className="bg-dark-800/50 rounded-lg p-8 text-center">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-white font-semibold text-lg mb-2">
                    لا توجد مواعيد قادمة
                  </h3>
                  <p className="text-gray-400 mb-6">
                    احجز موعدك الآن واستمتع بخدماتنا المميزة
                  </p>
                  <Link
                    to="/booking"
                    className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-all inline-block"
                  >
                    احجز موعد جديد
                  </Link>
                </div>
              ) : (
                <div className="grid gap-6">
                  {appointments
                    .filter(
                      (apt) =>
                        apt.status !== "completed" && apt.status !== "cancelled"
                    )
                    .map((appointment) => (
                      <div
                        key={appointment._id}
                        className="bg-dark-800/50 rounded-lg p-6"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4 space-x-reverse">
                            <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center">
                              <Calendar className="w-6 h-6 text-primary-500" />
                            </div>
                            <div>
                              <h3 className="text-white font-semibold text-lg">
                                {appointment.service?.nameAr}
                              </h3>
                              <p className="text-gray-400">
                                مع {appointment.barber?.firstName}{" "}
                                {appointment.barber?.lastName}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                              appointment.status
                            )}`}
                          >
                            {getStatusText(appointment.status)}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center text-gray-400">
                            <Calendar className="w-4 h-4 ml-2" />
                            {format(
                              new Date(appointment.date),
                              "EEEE، d MMMM yyyy",
                              { locale: ar }
                            )}
                          </div>
                          <div className="flex items-center text-gray-400">
                            <Clock className="w-4 h-4 ml-2" />
                            {appointment.time}
                          </div>
                          <div className="flex items-center text-primary-500 font-semibold">
                            {appointment.totalPrice} ريال
                          </div>
                        </div>

                        {appointment.notes && (
                          <div className="mt-4 p-3 bg-dark-700/50 rounded-lg">
                            <p className="text-gray-300 text-sm">
                              {appointment.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "history" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">
                سجل المواعيد
              </h2>

              {appointments.filter((apt) => apt.status === "completed")
                .length === 0 ? (
                <div className="bg-dark-800/50 rounded-lg p-8 text-center">
                  <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-white font-semibold text-lg mb-2">
                    لا يوجد سجل مواعيد
                  </h3>
                  <p className="text-gray-400">ستظهر هنا المواعيد المكتملة</p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {appointments
                    .filter((apt) => apt.status === "completed")
                    .map((appointment) => (
                      <div
                        key={appointment._id}
                        className="bg-dark-800/50 rounded-lg p-6"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4 space-x-reverse">
                            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                              <Star className="w-6 h-6 text-green-500" />
                            </div>
                            <div>
                              <h3 className="text-white font-semibold text-lg">
                                {appointment.service?.nameAr}
                              </h3>
                              <p className="text-gray-400">
                                مع {appointment.barber?.firstName}{" "}
                                {appointment.barber?.lastName}
                              </p>
                            </div>
                          </div>
                          <div className="text-left">
                            <div className="text-primary-500 font-semibold">
                              {appointment.totalPrice} ريال
                            </div>
                            {appointment.rating && (
                              <div className="flex items-center mt-1">
                                {[...Array(appointment.rating)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className="w-4 h-4 text-yellow-500 fill-current"
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 ml-2" />
                            {format(
                              new Date(appointment.date),
                              "EEEE، d MMMM yyyy",
                              { locale: ar }
                            )}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 ml-2" />
                            {appointment.time}
                          </div>
                        </div>

                        {appointment.review && (
                          <div className="mt-4 p-3 bg-dark-700/50 rounded-lg">
                            <p className="text-gray-300 text-sm">
                              {appointment.review}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
