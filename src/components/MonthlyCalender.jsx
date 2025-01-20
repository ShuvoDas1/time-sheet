import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCalendar } from "@/context/CalendarContext";
import { ButtonWithTooltip } from "./ButtonWithTooltip";
import {
  Gift,
  Umbrella,
  Briefcase,
  Heart,
  Plane,
  RotateCw,
  Repeat,
  CalendarArrowDown,
} from "lucide-react";
import MonthDataSelector from "./MonthWorkStatusDialog";
import RecurringStatus from "./RecurringStatusModal";

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
  const [openRecurringModal, setRecurringOpenModal] = useState(false);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-wrap justify-between items-center">
            {/* Left Section: Title */}
            <div className="w-[100] text-left mb-2 sm:mb-0">
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
                buttonName="Set This Month Work Status"
                tooltipTitle="Set all days work status of this month"
                onClick={() => {
                  setOpenModal((prev) => !prev);
                }}
                Icon={
                  <CalendarArrowDown className="text-purple-500  w-6 h-6" />
                }
              />
              <ButtonWithTooltip
                buttonName="Set Recurring Status"
                tooltipTitle="Set Recurring work status of this month"
                onClick={() => {
                  setRecurringOpenModal((prev) => !prev);
                }}
                Icon={<Repeat className="text-blue-500  w-6 h-6" />}
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
                  className="flex justify-start items-center mt-4  text-sm"
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
      {/* RECURRING STATUS ET MODAL */}
      <RecurringStatus
        open={openRecurringModal}
        onClose={() => setRecurringOpenModal(false)}
      />
    </>
  );
};

export default MonthlyCalender;
