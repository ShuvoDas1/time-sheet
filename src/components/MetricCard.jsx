const MetricCard = ({ title, value }) => {
  return (
    <div className="rounded-lg border shadow-md p-6 bg-white text-center">
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      <p className="text-2xl font-bold text-blue-600 mt-2">{value}</p>
    </div>
  );
};

export default MetricCard;
