import React, { useContext, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import MonthlyCalender from "@/components/MonthlyCalender";
import { holidayList } from "@/assets/fakeData";

import DayStatusPreview from "@/components/DayStatusPreview";
import { useCalendar } from "@/context/CalendarContext";
import moment from "moment";

const EmployWorkSchedule = () => {
  const {
    calendarData,
    setTimeSheetData,
    statusList: { working, holiday, weekend, sickLeave, vacation },
    setDayDetails,
  } = useCalendar();

  // SET TIME SHEET DATA

  useEffect(() => {
    const { timesheetData } = calendarData;
    if (timesheetData.length < 1) {
      setTimeSheetData();
    }
  }, [calendarData, setTimeSheetData]);

  // Format date function
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  // Update day information
  const updateDayInfo = (selectedDate) => {
    const { holidays, weekendDay, activeMonthData } = calendarData;
    const formattedDate = formatDate(selectedDate);

    const holidayData = holidays.find(({ date }) => date === formattedDate);
    if (holidayData) {
      setDayDetails({
        date: selectedDate,
        holidayEvent: holidayData?.eventName,
        status: holiday,
      });
    } else if (selectedDate.getDay() === weekendDay) {
      setDayDetails({
        date: selectedDate,
        status: weekend,
      });
    } else {
      let selectedDayInfo = null;
      if (activeMonthData.length > 0) {
        const dayData = activeMonthData.find(
          ({ date }) => date === formattedDate
        );
        selectedDayInfo = dayData || {
          date: selectedDate,
          status: "",
        };
      }
      setDayDetails(selectedDayInfo);
    }
  };

  // Set Current day details
  useEffect(() => {
    let mount = true;
    if (mount) {
      updateDayInfo(new Date());
    }

    return () => (mount = false);
  }, []);

  // Handler when a date is selected on the calendar
  const handlerDateChange = (selectDate) => {
    updateDayInfo(selectDate);
  };

  return (
    <div className="flex">
      {/* Calendar Card */}
      <MonthlyCalender
        value={new Date()}
        onChange={(value) => handlerDateChange(value)}
      />

      {/* Day Details Card */}
      <DayStatusPreview />
    </div>
  );
};

export default EmployWorkSchedule;
