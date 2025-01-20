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
import { jsPDF } from "jspdf";
import { FileText } from "lucide-react";
import autoTable from "jspdf-autotable";
import { useCalendar } from "@/context/CalendarContext";
import { toast } from "sonner";
import moment from "moment";
import { useTheme } from "next-themes";

const Dashboard = () => {
  const {
    getSummaryData,
    summaryData: { metricsData, barChartData, pieChartData },
    filters,
    setFilters,
  } = useDashbaord();

  const {
    fetchMonthData,
    statusList: { working, vacation, sickLeave },
  } = useCalendar();

  const { value: theme } = useTheme();

  useEffect(() => {
    if (filters.type && filters.month) {
      getSummaryData();
    }
  }, [filters]);

  // EXPORT REPORT AS PDF OF SELECTED MONTH
  const handleExportReport = async () => {
    const year = new Date().getFullYear();
    const key = `${year}-${filters.month}`;

    // GET MONTH DATA
    const { data } = await fetchMonthData(key);

    if (!data || !data?.days.length) return toast("Data was not found!");

    const monthFormat = moment()
      .month(parseInt(filters.month) - 1)
      .format("MMMM");
    const title = `Report of ${monthFormat} - ${year}`;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(title, 70, 10);

    const summaryHead = [["Category", "Total"]];
    const summaryData = metricsData.reduce((acc, item) => {
      const data = [item?.title, item?.value];
      acc.push(data);
      return acc;
    }, []);

    autoTable(doc, {
      startY: 20,
      head: summaryHead,
      body: summaryData,
      theme: "grid",
      styles: { halign: "center" },
    });

    // Daily Details Table Data
    const dayDetailsHead = [["Date", "Status", "Worked Hour / Sick Note"]];

    const dayDetailsBody = data?.days.reduce((acc, item) => {
      const data = [
        item?.date,
        item?.status,
        item?.status === working
          ? item?.workHour ?? 8
          : item?.status === sickLeave
          ? item?.sickNote
          : "N/A",
      ];
      acc.push(data);
      return acc;
    }, []);
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: dayDetailsHead,
      body: dayDetailsBody,
      theme: "grid",
      styles: { halign: "center" },
    });

    // Save the PDF
    doc.save(`timesheet-report-of-2025-${filters?.month}.pdf`);
  };

  return (
    <div className=" w-full px-4">
      {/* <CommonBreadcrumb pageName="Dashboard" /> */}
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between flex-wrap items-center">
          {/* Month Filter */}
          <CustomSelect
            value={filters?.month}
            setData={(value) =>
              setFilters((prev) => ({ ...prev, month: value }))
            }
            options={months}
            className="w-80"
          />
          <ButtonWithTooltip
            buttonName="Export Pdf"
            tooltipTitle="Export Timesheet Pdf of the selected month"
            onClick={handleExportReport}
            Icon={<FileText className="text-blue-500  w-6 h-6" />}
            disabled={!filters.month}
            className="mt-3 xl:mt-0 lg-mt:0"
          />
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
