import moment from "moment";

const CustomTooltip = ({ active, payload, label, type }) => {
  if (active && payload && payload.length) {
    const { hours, tooltipDate } = payload[0].payload;
    return (
      <div className="p-2 bg-white border rounded shadow">
        <p className="text-gray-700 font-semibold">{tooltipDate}</p>
        <p className="text-gray-500">{`Hours Worked: ${hours}`}</p>
      </div>
    );
  }
  return null;
};

export default CustomTooltip;
