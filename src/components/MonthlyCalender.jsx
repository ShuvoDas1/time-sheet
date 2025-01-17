import React, { useContext, useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { holidayList } from "../assets/fakeData";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCalendar } from "@/context/CalendarContext";
import { Button } from "./ui/button";
import { ButtonWithTooltip } from "./ButtonWithTooltip";
import axios from "axios";
import { submitData } from "@/api/api";
import { toast } from "sonner";
// import { Calendar } from "@/components/ui/calendar";

const MonthlyCalender = ({ value, onChange }) => {
  const { calendarData, loading, saveData, fetchMonthData, updateData } =
    useCalendar();

  const [selectedMonth, setSelectedMonth] = useState(new Date());

  // Others day means without weekend and holiday
  const [activeDays, setActiveDays] = useState([]);

  // Check Date is Holiday
  const isHoliday = (date) => {
    const { holidays } = calendarData;
    const formattedDate = date.toISOString().split("T")[0];
    const holiday = holidays.find(({ date }) => date === formattedDate);
    return holiday ? true : false;
  };

  // Get all working days in this month

  const getWorkingDays = () => {
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
          status: "working",
        });
      }
    }

    return { year, month, workingDays };
  };

  // Set All as working day button click event

  const setAllWorkingDay = async () => {
    const { year, month, workingDays } = getWorkingDays();
    const key = `${year}-${String(month + 1).padStart(2, "0")}`;
    const { status } = await fetchMonthData(key);

    if (status) {
      updateData({ id: key, data: workingDays });
    } else {
      saveData({ id: key, data: workingDays });
    }
  };

  // UPDATE CALENDAR

  useEffect(() => {
    const month = selectedMonth.getMonth();
    const year = selectedMonth.getFullYear();
    const key = `${year}-${String(month + 1).padStart(2, "0")}`;

    const { timesheetData = [] } = calendarData;
    if (timesheetData.length > 0) {
      const monthlyData = timesheetData.find(({ id }) => id === key);
      if (monthlyData) {
        setActiveDays(monthlyData?.data);
      }
    }
  }, [selectedMonth, calendarData]);

  // SET EVERY DAY CLASS NAME

  const setDayClassName = ({ date }) => {
    const day = date.getDay();
    const holiday = isHoliday(date);
    const { weekendDay } = calendarData;
    let className = "tile";
    if (day === weekendDay) {
      const newClass = holiday ? "holiday-tile weekend-tile" : "weekend-tile";
      className = className.concat(" ", newClass);
    } else if (holiday) {
      className = className.concat(" ", "holiday-tile");
    } else {
      const formattedDate = date.toISOString().split("T")[0];
      const foundData = activeDays.find((item) => item?.date === formattedDate);
      if (foundData) {
        const { status } = foundData;
        const newClass =
          status === "working"
            ? "working-tile"
            : status === "vacation"
            ? "vacation-tile"
            : status === "sick_leave"
            ? "sick-leave-tile"
            : "";

        className = className.concat(" ", newClass);
      }
    }
    return className;
  };

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
              onClick={setAllWorkingDay}
              loading={loading}
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
          tileClassName={setDayClassName}
          // tileDisabled={({ date }) => isHoliday(date)}
          // tileContent={({ date }) => {
          //   const holiday = isHoliday(date);
          //   return holiday ? (
          //     <div title={holiday.eventName}>
          //       {holiday.eventName ? <span>🎉</span> : null}
          //     </div>
          //   ) : null;
          // }}
        />
      </CardContent>
    </Card>
  );
};

export default MonthlyCalender;
