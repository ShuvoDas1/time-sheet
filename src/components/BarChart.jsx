import { useDashbaord } from "@/context/DashboardContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import CustomTooltip from "./CustomTooltip";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

const BarChartComponent = ({ data = [] }) => {
  const {
    filters: { type },
    setFilters,
  } = useDashbaord();

  return (
    <div className="p-6 bg-white rounded-lg shadow-md border  flex-1 mt-5">
      <div className="flex justify-between items-center border-b mb-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Hours Worked per {`${type === "weekly" ? "Week" : "Day"}`}
        </h3>
        {/* Filters*/}
        {data?.length > 0 && (
          <Tabs
            value={type}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, type: value }))
            }
            className="space-x-4"
          >
            <TabsList>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="daily">Daily</TabsTrigger>
            </TabsList>
          </Tabs>
        )}
      </div>

      {data.length < 1 ? (
        <div>
          <h4>No Data Found!!</h4>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey={`${type === "weekly" ? "week" : "date"}`} />
            <YAxis />
            <Tooltip
              content={<CustomTooltip type={type} />}
              cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
            />
            <Bar dataKey="hours" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default BarChartComponent;
