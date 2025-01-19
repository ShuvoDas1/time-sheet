import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CustomSelect = ({ value, setData, options, className, label }) => {
  return (
    <div>
      <Select value={value} onValueChange={setData}>
        <SelectTrigger className={className}>
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent>
          {options.map(({ key, title }, index) => {
            return (
              <SelectItem key={index} value={key}>
                {title}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CustomSelect;
