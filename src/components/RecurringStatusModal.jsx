import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useCallback, useEffect, useState } from "react";
import moment from "moment";
import DayStatusInputs from "./DayStatusInputs";
import { useCalendar } from "@/context/CalendarContext";
import { toast } from "sonner";

import { Badge } from "./ui/badge";
import Calendar from "react-calendar";
import { Briefcase, Heart, Plane } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import CustomSelect from "./CustomSelect";

const daysList = [
  { title: "Monday", value: 1 },
  { title: "Tuesday", value: 2 },
  { title: "Wednesday ", value: 3 },
  { title: "Thursday ", value: 4 },
  { title: "Friday", value: 5 },
  { title: "Saturday ", value: 6 },
];

const RecurringStatus = ({ open, onClose }) => {
  const {
    loading,
    currentMonth,
    monthKeyGenerate,
    statusList: { working, vacation, sickLeave },
    fetchMonthData,
    updateData,
    saveData,
  } = useCalendar();

  const [dayStatus, setDayStatus] = useState({
    day: "",
    status: "",
  });

  //   HANDLE INPUT CHANGE EVENT

  const handInputChange = (name, value) => {
    setDayStatus((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //   Handle Close Button Event

  const handleCloseModal = useCallback(() => {
    onClose();
    setDayStatus({
      day: "",
      status: "",
    });
  }, [setDayStatus, onClose]);

  // GET A DAY FOR EVERY WEEK OF SELECTED MONTH
  const getDayForEveryWeek = useCallback(() => {
    const id = monthKeyGenerate(currentMonth);
    const { day, status } = dayStatus;
    const startOfMonth = moment(id).startOf("month");
    const endOfMonth = moment(id).endOf("month");

    const result = [];
    let current = startOfMonth.clone();

    while (current.isBefore(endOfMonth)) {
      const dayOfWeek = current.clone().day(day);

      // Ensure the target day is within the same month
      if (
        dayOfWeek.isSameOrAfter(startOfMonth) &&
        dayOfWeek.isSameOrBefore(endOfMonth)
      ) {
        result.push({
          date: dayOfWeek.format("YYYY-MM-DD"),
          status: status,
        });
      }

      // Move to the next week
      current.add(1, "week");
    }
    return result;
  }, [currentMonth, dayStatus, monthKeyGenerate]);

  //  HANDLE SUBMIT BUTTON EVENT
  const handleSubmitData = useCallback(async () => {
    const { day, status } = dayStatus;
    const id = monthKeyGenerate(currentMonth);

    if (!status || !day) {
      return toast("Please Select Status/Day");
    }
    if (!currentMonth) {
      return toast("Month was not found!");
    }
    const requestData = getDayForEveryWeek();

    const { data } = await fetchMonthData(id);
    let success = false;

    if (data && data?.days.length > 0) {
      const existingData = [...data.days];

      requestData.forEach((item) => {
        const itemIndex = existingData.findIndex(
          (old) => old.date === item?.date
        );
        if (itemIndex !== -1) existingData[itemIndex] = item;
        else existingData.push(item);
      });
      const { responseStatus } = await updateData({ id, days: existingData });
      success = responseStatus;
    } else {
      const { responseStatus } = await saveData({ id, days: requestData });
      success = responseStatus;
    }
    if (success) {
      handleCloseModal();
    }
  }, [
    dayStatus,
    currentMonth,
    getDayForEveryWeek,
    fetchMonthData,
    updateData,
    saveData,
    handleCloseModal,
    monthKeyGenerate,
  ]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] w-full">
        <DialogHeader>
          <DialogTitle>Select a Day</DialogTitle>
          <DialogDescription>Choose a date from the List.</DialogDescription>
        </DialogHeader>
        <div>
          <RadioGroup onValueChange={(value) => handInputChange("day", value)}>
            {daysList.map(({ title, value }, index) => {
              return (
                <div className="flex items-center space-x-2" key={index}>
                  <RadioGroupItem
                    value={value}
                    id={title}
                    className="p-0 dark:bg-gray-800 dark:checked:bg-blue-500 dark:border-gray-600"
                  />
                  <Label htmlFor={title}>{title}</Label>
                </div>
              );
            })}
          </RadioGroup>
          <CustomSelect
            value={dayStatus?.status}
            setData={(value) => handInputChange("status", value)}
            className="w-full mt-4"
            label="Work Status"
            options={[
              { key: working, title: "Working" },
              { key: vacation, title: "Vacation" },
              { key: sickLeave, title: "Sick Leave" },
            ]}
          />
        </div>
        <DialogFooter className="flex">
          <div className="flex-1">
            <Button
              type="button"
              onClick={handleSubmitData}
              className="w-full"
              // disabled={monthInfo?.totalWorkingDays !== submitData.length}
            >
              {loading ? "Loading..." : "Submit"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RecurringStatus;
