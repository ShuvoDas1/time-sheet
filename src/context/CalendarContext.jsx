import { holidayList } from "@/assets/ConstData";
import axios from "axios";
import { Briefcase, Gift, Heart, Plane, Umbrella } from "lucide-react";
import moment from "moment";
import React, { createContext, useCallback, useContext, useState } from "react";
import { toast } from "sonner";

const CalendarContext = createContext();

export const useCalendar = () => {
  return useContext(CalendarContext);
};

export const CalendarProvider = ({ children }) => {
  const [calendarData, setCalendarData] = useState({
    weekendDay: 0,
    holidays: [...holidayList],
    timesheetData: [],
    activeMonthData: [],
  });

  const statusList = {
    working: "working",
    holiday: "holiday",
    weekend: "weekend",
    sickLeave: "sick-leave",
    vacation: "vacation",
  };

  const [dayDetails, setDayDetails] = useState({
    date: new Date(),
    holidayEvent: "",
    status: "",
    workHour: 0,
    sickNote: "",
  });

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(false);

  // SET WORK STATUS DATA IN CALENDER
  const setTimeSheetData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3001/timesheet");
      setCalendarData((prev) => ({
        ...prev,
        timesheetData: response.data,
      }));
      return { responseStatus: true, message: "Data set successfully" };
    } catch (error) {
      return {
        responseStatus: false,
        message: error?.message || "Something went wrong",
      };
    } finally {
      setLoading(false);
    }
  }, []);

  //  CREATE  WORK STATUS FOR A MONTH
  const saveData = useCallback(
    async (payload) => {
      setLoading(true);
      let message = "";
      try {
        const response = await axios.post(
          "http://localhost:3001/timesheet",
          payload
        );
        if (!response.data) throw new Error("Data could not be saved!");

        setTimeSheetData(); // Refresh the timesheet data after saving
        message = "Successfully submitted";
        return { responseStatus: true, message };
      } catch (error) {
        message = error?.message || "Something went wrong";
        return { responseStatus: false, message };
      } finally {
        setLoading(false);
        toast(message);
      }
    },
    [setTimeSheetData]
  );

  // UPDATE WORK STATUS FOR A MONTH
  const updateData = useCallback(
    async (payload) => {
      setLoading(true);
      let message = "";
      try {
        const response = await axios.put(
          `http://localhost:3001/timesheet/${payload.id}`,
          payload
        );
        if (!response.data) throw new Error("Data could not be saved!");

        setTimeSheetData(); // Refresh the timesheet data after updating
        message = "Successfully submitted";
        return { responseStatus: true, message };
      } catch (error) {
        message = error?.message || "Something went wrong";
        return { responseStatus: false, message };
      } finally {
        setLoading(false);
        toast(message);
      }
    },
    [setTimeSheetData]
  );

  // GET DATA FOR A MONTH
  const fetchMonthData = useCallback(async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3001/timesheet/${id}`);
      return {
        status: true,
        message: "Data fetched successfully",
        data: response.data,
      };
    } catch (error) {
      return {
        status: false,
        message: error?.message || "Something went wrong",
        data: null,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // SAVE SINGLE DAY STATUS
  const saveSingleDayStatus = useCallback(
    async (id, payload) => {
      setLoading(true);
      let message = "";
      try {
        const { data } = await fetchMonthData(id);
        if (data) {
          const existDay = data.days.find(
            (item) => item?.date === payload.date
          );
          let updatedDays = [];

          if (existDay) {
            updatedDays = data.days.map((day) =>
              day.date === existDay.date ? { ...day, ...payload } : day
            );
          } else {
            updatedDays = [...data.days, payload];
          }

          const { responseStatus } = await updateData({
            id,
            days: updatedDays,
          });
          if (responseStatus) {
            setTimeSheetData();
            const utcDate = new Date(payload?.date);
            setDayDetails({ ...payload, date: utcDate });
          }
        } else {
          const { responseStatus } = await saveData({ id, days: [payload] });
          if (responseStatus) {
            setTimeSheetData();
            const utcDate = new Date(payload?.date);
            setDayDetails({ ...payload, date: utcDate });
          }
        }

        return { responseStatus: true, message: "Data saved successfully" };
      } catch (error) {
        message = error?.message || "Something went wrong";
        return { responseStatus: false, message };
      } finally {
        setLoading(false);
      }
    },
    [fetchMonthData, saveData, updateData, setTimeSheetData]
  );

  // CHECK SELECTED DAY IS HOLIDAY OR NOT
  const checkHoliday = (date) => {
    const { holidays } = calendarData;
    const formattedDate = moment(date).format("y-MM-DD");
    const holiday = holidays.find(({ date }) => date === formattedDate);
    return holiday ? true : false;
  };

  // GET WORKING DAYS OF THE SELECTED MONTH
  const getWorkingDaysOfMonth = (activeStartDate, status = "") => {
    const workingDays = [];
    const { holidays, weekendDay } = calendarData;

    const month = activeStartDate.getMonth();
    const year = activeStartDate.getFullYear();
    const selectedDate = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= lastDay; day++) {
      selectedDate.setDate(day);

      const isWeekend = selectedDate.getDay() === weekendDay;
      const isHoliday = holidays.some(({ date }) => {
        const holidayFormat = new Date(date);
        return (
          holidayFormat.getDate() === selectedDate.getDate() &&
          holidayFormat.getMonth() === selectedDate.getMonth() &&
          holidayFormat.getFullYear() === selectedDate.getFullYear()
        );
      });

      if (!isWeekend && !isHoliday) {
        workingDays.push({
          date: moment(selectedDate).format("y-MM-DD"),
          status,
        });
      }
    }

    return { workingDays, totalWorkingDays: workingDays.length };
  };

  // CALENDER TILE ICONS
  const tileContent = (date) => {
    const day = date.getDay();
    const isTodayHoliday = checkHoliday(date);
    const { weekendDay, activeMonthData } = calendarData;
    const { vacation, working, sickLeave } = statusList;
    let icon = null;

    if (day === weekendDay) {
      icon = <Umbrella className="text-yellow-500 w-4 h-4" />;
    } else if (isTodayHoliday) {
      icon = <Gift className="text-blue-500 w-4 h-4" />;
    } else {
      const formattedDate = moment(date).format("y-MM-DD");
      const foundData = activeMonthData?.find(
        (item) => item?.date === formattedDate
      );
      if (foundData) {
        const { status } = foundData;
        if (status === working) {
          icon = <Briefcase className="text-green-500 w-4 h-4" />;
        } else if (status === vacation) {
          icon = <Plane className="text-indigo-500 w-4 h-4" />;
        } else if (status === sickLeave) {
          icon = <Heart className="text-red-500 w-4 h-4" />;
        }
      }
    }

    return <div className="flex justify-center mt-2">{icon}</div>;
  };

  // KEY GENERATE FOR A MONTH
  const monthKeyGenerate = (date) => {
    const month = date.getMonth();
    const year = date.getFullYear();
    return `${year}-${String(month + 1).padStart(2, "0")}`;
  };

  return (
    <CalendarContext.Provider
      value={{
        calendarData,
        loading,
        saveData,
        fetchMonthData,
        updateData,
        setTimeSheetData,
        setCalendarData,
        statusList,
        dayDetails,
        setDayDetails,
        saveSingleDayStatus,
        checkHoliday,
        getWorkingDaysOfMonth,
        tileContent,
        monthKeyGenerate,
        setCurrentMonth,
        currentMonth,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};
