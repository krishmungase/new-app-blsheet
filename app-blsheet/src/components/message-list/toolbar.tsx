import {
  Trash,
  MessageSquare,
  Pencil,
  Smile,
  Loader2,
  LoaderCircle,
} from "lucide-react";

import Hint from "../ui/hint";
import { Button } from "../ui/button";
import EmojiPopover from "../shared/emoji-popover";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface ToolbarProps {
  handleEdit: () => void;
  handleDelete: () => void;
  handleReaction: (emoji: string) => void;
  handleThread: () => void;
  hideThreadButton: boolean;
  isCreator: boolean;
  loadingDeleteMessage: boolean;
}

const Toolbar = ({
  handleEdit,
  handleDelete,
  handleReaction,
  handleThread,
  hideThreadButton,
  isCreator,
  loadingDeleteMessage,
}: ToolbarProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="absolute top-0 right-5">
      <div className="group-hover:opacity-100 opacity-0 transition-opacity rounded-md shadow-sm bg-muted border">
        <EmojiPopover
          hint="Add reaction"
          onEmojiSelect={(emoji: any) => handleReaction(emoji.native)}
        >
          <Button size="iconSm" variant="ghost">
            <Smile className="size-4" />
          </Button>
        </EmojiPopover>
        {!hideThreadButton && (
          <Hint label="Reply in thread">
            <Button size="iconSm" variant="ghost" onClick={handleThread}>
              <MessageSquare className="size-4" />
            </Button>
          </Hint>
        )}
        {isCreator && (
          <>
            <Hint label="Edit message">
              <Button size="iconSm" variant="ghost" onClick={handleEdit}>
                <Pencil className="size-4" />
              </Button>
            </Hint>
            <Hint label="Delete message">
              <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogTrigger asChild>
                  <Button size="iconSm" variant="ghost">
                    {loadingDeleteMessage ? (
                      <Loader2 className="animate-spin size-4" />
                    ) : (
                      <Trash className="size-4" />
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Message?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this message?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setOpen(false)}>
                      Cancel
                    </AlertDialogCancel>
                    <Button variant="destructive" onClick={handleDelete}>
                      {loadingDeleteMessage && (
                        <LoaderCircle className="ml-2 size-4 animate-spin" />
                      )}
                      <span> Delete</span>
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </Hint>
          </>
        )}
      </div>
    </div>
  );
};

export default Toolbar;
