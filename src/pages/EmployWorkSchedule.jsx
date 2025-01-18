import React, { useCallback, useContext, useEffect, useState } from "react";
import MonthlyCalender from "@/components/MonthlyCalender";
import { holidayList } from "@/assets/fakeData";

import DayStatusPreview from "@/components/DayStatusPreview";
import { useCalendar } from "@/context/CalendarContext";
import moment from "moment";
import { Briefcase, Gift, Heart, Plane, Umbrella } from "lucide-react";

const EmployWorkSchedule = () => {
  const {
    calendarData,
    setTimeSheetData,
    statusList: { working, holiday, weekend, sickLeave, vacation },
    setDayDetails,
    fetchMonthData,
    updateData,
    saveData,
    setCalendarData,
    checkHoliday,
    getWorkingDaysOfMonth,
    tileContent,
    monthKeyGenerate,
  } = useCalendar();

  // SET TIME SHEET DATA

  useEffect(() => {
    const { timesheetData } = calendarData;
    if (!timesheetData || timesheetData.length < 1) {
      setTimeSheetData();
    }
  }, [calendarData, setTimeSheetData]);

  // Format date function y-MM-DD
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  // Update day information
  const updateDayInfo = async (selectedDate) => {
    const { holidays, weekendDay, activeMonthData } = calendarData;
    const formattedDate = formatDate(selectedDate);

    const holidayData = holidays.find(({ date }) => date === formattedDate);
    let newDetails = null;

    if (holidayData) {
      newDetails = {
        date: selectedDate,
        holidayEvent: holidayData?.eventName,
        status: holiday,
      };
    } else if (selectedDate.getDay() === weekendDay) {
      newDetails = {
        date: selectedDate,
        status: weekend,
      };
    } else if (activeMonthData.length > 0) {
      const dayData = activeMonthData.find(
        ({ date }) => date === formattedDate
      );

      newDetails = dayData
        ? { ...dayData, date: moment(dayData.date) }
        : {
            date: selectedDate,
            status: "",
          };
    } else {
      const key = monthKeyGenerate(selectedMonth);
      const { data } = await fetchMonthData(key);

      if (data) {
        const dayData = data.days.find(({ date }) => date === formattedDate);
        newDetails = { ...dayData, date: moment(dayData.date) };
      } else {
        newDetails = {
          date: selectedDate,
          status: "",
        };
      }
    }

    setDayDetails((prevDetails) =>
      JSON.stringify(prevDetails) === JSON.stringify(newDetails)
        ? prevDetails
        : newDetails
    );
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

  const [selectedMonth, setSelectedMonth] = useState(new Date());

  // Set All as working day button click event

  const setAllAsWorkingDay = useCallback(async () => {
    const { workingDays } = getWorkingDaysOfMonth(selectedMonth, working);
    const key = monthKeyGenerate(selectedMonth);

    const { status } = await fetchMonthData(key);

    if (status) {
      updateData({ id: key, days: workingDays });
    } else {
      saveData({ id: key, days: workingDays });
    }
  }, []);

  // UPDATE CALENDAR

  useEffect(() => {
    const key = monthKeyGenerate(selectedMonth);

    const { timesheetData = [] } = calendarData;
    if (timesheetData.length > 0) {
      const monthlyData = timesheetData.find(({ id }) => id === key);
      setCalendarData((prev) => ({
        ...prev,
        activeMonthData: monthlyData?.days || [],
      }));
    }
  }, [selectedMonth, calendarData]);

  // SET EVERY DAY CLASS NAME

  return (
    <div className="flex flex-wrap">
      {/* Calendar Card */}

      <div className="flex-1 w-full xl:w-8/12">
        <MonthlyCalender
          value={new Date()}
          onChange={(value) => handlerDateChange(value)}
          tileContent={({ date }) => tileContent(date)}
          selectMonth={({ activeStartDate }) =>
            setSelectedMonth(activeStartDate)
          }
          setAllAsWorkingDay={setAllAsWorkingDay}
        />
      </div>

      {/* Day Details Card */}
      <div className="flex-none w-full xl:w-4/12 mt-4 xl:mt-0 ml-0 xl:ml-2">
        <DayStatusPreview />
      </div>
    </div>
  );
};

export default EmployWorkSchedule;
