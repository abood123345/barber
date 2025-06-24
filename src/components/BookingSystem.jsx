import { useState } from 'react';
import ServiceSelection from './ServiceSelection';
import PeopleCount from './PeopleCount';
import DateSelection from './DateSelection';
import RepeatOptions from './RepeatOptions';
import BookingSummary from './BookingSummary';
import UserInformation from './UserInformation';
import PaymentConfirmation from './PaymentConfirmation';
import FinalConfirmation from './FinalConfirmation';

const BookingSystem = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    service: null,
    peopleCount: 1,
    selectedDate: null,
    selectedTime: null,
    wantRepeat: false,
    repeatInterval: 1,
    repeatUnit: 'يوم',
    repeatCount: 1,
    appointments: [],
    userInfo: {
      firstName: '',
      lastName: '',
      mobile: '',
      email: ''
    }
  });

  const updateBookingData = (data) => {
    setBookingData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const goToStep = (step) => {
    setCurrentStep(step);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ServiceSelection onContinue={nextStep} updateData={updateBookingData} data={bookingData} />;
      case 2:
        return <PeopleCount onContinue={nextStep} updateData={updateBookingData} data={bookingData} />;
      case 3:
        return <DateSelection onContinue={nextStep} updateData={updateBookingData} data={bookingData} />;
      case 4:
        return <RepeatOptions onContinue={nextStep} updateData={updateBookingData} data={bookingData} />;
      case 5:
        return <BookingSummary onContinue={nextStep} updateData={updateBookingData} data={bookingData} />;
      case 6:
        return <UserInformation onContinue={nextStep} updateData={updateBookingData} data={bookingData} />;
      case 7:
        return <PaymentConfirmation onContinue={nextStep} updateData={updateBookingData} data={bookingData} />;
      case 8:
        return <FinalConfirmation data={bookingData} onRestart={() => { setCurrentStep(1); setBookingData({ service: null, peopleCount: 1, selectedDate: null, selectedTime: null, wantRepeat: false, repeatInterval: 1, repeatUnit: 'يوم', repeatCount: 1, appointments: [], userInfo: { firstName: '', lastName: '', mobile: '', email: '' } }); }} />;
      default:
        return <ServiceSelection onContinue={nextStep} updateData={updateBookingData} data={bookingData} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {renderStep()}
      </div>
    </div>
  );
};

export default BookingSystem;