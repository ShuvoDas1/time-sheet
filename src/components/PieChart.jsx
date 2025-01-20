import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useDashbaord } from "@/context/DashboardContext";

const COLORS = ["#55c97c", "#b666d1", "#ed1372"];

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
                  fill={
                    entry?.type === "working"
                      ? COLORS[0]
                      : entry?.type === "vacation"
                      ? COLORS[1]
                      : COLORS[2]
                  }
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
