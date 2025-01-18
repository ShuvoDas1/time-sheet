import React, { useCallback, useContext, useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCalendar } from "@/context/CalendarContext";
import { ButtonWithTooltip } from "./ButtonWithTooltip";
import { Gift, Umbrella, Briefcase, Heart, Plane } from "lucide-react";
import moment from "moment";
import MonthDataSelector from "./MonthDataSelectorDialog";

// import { Calendar } from "@/components/ui/calendar";

const MonthlyCalender = ({
  value,
  onChange,
  tileContent,
  selectMonth,
  setAllAsWorkingDay,
}) => {
  const { checkHoliday, dayDetails } = useCalendar();

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
              />
              <ButtonWithTooltip
                buttonName="Set Monthly Data"
                tooltipTitle="Exclude Holiday and Weekend"
                onClick={() => setOpenModal((prev) => !prev)}
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
          />
        </CardContent>
      </Card>
      {/* MONTHLY WORKING DAYS STATUS MODAL */}
      <MonthDataSelector open={openModal} onClose={() => setOpenModal(false)} />
    </>
  );
};

export default MonthlyCalender;
