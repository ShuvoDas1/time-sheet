import { holidayList } from "@/assets/fakeData";
import axios from "axios";
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
  });
  const [loading, setLoading] = useState(false);

  // const submitData = async (yearMonth, requestData) => {
  //   const { status } = await fetchMonthData(yearMonth);

  //   const payload = {
  //     id: yearMonth,
  //     days: requestData,
  //   };

  //   let response = null;
  //   if (status) {
  //     response = await updateData(payload);
  //   } else {
  //     response = saveNewData(payload);
  //   }

  //   return response;
  // };

  // SAVE NEW DATA
  const saveData = async (payload) => {
    setLoading(true);
    let message = "";
    try {
      const response = await axios.post(
        "http://localhost:3001/timesheet",
        payload
      );
      //   return {
      //     status: true,
      //     message: "Successfully submitted",
      //     data: response.data,
      //   };
      setCalendarData((prev) => ({
        ...prev,
        timesheetData: [...prev.timesheetData, response.data],
      }));
      message = "Successfully submitted";
    } catch (error) {
      //   return {
      //     status: false,
      //     message: error?.message || "Something went wrong",
      //     data: null,
      //   };
      message = error?.message || "Something went wrong";
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
      //   return {
      //     status: true,
      //     message: "Successfully submitted",
      //     data: response.data,
      //   };
      setCalendarData((prev) => ({
        ...prev,
        timesheetData: [...prev.timesheetData, response.data],
      }));
      message = "Successfully submitted";
    } catch (error) {
      return {
        status: false,
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

  // GET ALL DATA

  const setTimeSheetData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3001/timesheet`);
      setCalendarData((prev) => ({
        ...prev,
        timesheetData: response.data,
      }));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
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
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};
