import { useToggle } from "react-use";
import { Button } from "@/components";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Loader2, Plus } from "lucide-react";
import { ReactNode } from "react";
import { FaCaretDown } from "react-icons/fa";
import { cn } from "@/lib/utils";
import useProject from "@/hooks/use-project";
import { MemberRole } from "@/types";

interface ChatSectionProps {
  label: string;
  hint: string;
  onNew?: () => void;
  children: ReactNode;
  isLoading: boolean;
  isDM: boolean;
}

const ChatSection = ({
  label,
  hint,
  onNew,
  children,
  isLoading,
  isDM,
}: ChatSectionProps) => {
  const { project } = useProject();
  const [on, toggle] = useToggle(true);

  return (
    <div className="flex flex-col mt-2 px-2">
      <div className="flex items-center px-3.5 group">
        <Button
          variant="transparent"
          className="p-05. text-sm text-muted-foreground shrink-0 size-6"
          onClick={toggle}
        >
          <FaCaretDown
            className={cn("size-4 transition-transform", on && "-rotate-90")}
          />
        </Button>
        <Button
          variant="transparent"
          size="sm"
          className="group px-1.5 text-sm text-muted-foreground h-[28px] justify-start overflow-hidden hover:bg-transparent"
        >
          {label}
        </Button>
        {((project?.role !== MemberRole.MEMBER && !isDM) || isDM) && (
          <Tooltip>
            <TooltipContent className="text-xs">{hint}</TooltipContent>
            <TooltipTrigger asChild>
              <Button
                variant="transparent"
                size="iconSm"
                className="opacity-0 size-6 shrink-0 group-hover:opacity-100 transition-opacity ml-auto p-0.5 text-sm text-muted-foreground"
                onClick={onNew}
              >
                <Plus />
              </Button>
            </TooltipTrigger>
          </Tooltip>
        )}
      </div>
      {isLoading && (
        <div className="flex items-center justify-center gap-1">
          <Loader2 size={5} className="animate-spin" />
          <span className="text-[8px]">{label}</span>
        </div>
      )}
      {on && children}
    </div>
  );
};

export default ChatSection;
