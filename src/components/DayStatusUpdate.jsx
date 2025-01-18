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

const DayStatusUpdate = () => {
  const {
    statusList: { working, vacation, sickLeave },
    dayDetails,
    saveSingleDayStatus,
  } = useCalendar();

  const [submitData, setSubmitData] = useState({
    date: new Date(),
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

  const saveData = () => {
    const { date } = submitData;
    const month = new Date(date).getMonth();
    const year = new Date(date).getFullYear();
    const id = `${year}-${String(month + 1).padStart(2, "0")}`;
    const { status } = saveSingleDayStatus(id, {
      ...submitData,
      date: moment(date).format("Y-MM-DD"),
    });
  };

  return (
    <div>
      <Select
        value={submitData?.status}
        required
        onValueChange={(value) => handInputChange("status", value)}
        name="status"
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            <SelectItem value={working}>Working</SelectItem>
            <SelectItem value={vacation}>Vacation</SelectItem>
            <SelectItem value={sickLeave}>Sick Leave</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      {submitData?.status === working && (
        <Input
          className="mt-3"
          type="number"
          name="workHour"
          id="workHour"
          min={1}
          placeholder="Enter Work Hour (Optional)"
          onChange={(event) => handInputChange("workHour", event.target.value)}
          value={submitData?.workHour || ""}
        />
      )}

      {submitData?.status === sickLeave && (
        <Textarea
          className="mt-3"
          name="sickNote"
          id="sickNote"
          placeholder="Enter Note"
          onChange={(event) => handInputChange("sickNote", event.target.value)}
          value={submitData?.sickNote || ""}
        />
      )}

      <Button onClick={saveData} className="w-full mt-3  hover:bg-blue-600">
        Submit
      </Button>
    </div>
  );
};

export default DayStatusUpdate;
