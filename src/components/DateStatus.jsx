import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DateStatus = ({ dayDetails, formatDate }) => {
  const { date, holidayEvent, status } = dayDetails;
  return (
    <Card className="flex-none w-3/12 ml-2 shadow-md rounded-lg border border-gray-300">
      <CardHeader>
        <CardTitle>Preview</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        {/* Date Display */}
        <h5 className="font-semibold text-lg">Date: {formatDate(date)}</h5>

        {/* Status Indicator with Color */}
        <div className="mt-4">
          <div
            className={`p-2 rounded-lg text-white ${
              status === "holiday"
                ? "bg-yellow-500"
                : status === "vacation"
                ? "bg-pink-500"
                : status === "sick leave"
                ? "bg-amber-500"
                : status === "weekend"
                ? "bg-red-500"
                : "bg-blue-500"
            }`}
          >
            {dayDetails?.status === "holiday"
              ? "Holiday"
              : status === "vacation"
              ? "Vacation"
              : status === "sick leave"
              ? "Sick Leave"
              : status === "weekend"
              ? "Weekend"
              : "Working"}
          </div>
        </div>

        {/* Holiday/Event Indicator */}
        {dayDetails?.holidayEvent && (
          <h5 className="font-medium text-md mt-2">{holidayEvent}</h5>
        )}

        {/* If this day is not Holiday or Weekend  */}
        {!["weekend", "holiday"].includes(status) && (
          <div className="mt-5">
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Fruits</SelectLabel>
                  <SelectItem value="working">Working</SelectItem>
                  <SelectItem value="vacation">Vacation</SelectItem>
                  <SelectItem value="sick_leave">Sick Leave</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DateStatus;
