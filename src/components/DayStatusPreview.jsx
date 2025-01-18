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
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "./ui/command";

const DayStatusPreview = () => {
  const { dayDetails } = useCalendar();
  return (
    <Card className="shadow-md rounded-lg border border-gray-300">
      <CardHeader>
        <CardTitle>Day Preview</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {/* Date And Status */}
        <Command className="rounded-lg border shadow-md w-full">
          <CommandList>
            <CommandGroup>
              {[
                {
                  title: "Selected Date",
                  value: moment(dayDetails?.date).format("MMMM Do YYYY"),
                },
                { title: "Status", value: dayDetails?.status || "No Event" },
              ].map(({ title, value }, index) => {
                return (
                  <CommandItem key={index}>
                    <span>{title}</span>
                    <CommandShortcut>{value}</CommandShortcut>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>

        {/* Holiday/Event Indicator */}
        {dayDetails?.holidayEvent && (
          <h5 className="font-medium text-md mt-2">
            {dayDetails?.holidayEvent}
          </h5>
        )}

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
