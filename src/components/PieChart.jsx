import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useDashbaord } from "@/context/DashboardContext";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

const COLORS = ["#55c97c", "#b666d1", "#ed1372"];

const PieChartComponent = ({ data }) => {
  const {
    filters: { type },
  } = useDashbaord();

  const [outerRadius, setOuterRadius] = useState(100);

  // Adjust outerRadius based on screen width
  const updateOuterRadius = () => {
    const width = window.innerWidth;
    if (width <= 480) {
      setOuterRadius(60);
    } else if (width <= 768) {
      setOuterRadius(100);
    } else {
      setOuterRadius(140);
    }
  };

  useEffect(() => {
    updateOuterRadius();
    window.addEventListener("resize", updateOuterRadius);

    return () => window.removeEventListener("resize", updateOuterRadius);
  }, []);

  return (
    <>
      <Card className="w-full mt-5">
        <CardHeader className="flex justify-between items-center border-b mb-4 flex-wrap">
          <CardTitle>Work Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          {data?.length < 1 ? (
            <div>
              <h4>No Data Found!!</h4>
            </div>
          ) : (
            <div style={{ width: "100%", height: 400 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="totalDay"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    outerRadius={outerRadius}
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
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default PieChartComponent;
