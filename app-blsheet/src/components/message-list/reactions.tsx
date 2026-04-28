import { cn } from "@/lib/utils";
import { Reaction } from "@/types";
import { MdOutlineAddReaction } from "react-icons/md";

import EmojiPopover from "../shared/emoji-popover";

interface ReactionProps {
  reactions: Reaction[];
  handleReaction: (data: any) => void;
  memberId: string;
}

const Reactions = ({ reactions, memberId, handleReaction }: ReactionProps) => {
  if (!reactions.length) return null;

  return (
    <div className="flex items-center gap-1 my-1">
      {reactions.map((reaction, i) => (
        <button
          onClick={() => handleReaction(reaction.value)}
          key={i}
          className={cn(
            "h-6 px-2 rounded-full bg-muted border flex items-center gap-x-1 border-muted-foreground",
            reaction.memberIds.includes(memberId) &&
              "bg-primary/50 border-transparent"
          )}
        >
          {reaction.value}
          <span
            className={cn(
              "text-xs font-semibold",
              reaction.memberIds.includes(memberId) && "text-primary"
            )}
          >
            {reaction.count}
          </span>
        </button>
      ))}

      <EmojiPopover
        hint="Add emoji"
        onEmojiSelect={(emoji: any) => handleReaction(emoji.native)}
      >
        <button className="h-7 px-3 rounded-full">
          <MdOutlineAddReaction className="size-4" />
        </button>
      </EmojiPopover>
    </div>
  );
};

export default Reactions;
