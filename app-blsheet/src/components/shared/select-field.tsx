import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Options } from "@/types";
import { Loader2 } from "lucide-react";

interface SelectField {
  field: any;
  options: Options[];
  placeholder?: string;
  isLoading?: boolean;
}

const SelectField = ({
  field,
  options,
  placeholder,
  isLoading,
}: SelectField) => {
  return (
    <div className="w-full relative">
      {placeholder && (
        <h1 className="mb-2 text-[14px] font-medium tracking-wider">
          {placeholder}
        </h1>
      )}
      {isLoading ? (
        <div className="flex items-center justify-center py-2">
          <Loader2 className="animate-spin" /> Fetching...
        </div>
      ) : (
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <SelectTrigger className="focus-visible:ring-transparent w-full">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            {options.map((op) => (
              <SelectItem
                key={op.value}
                className="cursor-pointer"
                value={op.value}
              >
                {op.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default SelectField;
