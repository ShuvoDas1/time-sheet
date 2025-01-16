import React from "react";
// import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";
import { holidayList } from "../assets/fakeData";
import { Calendar } from "@/components/ui/calendar";

const MonthlyCalender = ({ value, onChange }) => {
  // Check Date is Holiday
  const isHoliday = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    const holiday = holidayList.find(
      ({ date, eventName }) => date === formattedDate
    );
    return holiday ? holiday.eventName : "";
  };

  return (
    // <Calendar
    //   onChange={onChange}
    //   value={value}
    //   tileDisabled={({ date }) => isHoliday(date)}
    //   tileContent={({ date }) => {
    //     const eventName = isHoliday(date);
    //     return <p style={{ color: "red" }}>{eventName || ""}</p>;
    //   }}
    // />
    <div className="w-full">
      <Calendar
        mode="single"
        selected={value}
        onSelect={onChange}
        className="!w-full rounded-md border shadow"
      />
    </div>
  );
};

export default MonthlyCalender;
