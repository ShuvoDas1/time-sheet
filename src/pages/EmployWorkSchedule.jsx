import React, { useEffect, useState } from "react";
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

import DateStatus from "@/components/DateStatus";

const EmployWorkSchedule = () => {
  const [dayDetails, setDayDetails] = useState({
    date: new Date(),
    holidayEvent: "",
    status: "",
  }); // State to manage drawer visibility

  // Format date function
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  // Update day information
  const updateDayInfo = (selectedDate) => {
    const data = {
      date: selectedDate,
      holidayEvent: "",
      status: "",
    };
    const holiday = holidayList.find(
      ({ date }) => date === formatDate(selectedDate)
    );
    if (holiday) {
      data.holidayEvent = holiday?.eventName;
      data.status = "holiday";
    }

    if (selectedDate.getDay() === 5) {
      data.status = "weekend";
    }

    setDayDetails((prev) => ({
      ...prev,
      ...data,
    }));
  };

  // Set Current day details
  useEffect(() => {
    let mount = true;
    if (mount) updateDayInfo(new Date());

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
      <DateStatus dayDetails={dayDetails} formatDate={formatDate} />
    </div>
  );
};

export default EmployWorkSchedule;
