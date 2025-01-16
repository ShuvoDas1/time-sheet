import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import MonthlyCalender from "@/components/MonthlyCalender";
import { handler } from "tailwindcss-animate";

const EmployWorkSchedule = () => {
  const [value, setValue] = useState(new Date());

  // Formate date ex: d-m-y
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
  };

  // Calender on change event
  const handlerDateChange = (date) => {
    const selectedDate = formatDate(date);
    console.log(selectedDate);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Work Status</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <MonthlyCalender
          value={value}
          onChange={(value) => handlerDateChange(value)}
        />
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  );
};

export default EmployWorkSchedule;
