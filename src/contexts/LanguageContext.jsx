import { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  ar: {
    // Navigation
    home: 'الرئيسية',
    services: 'الخدمات',
    booking: 'حجز موعد',
    login: 'تسجيل الدخول',
    register: 'إنشاء حساب',
    profile: 'الملف الشخصي',
    dashboard: 'لوحة التحكم',
    logout: 'تسجيل الخروج',
    
    // Common
    continue: 'استمر',
    cancel: 'إلغاء',
    save: 'حفظ',
    edit: 'تعديل',
    delete: 'حذف',
    confirm: 'تأكيد',
    loading: 'جاري التحميل...',
    
    // Home
    heroTitle: 'أفضل صالون حلاقة في المدينة',
    heroSubtitle: 'احجز موعدك الآن واستمتع بأفضل خدمات الحلاقة والعناية',
    bookNow: 'احجز الآن',
    
    // Services
    servicesTitle: 'خدماتنا',
    haircut: 'قص الشعر',
    beard: 'تهذيب اللحية',
    styling: 'تصفيف الشعر',
    treatment: 'علاجات الشعر',
    package: 'باقات خاصة',
    
    // Booking
    selectService: 'اختيار الخدمة',
    selectBarber: 'اختيار الحلاق',
    selectDateTime: 'اختيار التاريخ والوقت',
    bookingConfirmation: 'تأكيد الحجز',
    
    // Dashboard
    appointments: 'المواعيد',
    customers: 'العملاء',
    barbers: 'الحلاقين',
    analytics: 'التحليلات',
    totalRevenue: 'إجمالي الإيرادات',
    todayAppointments: 'مواعيد اليوم',
    totalCustomers: 'إجمالي العملاء',
    timeManagement: 'إدارة الأوقات',
  },
  en: {
    // Navigation
    home: 'Home',
    services: 'Services',
    booking: 'Book Appointment',
    login: 'Login',
    register: 'Register',
    profile: 'Profile',
    dashboard: 'Dashboard',
    logout: 'Logout',
    
    // Common
    continue: 'Continue',
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    confirm: 'Confirm',
    loading: 'Loading...',
    
    // Home
    heroTitle: 'Best Barber Shop in Town',
    heroSubtitle: 'Book your appointment now and enjoy the best haircut and grooming services',
    bookNow: 'Book Now',
    
    // Services
    servicesTitle: 'Our Services',
    haircut: 'Haircut',
    beard: 'Beard Trim',
    styling: 'Hair Styling',
    treatment: 'Hair Treatment',
    package: 'Special Packages',
    
    // Booking
    selectService: 'Select Service',
    selectBarber: 'Select Barber',
    selectDateTime: 'Select Date & Time',
    bookingConfirmation: 'Booking Confirmation',
    
    // Dashboard
    appointments: 'Appointments',
    customers: 'Customers',
    barbers: 'Barbers',
    analytics: 'Analytics',
    totalRevenue: 'Total Revenue',
    todayAppointments: 'Today\'s Appointments',
    totalCustomers: 'Total Customers',
    timeManagement: 'Time Management',
  },
  he: {
    // Navigation
    home: 'בית',
    services: 'שירותים',
    booking: 'קביעת תור',
    login: 'התחברות',
    register: 'הרשמה',
    profile: 'פרופיל',
    dashboard: 'לוח בקרה',
    logout: 'התנתקות',
    
    // Common
    continue: 'המשך',
    cancel: 'ביטול',
    save: 'שמירה',
    edit: 'עריכה',
    delete: 'מחיקה',
    confirm: 'אישור',
    loading: 'טוען...',
    
    // Home
    heroTitle: 'מספרה הטובה ביותר בעיר',
    heroSubtitle: 'קבע תור עכשיו ותיהנה משירותי התספורת והטיפוח הטובים ביותר',
    bookNow: 'קבע תור',
    
    // Services
    servicesTitle: 'השירותים שלנו',
    haircut: 'תספורת',
    beard: 'עיצוב זקן',
    styling: 'עיצוב שיער',
    treatment: 'טיפולי שיער',
    package: 'חבילות מיוחדות',
    
    // Booking
    selectService: 'בחירת שירות',
    selectBarber: 'בחירת ספר',
    selectDateTime: 'בחירת תאריך ושעה',
    bookingConfirmation: 'אישור הזמנה',
    
    // Dashboard
    appointments: 'תורים',
    customers: 'לקוחות',
    barbers: 'ספרים',
    analytics: 'אנליטיקה',
    totalRevenue: 'סך הכנסות',
    todayAppointments: 'תורי היום',
    totalCustomers: 'סך לקוחות',
    timeManagement: 'ניהול זמנים',
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('ar');
  const [direction, setDirection] = useState('rtl');

  const changeLanguage = (lang) => {
    setLanguage(lang);
    setDirection(lang === 'ar' || lang === 'he' ? 'rtl' : 'ltr');
    document.documentElement.dir = lang === 'ar' || lang === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  const value = {
    language,
    direction,
    changeLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      <div className={direction}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};