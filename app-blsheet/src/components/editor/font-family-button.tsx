import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useEditorContext } from "./editor-provider";

const FontFamilyButton = () => {
  const { editor } = useEditorContext();

  const fonts = [
    { label: "Roboto Mono", value: "Roboto Mono" },
    { label: "Arial", value: "Arial" },
    { label: "Times New Roman", value: "Times New Roman" },
    { label: "Courier New", value: "Courier New" },
    { label: "Georgia", value: "Georgia" },
    { label: "Verdana", value: "Verdana" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "h-7 w-[120px] shrink-0 flex items-center justify-between rounded-sm hover:bg-primary/10 px-1.5 overflow-hidden text-sm"
          )}
        >
          <span
            className="truncate"
            style={{
              fontFamily:
                editor?.getAttributes("textStyle").fontFamily || "Roboto Mono",
            }}
          >
            {editor?.getAttributes("textStyle").fontFamily || "Roboto Mono"}
          </span>
          <ChevronDownIcon className="ml-2 size-4 shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {fonts.map(({ label, value }) => (
          <button
            onClick={() => editor?.chain().focus().setFontFamily(value).run()}
            key={value}
            className={cn(
              "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-primary/10 w-full",
              editor?.getAttributes("textStyle").fontFamily === value &&
                "bg-primary/10"
            )}
          >
            <span style={{ fontFamily: value }} className="text-sm">
              {label}
            </span>
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FontFamilyButton;
