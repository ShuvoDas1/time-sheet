import React from "react";
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
import { Textarea } from "./ui/textarea";

const DayStatusInputs = ({ data, handInputChange }) => {
  const {
    statusList: { working, vacation, sickLeave },
    dayDetails,
    saveSingleDayStatus,
  } = useCalendar();

  return (
    <div className="mt-5">
      <Select
        value={data?.status || ""}
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

      {data?.status === working && (
        <Input
          className="mt-3"
          type="number"
          name="workHour"
          id="workHour"
          min={1}
          placeholder="Enter Work Hour (Optional)"
          onChange={(event) => handInputChange("workHour", event.target.value)}
          value={data?.workHour || ""}
        />
      )}

      {data?.status === sickLeave && (
        <Textarea
          className="mt-3"
          name="sickNote"
          id="sickNote"
          placeholder="Enter Note"
          onChange={(event) => handInputChange("sickNote", event.target.value)}
          value={data?.sickNote || ""}
        />
      )}
    </div>
  );
};

export default DayStatusInputs;
