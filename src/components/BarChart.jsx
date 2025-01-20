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
import { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeProvider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Select } from "./ui/select";

const BarChartComponent = ({ data = [] }) => {
  const {
    filters: { type },
    setFilters,
  } = useDashbaord();

  const { value: theme } = useTheme();

  const [barSize, setBarSize] = useState(50);

  // Adjust barSize based on screen width
  const updateBarSize = () => {
    const width = window.innerWidth;
    if (width <= 480) {
      setBarSize(20);
    } else if (width <= 768) {
      setBarSize(30);
    } else {
      setBarSize(50);
    }
  };

  useEffect(() => {
    updateBarSize();
    window.addEventListener("resize", updateBarSize);

    return () => window.removeEventListener("resize", updateBarSize);
  }, []);

  return (
    <Card className="w-full mt-5">
      <CardHeader className="flex justify-between items-center border-b mb-4 flex-wrap">
        <CardTitle>
          Hours Worked per {`${type === "weekly" ? "Week" : "Day"}`}
        </CardTitle>
        {/* Filters*/}
        {data?.length > 0 && (
          <Tabs
            value={type}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, type: value }))
            }
            className="my-2"
          >
            <TabsList>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="daily">Daily</TabsTrigger>
            </TabsList>
          </Tabs>
        )}
      </CardHeader>
      <CardContent>
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
              <Bar dataKey="hours" fill="#3b82f6" barSize={barSize} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default BarChartComponent;
