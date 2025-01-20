import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCalendar } from "@/context/CalendarContext";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { toast } from "sonner";
import moment from "moment";
import { Textarea } from "./ui/textarea";
import DayStatusInputs from "./DayStatusInputs";

const DayStatusUpdate = () => {
  const {
    statusList: { working, vacation, sickLeave },
    dayDetails,
    saveSingleDayStatus,
    monthKeyGenerate,
    setCalendarData,
    calendarData,
  } = useCalendar();

  const [submitData, setSubmitData] = useState({
    date: "",
    status: "",
    workHour: 0,
    sickNote: "",
  });

  useEffect(() => {
    let mount = true;
    if (dayDetails) {
      if (mount) {
        setSubmitData(dayDetails);
      }
    }

    return () => (mount = false);
  }, [dayDetails]);

  //   HANDLE INPUT CHANGE EVENT

  const handInputChange = (name, value) => {
    setSubmitData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //   SAVE DATA

  const handleSubmit = () => {
    const { date } = submitData;
    const month = new Date(date).getMonth();
    const year = new Date(date).getFullYear();
    const id = `${year}-${String(month + 1).padStart(2, "0")}`;
    const { status } = saveSingleDayStatus(id, {
      ...submitData,
      date: moment(date).format("y-MM-DD"),
    });
  };

  return (
    <div className="border border-gray rounded p-5">
      <h6 className="text-left text-sm">Work Status</h6>
      <hr />
      {/* INPUTS */}
      <DayStatusInputs data={submitData} handInputChange={handInputChange} />

      <Button onClick={handleSubmit} className="w-full mt-3  hover:bg-blue-600">
        Submit
      </Button>
    </div>
  );
};

export default DayStatusUpdate;
