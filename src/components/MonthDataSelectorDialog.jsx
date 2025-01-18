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

import { Calculator, CreditCard, Settings, Smile, User } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Badge } from "./ui/badge";
import Calendar from "react-calendar";

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
  } = useCalendar();

  const [activeStartDate, setActiveStartDate] = useState(new Date());
  const [singleData, setSingleData] = useState({
    date: "",
    status: "",
    workHour: 0,
    sickNote: "",
  });
  const [monthInfo, setMonthInfo] = useState({
    totalWorkingDays: 0,
    id: "",
  });

  const [submitData, setSubmitData] = useState([]);

  //   GET MONTH KEY AND NUMBER OF WORKING DAYS
  useEffect(() => {
    const { totalWorkingDays } = getWorkingDaysOfMonth(activeStartDate);
    const id = monthKeyGenerate(activeStartDate);

    setMonthInfo({
      totalWorkingDays,
      id,
    });
  }, [activeStartDate]);

  //   HANDLE INPUT CHANGE EVENT

  const handInputChange = (name, value) => {
    setSingleData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //   ADD SINGLE DATA TO FINAL DATA

  const addToSubmitData = () => {
    const updatedData = submitData.map((item) =>
      item?.date === singleData.date ? singleData : item
    );

    const exists = submitData.some((item) => item?.date === singleData.date);

    if (exists) {
      setSubmitData(updatedData);
    } else {
      setSubmitData([...submitData, singleData]);
    }
    setSingleData({
      date: "",
      status: "",
      workHour: 0,
      sickNote: "",
    });
  };

  //   Save Data

  const SubmitMonthData = useCallback(async () => {
    const { id, totalWorkingDays } = monthInfo;

    if (!id || !totalWorkingDays || submitData.length < 1) {
      return toast("Invalid Request!");
    }

    if (totalWorkingDays !== submitData.length)
      return toast("Please set All Date information!");

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
      handleCloseModal();
    }
  }, []);

  //   Handle Close Button Event

  const handleCloseModal = () => {
    setSubmitData([]);
    onClose();
    setSingleData({
      date: "",
      status: "",
      workHour: 0,
      sickNote: "",
    });
  };

  return (
    <Dialog open={open}>
      {/* <DialogTrigger asChild>
        <Button variant="outline">Select Date</Button>
      </DialogTrigger> */}
      <DialogContent className="sm:max-w-[600px] w-full">
        <DialogHeader>
          <DialogTitle>Select a date</DialogTitle>
          <DialogDescription>
            Choose a date from the calendar below.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Calendar
            onActiveStartDateChange={({ activeStartDate }) =>
              setActiveStartDate(activeStartDate)
            }
            onChange={(value) =>
              setSingleData({ date: moment(value).format("y-MM-DD") })
            }
            value={singleData?.date}
            tileDisabled={({ date }) =>
              checkHoliday(date) || date.getDay() === weekendDay
            }
            tileContent={({ date }) => tileContent(date)}
            className="w-full"
          />

          {submitData?.length > 0 && (
            <div className="border border-gray-300 rounded p-3 my-2">
              {submitData?.map((item, index) => {
                return (
                  <Badge key={index} variant="outline">
                    {moment(item?.date).format("DD")}
                  </Badge>
                );
              })}
            </div>
          )}

          <div className="border p-5 border-gray rounded my-3">
            {singleData?.date && (
              <span>Date: {moment(singleData?.date).format("YYYY-MM-DD")}</span>
            )}

            <DayStatusInputs
              data={singleData}
              handInputChange={handInputChange}
            />

            <div className="mt-3 flex justify-end">
              <Button type="button" onClick={addToSubmitData}>
                Add
              </Button>
            </div>
          </div>
        </div>
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
          <DialogClose asChild className="ml-3">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCloseModal}
            >
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MonthDataSelector;
