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
import { useCalendar } from "../context/CalendarContext";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import CustomSelect from "./CustomSelect";

const DayStatusInputs = ({ data, handInputChange }) => {
  const {
    statusList: { working, vacation, sickLeave },
    dayDetails,
    saveSingleDayStatus,
  } = useCalendar();

  return (
    <div className="mt-5">
      <CustomSelect
        value={data?.status}
        setData={(value) => handInputChange("status", value)}
        className="w-full"
        label="Work Status"
        options={[
          { key: working, title: "Working" },
          { key: vacation, title: "Vacation" },
          { key: sickLeave, title: "Sick Leave" },
        ]}
      />

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
