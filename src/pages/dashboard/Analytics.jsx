import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  DollarSign,
  Star,
  Clock,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Cell,
  Pie,
  AreaChart,
  Area,
} from "recharts";
import axios from "axios";
import LoadingSpinner from "../../components/LoadingSpinner";

const DashboardAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("month");

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

  // Mock data for charts
  const revenueData = [
    { month: "يناير", revenue: 15000, appointments: 45, customers: 38 },
    { month: "فبراير", revenue: 18000, appointments: 52, customers: 42 },
    { month: "مارس", revenue: 16500, appointments: 48, customers: 40 },
    { month: "أبريل", revenue: 22000, appointments: 61, customers: 48 },
    { month: "مايو", revenue: 19500, appointments: 55, customers: 45 },
    { month: "يونيو", revenue: 25000, appointments: 67, customers: 52 },
  ];

  const dailyData = [
    { day: "السبت", appointments: 12, revenue: 2400 },
    { day: "الأحد", appointments: 15, revenue: 3200 },
    { day: "الاثنين", appointments: 8, revenue: 1800 },
    { day: "الثلاثاء", appointments: 14, revenue: 2900 },
    { day: "الأربعاء", appointments: 16, revenue: 3400 },
    { day: "الخميس", appointments: 18, revenue: 3800 },
    { day: "الجمعة", appointments: 20, revenue: 4200 },
  ];

  const serviceData = analytics?.popularServices?.map((service, index) => ({
    name: service.service.nameAr,
    value: service.count,
    color: ["#f59332", "#e35d05", "#bc4508", "#95370e", "#782f0f"][index],
  })) || [
    { name: "قص الشعر", value: 45, color: "#f59332" },
    { name: "تهذيب اللحية", value: 30, color: "#e35d05" },
    { name: "تصفيف الشعر", value: 20, color: "#bc4508" },
    { name: "علاجات الشعر", value: 15, color: "#95370e" },
    { name: "باقات خاصة", value: 10, color: "#782f0f" },
  ];

  const hourlyData = [
    { hour: "9:00", appointments: 2 },
    { hour: "10:00", appointments: 4 },
    { hour: "11:00", appointments: 6 },
    { hour: "12:00", appointments: 8 },
    { hour: "13:00", appointments: 5 },
    { hour: "14:00", appointments: 7 },
    { hour: "15:00", appointments: 9 },
    { hour: "16:00", appointments: 12 },
    { hour: "17:00", appointments: 15 },
    { hour: "18:00", appointments: 18 },
    { hour: "19:00", appointments: 14 },
    { hour: "20:00", appointments: 10 },
    { hour: "21:00", appointments: 6 },
  ];

  const kpiData = [
    {
      title: "إجمالي الإيرادات",
      value: `${analytics?.monthlyRevenue || 25000} ريال`,
      change: "+15%",
      trend: "up",
      icon: <DollarSign className="w-8 h-8" />,
      color: "bg-green-500",
    },
    {
      title: "إجمالي المواعيد",
      value: analytics?.totalAppointments || 342,
      change: "+8%",
      trend: "up",
      icon: <Calendar className="w-8 h-8" />,
      color: "bg-blue-500",
    },
    {
      title: "العملاء النشطين",
      value: analytics?.totalCustomers || 156,
      change: "+12%",
      trend: "up",
      icon: <Users className="w-8 h-8" />,
      color: "bg-purple-500",
    },
    {
      title: "متوسط التقييم",
      value: "4.8",
      change: "+0.2",
      trend: "up",
      icon: <Star className="w-8 h-8" />,
      color: "bg-yellow-500",
    },
    {
      title: "معدل الإلغاء",
      value: "5.2%",
      change: "-2.1%",
      trend: "down",
      icon: <Activity className="w-8 h-8" />,
      color: "bg-red-500",
    },
    {
      title: "متوسط وقت الانتظار",
      value: "12 دقيقة",
      change: "-3 دقائق",
      trend: "down",
      icon: <Clock className="w-8 h-8" />,
      color: "bg-indigo-500",
    },
  ];

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
            <h1 className="text-3xl font-bold text-white mb-2">التحليلات والتقارير</h1>
            <p className="text-gray-400">نظرة شاملة على أداء الصالون</p>
          </div>
          <div className="flex items-center space-x-4 space-x-reverse">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
            >
              <option value="week">هذا الأسبوع</option>
              <option value="month">هذا الشهر</option>
              <option value="quarter">هذا الربع</option>
              <option value="year">هذا العام</option>
            </select>
          </div>
        </motion.div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {kpiData.map((kpi, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-dark-800/50 rounded-lg p-6 border border-primary-500/20"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${kpi.color} rounded-lg flex items-center justify-center text-white`}>
                  {kpi.icon}
                </div>
                <div className={`flex items-center text-sm font-medium ${
                  kpi.trend === 'up' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {kpi.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 ml-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 ml-1" />
                  )}
                  {kpi.change}
                </div>
              </div>
              <h3 className="text-gray-400 text-sm mb-1">{kpi.title}</h3>
              <p className="text-white text-2xl font-bold">{kpi.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-dark-800/50 rounded-lg p-6 border border-primary-500/20"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-semibold text-lg">الإيرادات الشهرية</h3>
              <BarChart3 className="w-5 h-5 text-primary-500" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
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
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#F59332"
                  fill="#F59332"
                  fillOpacity={0.3}
                />
              </AreaChart>
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
              <h3 className="text-white font-semibold text-lg">الخدمات الأكثر طلباً</h3>
              <PieChart className="w-5 h-5 text-primary-500" />
            </div>
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
          </motion.div>
        </div>

        {/* Additional Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Daily Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-dark-800/50 rounded-lg p-6 border border-primary-500/20"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-semibold text-lg">الأداء اليومي</h3>
              <Activity className="w-5 h-5 text-primary-500" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #F59332",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="appointments"
                  stroke="#F59332"
                  strokeWidth={3}
                  dot={{ fill: "#F59332", strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Hourly Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-dark-800/50 rounded-lg p-6 border border-primary-500/20"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-semibold text-lg">توزيع المواعيد حسب الساعة</h3>
              <Clock className="w-5 h-5 text-primary-500" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="hour" stroke="#9CA3AF" />
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
        </div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-dark-800/50 rounded-lg p-6 border border-primary-500/20"
        >
          <h3 className="text-white font-semibold text-lg mb-6">ملخص الأداء</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-500 mb-2">98%</div>
              <div className="text-gray-400 text-sm">معدل رضا العملاء</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">85%</div>
              <div className="text-gray-400 text-sm">معدل الحضور</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">23 دقيقة</div>
              <div className="text-gray-400 text-sm">متوسط مدة الخدمة</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">67%</div>
              <div className="text-gray-400 text-sm">معدل العملاء المتكررين</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardAnalytics;