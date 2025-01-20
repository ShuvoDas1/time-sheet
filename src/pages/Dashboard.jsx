import { months } from "@/assets/ConstData";
import BarChartComponent from "@/components/BarChart";
import CommonBreadcrumb from "@/components/Breadcrumb";
import { ButtonWithTooltip } from "@/components/ButtonWithTooltip";
import CustomSelect from "@/components/CustomSelect";

import MetricCard from "@/components/MetricCard";
import PieChartComponent from "@/components/PieChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useDashbaord } from "@/context/DashboardContext";
import React, { useEffect } from "react";

const Dashboard = () => {
  const {
    getSummaryData,
    summaryData: { metricsData, barChartData, pieChartData },
    filters,
    setFilters,
  } = useDashbaord();

  useEffect(() => {
    if (filters.type && filters.month) {
      getSummaryData();
    }
  }, [filters]);

  return (
    <div className=" w-full px-4">
      {/* <CommonBreadcrumb pageName="Dashboard" /> */}
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between">
          {/* Month Filter */}
          <CustomSelect
            value={filters?.month}
            setData={(value) =>
              setFilters((prev) => ({ ...prev, month: value }))
            }
            options={months}
            className="w-80"
          />
          {/* <ButtonWithTooltip
            buttonName="Export Timesheet Pdf"
            tooltipTitle="Export Timesheet Pdf of the selected month"
            onClick={() => {
              setRecurringOpenModal((prev) => !prev);
            }}
            Icon={<Repeat className="text-blue-500  w-6 h-6" />}
          /> */}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {metricsData?.map((item, index) => {
            return (
              <MetricCard key={index} title={item?.title} value={item?.value} />
            );
          })}
        </div>

        {/* Charts */}
        <div className="flex flex-wrap justify-between">
          <PieChartComponent data={pieChartData} />
          <BarChartComponent data={barChartData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
