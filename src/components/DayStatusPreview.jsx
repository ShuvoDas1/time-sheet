import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import moment from "moment";
import { useCalendar } from "@/context/CalendarContext";
import DayStatusUpdate from "./DayStatusUpdate";

const DayStatusPreview = () => {
  const {
    statusList: { working, holiday, weekend, sickLeave, vacation },
    dayDetails,
  } = useCalendar();
  return (
    <Card className="flex-none w-3/12 ml-2 shadow-md rounded-lg border border-gray-300">
      <CardHeader>
        <CardTitle>Preview</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        {/* Date Display */}
        <h5 className="font-semibold text-lg">
          Date: {moment(dayDetails?.date).format("MMMM Do YYYY")}
        </h5>
        {/* Holiday/Event Indicator */}
        {dayDetails?.holidayEvent && (
          <h5 className="font-medium text-md mt-2">
            {dayDetails?.holidayEvent}
          </h5>
        )}

        {/* Status Indicator with Color */}
        <div className="mt-4">
          <div
            className={`p-2 rounded-lg text-white ${
              dayDetails?.status === holiday
                ? "bg-blue-500"
                : dayDetails?.status === vacation
                ? "bg-purple-700"
                : dayDetails?.status === sickLeave
                ? "bg-red-500"
                : dayDetails?.status === weekend
                ? "bg-yellow-500"
                : dayDetails?.status === working
                ? "bg-green-500"
                : "bg-black"
            }`}
          >
            {dayDetails?.status === holiday
              ? "Holiday"
              : dayDetails?.status === vacation
              ? "Vacation"
              : dayDetails?.status === sickLeave
              ? "Sick Leave"
              : dayDetails?.status === weekend
              ? "Weekend"
              : dayDetails?.status === working
              ? "Working"
              : "No Event"}
          </div>
        </div>

        {/* If this day is not Holiday or Weekend  */}
        {!["weekend", "holiday"].includes(dayDetails?.status) && (
          <div className="mt-5">
            <DayStatusUpdate />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DayStatusPreview;
