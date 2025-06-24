const ServiceSelection = ({ onContinue, updateData, data }) => {
  const services = [
    { id: 1, name: "خدمة خاصة", price: 50.0 },
    { id: 2, name: "خدمة Vip", price: 100.0 },
  ];

  const handleServiceSelect = (service) => {
    updateData({ service });
  };

  const handleContinue = () => {
    if (data.service) {
      onContinue();
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-2xl">
      <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
        اختيار الخدمة
      </h2>

      <div className="mb-6">
        <label className="block text-gray-700 mb-3 font-medium">الخدمات:</label>
        <div className="space-y-3">
          {services?.map((service) => (
            <div
              key={service.id}
              className={`flex justify-between items-center p-3 border rounded-lg cursor-pointer transition-all ${
                data.service?.id === service.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onClick={() => handleServiceSelect(service)}
            >
              <span className="font-medium">{service.name}</span>
              <span className="text-gray-600">₹{service.price.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleContinue}
        disabled={!data.service}
        className={`w-full py-3 rounded-lg font-medium transition-all ${
          data.service
            ? "bg-gray-800 text-white hover:bg-gray-700"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        استمر
      </button>
    </div>
  );
};

export default ServiceSelection;
