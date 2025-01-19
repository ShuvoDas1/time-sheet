import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import CustomTooltip from "./CustomTooltip";
import { useDashbaord } from "@/context/DashboardContext";

const COLORS = ["#3b82f6", "#f59e0b", "#ef4444"];

const PieChartComponent = ({ data }) => {
  const {
    filters: { type },
  } = useDashbaord();
  return (
    <div className="p-6 bg-white rounded-lg shadow-md border w-full   mt-2">
      <h3 className="text-lg font-semibold text-left border-b-2  text-gray-700 mb-4">
        Work Status Breakdown
      </h3>
      {data?.length < 1 ? (
        <div>
          <h4>No Data Found!!</h4>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="totalDay"
              nameKey="type"
              cx="50%"
              cy="50%"
              outerRadius={150}
              fill="#8884d8"
              label
            >
              {data?.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
            // content={<CustomTooltip type={type} />}
            // cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default PieChartComponent;
