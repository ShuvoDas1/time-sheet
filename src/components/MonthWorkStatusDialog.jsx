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
import { ButtonWithTooltip } from "./ButtonWithTooltip";

const MonthDataSelector = ({ open, onClose }) => {
  const {
    getWorkingDaysOfMonth,
    fetchMonthData,
    updateData,
    checkHoliday,
    calendarData: { weekendDay },
    tileContent,
    loading,
    saveData,
    monthKeyGenerate,
    currentMonth,
    setCurrentMonth,
    statusList: { working, vacation, sickLeave },
  } = useCalendar();

  const [selectedDates, setSelectedDates] = useState([]);
  const [workStatus, setWorkStatus] = useState({
    status: "",
    workHour: 0,
    sickNote: "",
  });

  const [submitData, setSubmitData] = useState([]);
  const [monthInfo, setMonthInfo] = useState({
    totalWorkingDays: 0,
    id: "",
  });

  useEffect(() => {
    let mount = true;
    if (mount) {
      setSubmitData([]);

      setWorkStatus({
        status: "",
        workHour: 0,
        sickNote: "",
      });
      setSelectedDates([]);
    }

    return () => (mount = false);
  }, [onClose]);

  // SET MONTH INFORATION
  useEffect(() => {
    if (currentMonth) {
      const { totalWorkingDays } = getWorkingDaysOfMonth(currentMonth);
      const id = monthKeyGenerate(currentMonth);
      setMonthInfo({
        id,
        totalWorkingDays,
      });
    }
  }, [currentMonth]);

  // HANDLE DATE SELECTION
  const handleDateSelect = (date) => {
    const dateString = moment(date).format("Y-MM-DD");

    if (selectedDates.includes(dateString)) {
      setSelectedDates((prevDates) =>
        prevDates.filter((date) => date !== dateString)
      );
    } else {
      setSelectedDates((prevDates) => [...prevDates, dateString]);
    }
  };

  // STATUS INPUT CHANGE EVENT
  const handleStatusInputs = (name, value) => {
    setWorkStatus((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // HANDLE SELECTED DATES ADD TO SUBMIT DATA

  const addToSubmitData = () => {
    if (!selectedDates.length || !workStatus?.status) {
      return toast("Select Date and Work Status First!");
    }

    const finalDate = selectedDates.map((date) => ({
      ...workStatus,
      date,
    }));

    setSubmitData((prev) => [...prev, ...finalDate]);
    setSelectedDates([]);
    setWorkStatus({
      status: "",
      workHour: 0,
      sickNote: "",
    });
  };

  // Highlight selected dates
  const tileClassName = ({ date }) => {
    const dateString = moment(date).format("Y-MM-DD");
    let className = null;
    if (selectedDates.includes(dateString)) className = "selected_item";
    else if (checkHoliday(date) || date.getDay() === weekendDay) {
      className = "holiday_weekend_item";
    } else {
      className = "not_selected_item";
    }
    return className;
  };

  // DISABLE TILE IF ITS ALREADY SELECTED

  const tileDisabled = ({ date }) => {
    const formattedDate = moment(date).format("Y-MM-DD");
    let disable = false;
    if (checkHoliday(date) || date.getDay() === weekendDay) disable = true;
    else {
      const isExist = submitData.find((item) => item?.date === formattedDate);
      if (isExist) disable = true;
    }

    return disable;
  };

  // SET TILE ICON BY STATUS
  const getTileContent = (status) => {
    let icon = null;

    if (status === working) {
      icon = <Briefcase className="text-green-500 w-4 h-4" />;
    } else if (status === vacation) {
      icon = <Plane className="text-indigo-500 w-4 h-4" />;
    } else if (status === sickLeave) {
      icon = <Heart className="text-red-500 w-4 h-4" />;
    }

    return icon;
  };

  // REMOVE ITEM FROM SUBMIT DATA
  const removeItem = (item) => {
    const updatedData = submitData.filter((data) => data?.date !== item?.date);
    setSubmitData(updatedData);
  };

  //    Save Data

  const SubmitMonthData = useCallback(async () => {
    const { totalWorkingDays, id } = monthInfo;

    if (!id || !totalWorkingDays || submitData.length < 1) {
      return toast("Invalid Request!");
    }

    if (totalWorkingDays !== submitData.length)
      return toast("You haven’t marked all workdays!");

    const { status } = await fetchMonthData(id);
    let success = false;
    if (status) {
      const { responseStatus } = await updateData({ id, days: submitData });
      success = responseStatus;
    } else {
      const { responseStatus } = await saveData({ id, days: submitData });
      success = responseStatus;
    }

    if (success) {
      onClose();
    }
  }, [submitData]);

  return (
    <Dialog
      open={open}
      onOpenChange={onClose}
      className="month_work_status_container"
    >
      <DialogContent className="sm:max-w-[600px] w-full">
        <DialogHeader>
          <DialogTitle>Select date</DialogTitle>
          <DialogDescription>
            Choose multiple from the calendar below.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Calendar
            onClickDay={handleDateSelect}
            tileClassName={tileClassName}
            tileDisabled={tileDisabled}
            onActiveStartDateChange={({ activeStartDate }) =>
              setCurrentMonth(activeStartDate)
            }
          />
          <DayStatusInputs
            handInputChange={handleStatusInputs}
            data={workStatus}
          />

          <div className="mt-3 flex justify-end">
            <Button
              type="button"
              onClick={addToSubmitData}
              disabled={!selectedDates?.length || !workStatus?.status}
            >
              Add
            </Button>
          </div>
        </div>

        {submitData?.length > 0 && (
          <div className="border border-gray-300 rounded p-3 my-2">
            {submitData?.map((item, index) => {
              return (
                <Badge key={index} variant="outline" className="p-1 mr-1">
                  {getTileContent(item?.status)}
                  {moment(item?.date).format("DD")}
                  <ButtonWithTooltip
                    buttonName="&times;"
                    className="w-5 h-5 ml-2"
                    onClick={() => removeItem(item)}
                  />
                </Badge>
              );
            })}
          </div>
        )}

        <DialogFooter className="flex">
          <div className="flex-1">
            <Button
              type="button"
              onClick={SubmitMonthData}
              className="w-full"
              disabled={monthInfo?.totalWorkingDays !== submitData.length}
            >
              {loading ? "Loading..." : "Submit"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MonthDataSelector;
