const PeopleCount = ({ onContinue, updateData, data }) => {
  const handlePeopleCountChange = (count) => {
    if (count >= 1) {
      updateData({ peopleCount: count });
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-2xl">
      <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">عدد الأشخاص</h2>
      
      <div className="mb-6">
        <label className="block text-gray-700 mb-3 font-medium">كم شخص سيأتي معك؟</label>
        <div className="flex items-center justify-center space-x-4 space-x-reverse">
          <button
            onClick={() => handlePeopleCountChange(data.peopleCount - 1)}
            className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-xl font-bold"
            disabled={data.peopleCount <= 1}
          >
            -
          </button>
          <span className="text-2xl font-bold px-4">{data.peopleCount}</span>
          <button
            onClick={() => handlePeopleCountChange(data.peopleCount + 1)}
            className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-xl font-bold"
          >
            +
          </button>
        </div>
      </div>

      <button
        onClick={onContinue}
        className="w-full py-3 rounded-lg font-medium bg-gray-800 text-white hover:bg-gray-700 transition-all"
      >
        استمر
      </button>
    </div>
  );
};

export default PeopleCount;