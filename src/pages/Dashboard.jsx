import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  Star,
  BarChart3,
  PieChart,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
} from "recharts";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8090/api/analytics/dashboard"
      );
      setAnalytics(response.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const stats = [
    {
      title: "إجمالي العملاء",
      value: analytics?.totalCustomers || 0,
      icon: <Users className="w-8 h-8" />,
      color: "bg-blue-500",
      change: "+12%",
    },
    {
      title: "مواعيد اليوم",
      value: analytics?.todayAppointments || 0,
      icon: <Calendar className="w-8 h-8" />,
      color: "bg-green-500",
      change: "+8%",
    },
    {
      title: "الإيرادات الشهرية",
      value: `${analytics?.monthlyRevenue || 0} ريال`,
      icon: <DollarSign className="w-8 h-8" />,
      color: "bg-primary-500",
      change: "+15%",
    },
    {
      title: "إجمالي المواعيد",
      value: analytics?.totalAppointments || 0,
      icon: <TrendingUp className="w-8 h-8" />,
      color: "bg-purple-500",
      change: "+5%",
    },
  ];

  // Mock data for charts
  const monthlyData = [
    { month: "يناير", appointments: 45, revenue: 2250 },
    { month: "فبراير", appointments: 52, revenue: 2600 },
    { month: "مارس", appointments: 48, revenue: 2400 },
    { month: "أبريل", appointments: 61, revenue: 3050 },
    { month: "مايو", appointments: 55, revenue: 2750 },
    { month: "يونيو", appointments: 67, revenue: 3350 },
  ];

  const serviceData =
    analytics?.popularServices?.map((service, index) => ({
      name: service.service.nameAr,
      value: service.count,
      color: ["#f59332", "#e35d05", "#bc4508", "#95370e", "#782f0f"][index],
    })) || [];

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
          <h1 className="text-3xl font-bold text-white mb-2">لوحة التحكم</h1>
          <p className="text-gray-400">
            مرحباً {user?.firstName}، إليك نظرة عامة على أداء الصالون
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-dark-800/50 rounded-lg p-6 border border-primary-500/20"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-white`}
                >
                  {stat.icon}
                </div>
                <span className="text-green-400 text-sm font-medium">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-gray-400 text-sm mb-1">{stat.title}</h3>
              <p className="text-white text-2xl font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Performance */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-dark-800/50 rounded-lg p-6 border border-primary-500/20"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-semibold text-lg">
                الأداء الشهري
              </h3>
              <BarChart3 className="w-5 h-5 text-primary-500" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #F59332",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey="appointments"
                  fill="#F59332"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Popular Services */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-dark-800/50 rounded-lg p-6 border border-primary-500/20"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-semibold text-lg">
                الخدمات الأكثر طلباً
              </h3>
              <PieChart className="w-5 h-5 text-primary-500" />
            </div>
            {serviceData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={serviceData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {serviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-400">
                لا توجد بيانات متاحة
              </div>
            )}
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-dark-800/50 rounded-lg p-6 border border-primary-500/20"
        >
          <h3 className="text-white font-semibold text-lg mb-6">
            إجراءات سريعة
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/dashboard/appointments"
              className="bg-primary-500 hover:bg-primary-600 text-white p-4 rounded-lg transition-all text-center group"
            >
              <Calendar className="w-8 h-8 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="font-medium">إدارة المواعيد</h4>
              <p className="text-sm opacity-90">عرض وإدارة جميع المواعيد</p>
            </Link>

            <Link
              to="/dashboard/customers"
              className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg transition-all text-center group"
            >
              <Users className="w-8 h-8 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="font-medium">إدارة العملاء</h4>
              <p className="text-sm opacity-90">عرض معلومات العملاء</p>
            </Link>

            <Link
              to="/dashboard/services"
              className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg transition-all text-center group"
            >
              <Star className="w-8 h-8 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="font-medium">إدارة الخدمات</h4>
              <p className="text-sm opacity-90">إضافة وتعديل الخدمات</p>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
