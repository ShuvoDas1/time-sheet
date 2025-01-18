import React, { useCallback, useContext, useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCalendar } from "@/context/CalendarContext";
import { ButtonWithTooltip } from "./ButtonWithTooltip";
import { Gift, Umbrella, Briefcase, Heart, Plane } from "lucide-react";

// import { Calendar } from "@/components/ui/calendar";

const MonthlyCalender = ({ value, onChange }) => {
  const {
    calendarData,
    loading,
    saveData,
    fetchMonthData,
    updateData,
    setCalendarData,
    statusList: { working, holiday, weekend, sickLeave, vacation },
  } = useCalendar();

  const [selectedMonth, setSelectedMonth] = useState(new Date());

  // Check Date is Holiday
  const isHoliday = useCallback(
    (date) => {
      const { holidays } = calendarData;
      const formattedDate = date.toLocaleDateString();
      const holiday = holidays.find(({ date }) => date === formattedDate);
      return holiday ? true : false;
    },
    [calendarData]
  );

  // Get all working days in this month

  const getWorkingDays = useCallback(() => {
    const workingDays = [];
    const { holidays, weekendDay } = calendarData;

    const month = selectedMonth.getMonth();
    const year = selectedMonth.getFullYear();

    const firstDate = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= lastDay; day++) {
      firstDate.setDate(day);

      const isWeekend = firstDate.getDay() === weekendDay;
      const isHoliday = holidays.some(({ date }) => {
        const holidayFormat = new Date(date);
        holidayFormat.getDate() === firstDate.getDate() &&
          holidayFormat.getMonth() === firstDate.getMonth() &&
          holidayFormat.getFullYear() === firstDate.getFullYear();
      });

      if (!isWeekend && !isHoliday) {
        workingDays.push({
          date: firstDate.toISOString().split("T")[0],
          status: working,
        });
      }
    }

    return { year, month, workingDays };
  }, [calendarData, selectedMonth]);

  // Set All as working day button click event

  const setAllAsWorkingDay = useCallback(async () => {
    const { year, month, workingDays } = getWorkingDays();
    const key = `${year}-${String(month + 1).padStart(2, "0")}`;
    const { status } = await fetchMonthData(key);

    if (status) {
      updateData({ id: key, days: workingDays });
    } else {
      saveData({ id: key, days: workingDays });
    }
  }, [getWorkingDays, fetchMonthData, updateData, saveData]);

  // UPDATE CALENDAR

  useEffect(() => {
    const month = selectedMonth.getMonth();
    const year = selectedMonth.getFullYear();
    const key = `${year}-${String(month + 1).padStart(2, "0")}`;

    const { timesheetData = [] } = calendarData;
    if (timesheetData.length > 0) {
      const monthlyData = timesheetData.find(({ id }) => id === key);
      setCalendarData((prev) => ({
        ...prev,
        activeMonthData: monthlyData?.days || [],
      }));
    }
  }, [selectedMonth, calendarData, setCalendarData]);

  // SET EVERY DAY CLASS NAME

  const tileContent = useCallback(
    ({ date }) => {
      const day = date.getDay();
      const isTodayHoliday = isHoliday(date);
      const { weekendDay, activeMonthData } = calendarData;
      let icon = null;
      if (day === weekendDay) {
        const newClass = holiday ? "holiday-tile weekend-tile" : "weekend-tile";
        icon = <Umbrella className="text-yellow-500 w-5 h-5" />;
      } else if (isTodayHoliday) {
        icon = <Gift className="text-blue-500 w-5 h-5" />;
      } else {
        const formattedDate = date.toISOString().split("T")[0];
        if (activeMonthData && activeMonthData.length > 0) {
          const foundData = activeMonthData.find(
            (item) => item?.date === formattedDate
          );
          if (foundData) {
            const { status } = foundData;
            icon =
              status === working ? (
                <Briefcase className="text-green-500  w-5 h-5" />
              ) : status === vacation ? (
                <Plane className="text-indigo-500 w-5 h-5" />
              ) : status === sickLeave ? (
                <Heart className="text-red-500 w-5 h-5" />
              ) : (
                ""
              );
          }
        }
      }
      return icon;
    },
    [calendarData, isHoliday]
  );

  return (
    <Card className="flex-1">
      <CardHeader>
        <div className="flex">
          <div className="flex-1 text-left">
            <CardTitle>Daily Work Calender</CardTitle>
          </div>
          <div className="flex-1">
            <ButtonWithTooltip
              buttonName={"Set as All Working Day"}
              tooltipTitle={"Exclued Holiday and Weekend"}
              onClick={() => setAllAsWorkingDay()}
              // loading={loading}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Calendar
          onActiveStartDateChange={({ activeStartDate }) =>
            setSelectedMonth(activeStartDate)
          }
          onChange={onChange}
          value={value}
          tileClassName={({ date }) => (isHoliday(date) ? "weekend-tile" : "")}
          tileContent={tileContent}
        />
      </CardContent>
    </Card>
  );
};

export default MonthlyCalender;
