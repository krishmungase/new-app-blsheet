import { cn } from "@/lib/utils";
import { SketchPicker, type ColorResult } from "react-color";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useEditorContext } from "./editor-provider";
import { HighlighterIcon } from "lucide-react";

const HighlightTextButton = () => {
  const { editor } = useEditorContext();
  const color = editor?.getAttributes("highlight").color || "#ffffff";

  const onChange = (color: ColorResult) => {
    editor?.chain().focus().setHighlight({ color: color.hex }).run();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "h-7 min-w-7 shrink-0 flex items-center flex-col justify-center rounded-sm hover:bg-primary/10 px-1.5 overflow-hidden text-sm"
          )}
        >
          <HighlighterIcon className={"size-4"} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <SketchPicker color={color} onChange={onChange} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HighlightTextButton;
