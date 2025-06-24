import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-dark-900 border-t border-primary-500/20 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 space-x-reverse">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <span className="text-white font-bold text-xl gradient-text">
                BarberShop
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              أفضل صالون حلاقة في المدينة. نقدم خدمات عالية الجودة بأيدي خبراء محترفين.
            </p>
            <div className="flex space-x-4 space-x-reverse">
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">روابط سريعة</h3>
            <div className="space-y-2">
              <Link to="/" className="block text-gray-400 hover:text-white transition-colors text-sm">
                {t('home')}
              </Link>
              <Link to="/services" className="block text-gray-400 hover:text-white transition-colors text-sm">
                {t('services')}
              </Link>
              <Link to="/booking" className="block text-gray-400 hover:text-white transition-colors text-sm">
                {t('booking')}
              </Link>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">خدماتنا</h3>
            <div className="space-y-2">
              <p className="text-gray-400 text-sm">قص الشعر</p>
              <p className="text-gray-400 text-sm">تهذيب اللحية</p>
              <p className="text-gray-400 text-sm">تصفيف الشعر</p>
              <p className="text-gray-400 text-sm">علاجات الشعر</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">معلومات التواصل</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 space-x-reverse">
                <Phone className="w-4 h-4 text-primary-500" />
                <span className="text-gray-400 text-sm">+966 50 123 4567</span>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse">
                <Mail className="w-4 h-4 text-primary-500" />
                <span className="text-gray-400 text-sm">info@barbershop.com</span>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse">
                <MapPin className="w-4 h-4 text-primary-500" />
                <span className="text-gray-400 text-sm">الرياض، المملكة العربية السعودية</span>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse">
                <Clock className="w-4 h-4 text-primary-500" />
                <span className="text-gray-400 text-sm">9:00 ص - 11:00 م</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-dark-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 BarberShop. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;