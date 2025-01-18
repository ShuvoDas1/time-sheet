import { holidayList } from "@/assets/fakeData";
import axios from "axios";
import moment from "moment";
import React, { createContext, useContext, useState } from "react";
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
        message: error?.message || "Something went wrong",
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
        setDayDetails({ ...payload, date: utcDate.toLocaleDateString() });
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
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};
