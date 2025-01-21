import moment from "moment";

const CustomTooltip = ({ active, payload, label, type }) => {
  if (active && payload && payload.length) {
    const { hours, tooltip } = payload[0].payload;
    return (
      <div className="p-2 bg-white border rounded shadow">
        <p className="text-gray-700 font-semibold">{tooltip?.date || ""}</p>
        <p className="text-gray-700 font-semibold">{tooltip?.status || ""}</p>
        <span className="text-gray-500">
          {hours ? `Worked Hours: ${hours}` : ""}
        </span>
      </div>
    );
  }
  return null;
};

export default CustomTooltip;
