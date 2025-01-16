import React from "react";
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
// import { Calendar } from "@/components/ui/calendar";

const MonthlyCalender = ({ value, onChange }) => {
  // Check Date is Holiday
  const isHoliday = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    const holiday = holidayList.find(({ date }) => date === formattedDate);
    return holiday ? true : false;
  };

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Daily Work Status</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <Calendar
          onChange={onChange}
          value={value}
          tileClassName={({ date }) => {
            const day = date.getDay();
            const holiday = isHoliday(date);
            if (day === 5) {
              return holiday ? "holiday-tile weekend-tile" : "weekend-tile";
            }
            return holiday ? "holiday-tile" : null;
          }}
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

    // <div className="w-full">
    //   <Calendar
    //     mode="single"
    //     selected={value}
    //     onSelect={onChange}
    //     className="!w-full rounded-md border shadow"
    //     isHoliday={isHoliday}
    //   />
    // </div>
  );
};

export default MonthlyCalender;
