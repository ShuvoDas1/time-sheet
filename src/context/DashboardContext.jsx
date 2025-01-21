import { holidayList, statusList } from "@/assets/ConstData";
import axios from "axios";
import { Briefcase, Gift, Heart, Plane, Umbrella } from "lucide-react";
import moment from "moment";
import React, { createContext, useCallback, useContext, useState } from "react";
import { toast } from "sonner";

const DashboardContext = createContext();

export const useDashbaord = () => {
  return useContext(DashboardContext);
};

export const DashboardProvier = ({ children }) => {
  const [filters, setFilters] = useState({
    type: "weekly",
    month: "01",
  });
  const [loading, setLoading] = useState(false);
  const [summaryData, setSummaryData] = useState({
    metricsData: [],
  });

  const DEFAULT_WORK_HOURS = 8;
  const { working, vacation, sickLeave } = statusList;

  const getSummaryData = useCallback(async () => {
    setLoading(true);
    const { type, month } = filters;

    try {
      if (!type || !month) {
        throw new Error("Invalid Request!");
      }
      const year = new Date().getFullYear();
      const id = `${year}-${month}`;

      const { data } = await axios.get(`http://localhost:3001/timesheet/${id}`);

      if (!data || data?.days.length < 1) {
        throw new Error("Data was not found for this month");
      }

      const { days } = data;

      //   Bar Char Data
      let barChartData = null;

      if (type === "weekly") {
        barChartData = calculateWeeklyWorkHours(year, month, days);
      } else {
        barChartData = calculateDailyWorkHours(year, month, days);
      }

      const metricsData = calculateMetricsData(days);
      const pieChartData = calculateWorkStatusSummary(days);

      setSummaryData((prev) => ({
        ...prev,
        metricsData,
        barChartData,
        pieChartData,
      }));
    } catch (error) {
      setSummaryData({
        metricsData: [
          { title: "Total Worked Hour", value: 0 },
          { title: "Vacation Days", value: 0 },
          { title: "Sick Leaves", value: 0 },
          {
            title: "Working vs Non-Working",
            value: 0,
          },
        ],
        barChartData: [],
        pieChartData: [],
      });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  //  CALCULATE WORK STATUS (WEEKEND, VACATION, SICK-LEAVE) HOURS SUMMARY

  const calculateWorkStatusSummary = (days) => {
    const summary = days.reduce((acc, item) => {
      acc[item?.status] = (acc[item?.status] || 0) + 1;
      return acc;
    }, {});

    const modifyData = Object.entries(summary).map(
      ([type, totalDay], index) => ({
        type,
        totalDay,
      })
    );

    return modifyData;
  };

  //   CALCULATE DAILY WORKED HOURS
  const calculateDailyWorkHours = (year, month, data) => {
    const daysInMonth = moment(`${year}-${month}`, "YYYY-MM").daysInMonth();
    const monthData = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const formattedDate = moment({ year, month: month - 1, day }).format(
        "YYYY-MM-DD"
      );
      const item = data.find((item) => item?.date === formattedDate);

      const dayData = {
        date: moment(formattedDate).format("DD"),
        tooltip: {
          status: item?.status || "",
          date: moment(formattedDate).format("Do MMMM YYYY"),
        },
      };
      if (item)
        dayData.hours =
          item?.status === working ? item.workHour || DEFAULT_WORK_HOURS : 0;

      monthData.push(dayData);
    }
    console.log(monthData);
    return monthData;
  };

  // GET WEEKLY WORK HOURS OF A MONTH

  const calculateWeeklyWorkHours = (year, month, data) => {
    const firstDayOfMonth = moment({ year, month: month - 1, day: 1 });
    const lastDayOfMonth = firstDayOfMonth.clone().endOf("month");

    const allWeeks = [];
    let currentWeekStart = firstDayOfMonth.clone().startOf("week");
    while (currentWeekStart.isSameOrBefore(lastDayOfMonth)) {
      const startOfWeek = currentWeekStart.format("MMMM Do");
      const endOfWeek = currentWeekStart
        .clone()
        .endOf("week")
        .format("MMMM Do");
      const weekRange = `${startOfWeek} - ${endOfWeek}`;
      allWeeks.push(weekRange);
      currentWeekStart.add(1, "week");
    }

    const weeklyHours = data.reduce((acc, day) => {
      const dayMoment = moment(day?.date);

      if (
        dayMoment.isSameOrAfter(firstDayOfMonth) &&
        dayMoment.isSameOrBefore(lastDayOfMonth)
      ) {
        const startOfWeek = dayMoment.startOf("week").format("MMMM Do");
        const endOfWeek = dayMoment.endOf("week").format("MMMM Do");
        const weekRange = `${startOfWeek} - ${endOfWeek}`;

        if (day.status === working) {
          const workHours = day.workHour
            ? parseFloat(day.workHour)
            : DEFAULT_WORK_HOURS;

          acc[weekRange] = (acc[weekRange] || 0) + workHours;
        }
      }

      return acc;
    }, {});

    const modifyData = allWeeks.map((weekRange, index) => ({
      week: `Week-${index + 1}`,
      hours: weeklyHours[weekRange] || 0,
      tooltipDate: weekRange,
    }));

    return modifyData;
  };

  //   GET METRICS DATA
  const calculateMetricsData = (data) => {
    // const { vacation, sickLeave, working } = statusList;

    // TOTAL WORK HOURS OF THIS MONTH
    const totalWorkHours = data.reduce((acc, currentItem) => {
      let hour = 0;
      if (currentItem?.status === working) {
        hour = parseFloat(currentItem.workHour) || DEFAULT_WORK_HOURS;
      }
      return acc + hour;
    }, 0);

    // TOTAL VACATION DAYS OF THIS MONTH
    const numberOfVacations = data.reduce(
      (acc, currentItem) => acc + (currentItem.status === vacation ? 1 : 0),
      0
    );

    // TOTAL SICK LEAVE DAYS OF THIS MONTH
    const numberOfSickLeaves = data.reduce(
      (acc, currentItem) => acc + (currentItem.status === sickLeave ? 1 : 0),
      0
    );

    // TOTAL WORKING AND NON-WORKING DAYS OF THIS MONTH
    const totalDays = data.length;
    const workingDaysCount = data.reduce(
      (acc, currentItem) => acc + (currentItem.status === working ? 1 : 0),
      0
    );

    const nonWorkingDaysCount = totalDays - workingDaysCount;

    const workingPercentage = ((workingDaysCount / totalDays) * 100).toFixed(2);

    const nonWorkingPercentage = (
      (nonWorkingDaysCount / totalDays) *
      100
    ).toFixed(2);

    return [
      { title: "Total Worked Hour", value: totalWorkHours },
      { title: "Vacation Days", value: numberOfVacations },
      { title: "Sick Leaves", value: numberOfSickLeaves },
      {
        title: "Working vs Non-Working",
        value: `${workingPercentage}% Vs ${nonWorkingPercentage}%`,
      },
    ];
  };

  return (
    <DashboardContext.Provider
      value={{ getSummaryData, summaryData, filters, setFilters }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
