import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCalendar } from "@/context/CalendarContext";
import { ButtonWithTooltip } from "./ButtonWithTooltip";
import { Gift, Umbrella, Briefcase, Heart, Plane } from "lucide-react";
import MonthDataSelector from "./MonthDataSelectorDialog";

// import { Calendar } from "@/components/ui/calendar";

const allStatus = [
  {
    title: "Weekend",
    icon: <Umbrella className="text-yellow-500 w-6 h-6" />,
  },
  {
    title: "Holiday",
    icon: <Gift className="text-blue-500 w-6 h-6" />,
  },
  {
    title: "Working",
    icon: <Briefcase className="text-green-500  w- h-6" />,
  },
  {
    title: "Vacation",
    icon: <Plane className="text-indigo-500 w-6 h-6" />,
  },
  {
    title: "Sick Leave",
    icon: <Heart className="text-red-500 w-6 h-6" />,
  },
];

const MonthlyCalender = ({
  value,
  onChange,
  tileContent,
  selectMonth,
  setAllAsWorkingDay,
}) => {
  const { checkHoliday, setCurrentMonth } = useCalendar();

  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-wrap justify-between items-center">
            {/* Left Section: Title */}
            <div className="flex-1 text-left mb-2 sm:mb-0">
              <CardTitle>Work Calendar</CardTitle>
            </div>

            {/* Right Section: Buttons */}
            <div className="flex flex-wrap justify-end flex-1 gap-2">
              <ButtonWithTooltip
                buttonName="Set as All Working Day"
                tooltipTitle="Exclude Holiday and Weekend"
                onClick={setAllAsWorkingDay}
                Icon={<Briefcase className="text-green-500  w-6 h-6" />}
              />
              <ButtonWithTooltip
                buttonName="Set Monthly Data"
                tooltipTitle="Exclude Holiday and Weekend"
                onClick={() => {
                  setOpenModal((prev) => !prev);
                }}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Calendar
            onActiveStartDateChange={selectMonth}
            onChange={onChange}
            value={value}
            tileClassName={({ date }) =>
              checkHoliday(date) ? "weekend-tile" : ""
            }
            tileContent={tileContent}
            className="rounded"
          />
          {/* Status List with icon */}
          <div className="flex flex-wrap justify-between items-center my-6">
            {allStatus.map(({ title, icon }, index) => {
              return (
                <div
                  key={index}
                  className="flex justify-start items-center mt-4"
                >
                  {icon}
                  <span className="ml-1">{title}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      {/* MONTHLY WORKING DAYS STATUS MODAL */}
      <MonthDataSelector open={openModal} onClose={() => setOpenModal(false)} />
    </>
  );
};

export default MonthlyCalender;
