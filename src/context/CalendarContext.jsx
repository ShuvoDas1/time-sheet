import { holidayList } from "@/assets/fakeData";
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
    weekendDay: 5,
    holidays: [...holidayList],
    timesheetData: [],
    activeMonthData: [],
  });
  const [loading, setLoading] = useState(false);

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

  // SAVE NEW DATA
  const saveData = async (payload) => {
    setLoading(true);
    let message = "";
    try {
      const response = await axios.post(
        "http://localhost:3001/timesheet",
        payload
      );

      if (!response.data) {
        throw new Error("Data could not be saved!");
      }

      setTimeSheetData();
      message = "Successfully submitted";
      return {
        responseStatus: true,
        message,
      };
    } catch (error) {
      message = error?.message || "Something went wrong";
      return {
        responseStatus: false,
        message,
      };
    } finally {
      setLoading(false);
      toast(message);
    }
  };

  // UPDATE EXISTING DATA
  const updateData = async (payload) => {
    setLoading(true);
    let message = "";
    try {
      const response = await axios.put(
        `http://localhost:3001/timesheet/${payload.id}`,
        payload
      );

      if (!response.data) {
        throw new Error("Data could not be saved!");
      }
      setTimeSheetData();
      message = "Successfully submitted";
      return {
        responseStatus: true,
        message,
      };
    } catch (error) {
      message = error?.message || "Something went wrong";
      return {
        responseStatus: false,
        message: message,
        data: null,
      };
    } finally {
      setLoading(false);
      toast(message);
    }
  };

  // GET DATA BY YEAR AND MONTH
  const fetchMonthData = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3001/timesheet/${id}`);
      return {
        status: true,
        message: "data get Successfully",
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
  };

  // SET ALL DATA

  const setTimeSheetData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3001/timesheet`);
      setCalendarData((prev) => ({
        ...prev,
        timesheetData: response.data,
      }));
      return {
        reponseStatus: true,
        message: "Set Data successfully",
      };
    } catch (error) {
      return {
        reponseStatus: false,
        message: error?.message || "Something went wrong",
      };
    } finally {
      setLoading(false);
    }
  };

  // A Day data submit
  const saveSingleDayStatus = async (id, payload) => {
    setLoading(true);
    let message = "";
    let success = false;
    try {
      const { data } = await fetchMonthData(id);
      console.log(id);
      if (data) {
        const existDay = data.days.find((item) => item?.date === payload.date);
        let updateDays = [];

        if (existDay) {
          updateDays = data.days.map((day) =>
            day.date === existDay.date ? { ...day, ...payload } : day
          );
        } else {
          updateDays = [...data.days, payload];
        }
        const { responseStatus } = await updateData({ id, days: updateDays });
        success = responseStatus;
      } else {
        const { responseStatus } = await saveData({ id, days: [payload] });
        success = responseStatus;
      }

      if (success) {
        setTimeSheetData();
        const utcDate = new Date(payload?.date);
        setDayDetails({ ...payload, date: utcDate });
        return {
          reponseStatus: true,
          message: "Save Data successfully",
        };
      }
    } catch (error) {
      message = error?.message || "Something went wrong";
      return {
        reponseStatus: false,
        message,
      };
    } finally {
      setLoading(false);
      // toast(message);
    }
  };

  // Check Date is Holiday
  const checkHoliday = (date) => {
    const { holidays } = calendarData;
    const formattedDate = moment(date).format("y-MM-DD");
    const holiday = holidays.find(({ date }) => date === formattedDate);
    return holiday ? true : false;
  };

  // Get all working days in this month

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
    const totalWorkingDays = workingDays.length;

    return { workingDays, totalWorkingDays };
  };

  // SET Tile Content

  const tileContent = (date) => {
    const day = date.getDay();
    const isTodayHoliday = checkHoliday(date);
    const { weekendDay, activeMonthData } = calendarData;
    const { working, vacation, sickLeave } = statusList;
    let icon = null;
    if (day === weekendDay) {
      icon = <Umbrella className="text-yellow-500 w-3 h-3" />;
    } else if (isTodayHoliday) {
      icon = <Gift className="text-blue-500 w-3 h-3" />;
    } else {
      const formattedDate = moment(date).format("y-MM-DD");
      if (activeMonthData && activeMonthData.length > 0) {
        const foundData = activeMonthData.find(
          (item) => item?.date === formattedDate
        );
        if (foundData) {
          const { status } = foundData;
          icon =
            status === working ? (
              <Briefcase className="text-green-500  w-3 h-3" />
            ) : status === vacation ? (
              <Plane className="text-indigo-500 w-3 h-3" />
            ) : status === sickLeave ? (
              <Heart className="text-red-500 w-3 h-3" />
            ) : (
              ""
            );
        }
      }
    }
    return <div className="flex justify-center mt-2">{icon}</div>;
  };

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
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};
