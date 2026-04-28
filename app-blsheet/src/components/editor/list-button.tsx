import { cn } from "@/lib/utils";
import { ListIcon, ListOrderedIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useEditorContext } from "./editor-provider";

const ListButton = () => {
  const { editor } = useEditorContext();
  const alignments = [
    {
      label: "Bullet List",
      icon: ListIcon,
      isActive: editor?.isActive("bulletList"),
      onClick: () => editor?.chain().focus().toggleBulletList().run(),
    },
    {
      label: "Ordered List",
      icon: ListOrderedIcon,
      isActive: editor?.isActive("orderedList"),
      onClick: () => editor?.chain().focus().toggleOrderedList().run(),
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "h-7 min-w-7 shrink-0 flex items-center justify-center rounded-sm hover:bg-primary/10 px-1.5 overflow-hidden text-sm"
          )}
        >
          <ListIcon className="size-4 shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {alignments.map(({ label, isActive, onClick, icon: Icon }) => (
          <button
            onClick={onClick}
            key={label}
            className={cn(
              "flex items-center gap-x-2 p-1 rounded-sm hover:bg-primary/10 w-full",
              isActive && "bg-primary/10"
            )}
          >
            <Icon className="size-4" />
            <span className="text-sm">{label}</span>
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ListButton;
