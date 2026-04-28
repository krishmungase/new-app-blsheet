import { useState } from "react";
import { LoaderCircle, Delete } from "lucide-react";

import { Button } from "@/components";
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

import { MemberRole } from "@/types";
import useProject from "@/hooks/use-project";

import useDeleteChannel from "../hooks/use-delete-channel";

interface DeleteChannelProps {
  channelId: string;
  projectId: string;
}

const DeleteChannel = ({ projectId, channelId }: DeleteChannelProps) => {
  const { project } = useProject();
  const [open, setOpen] = useState(false);
  const { mutate, isLoading } = useDeleteChannel();

  const handleRemove = () => {
    mutate({ data: { channelId, projectId } });
  };

  if (project?.role === MemberRole.MEMBER) return null;

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <button
          className="hover:bg-red-100 hover:text-red-500 rounded-md cursor-pointer flex items-center gap-1 px-2 py-1"
          onClick={() => setOpen(true)}
        >
          <Delete size={12} />
          <span className="text-sm">Delete</span>
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Channel?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this channel?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>
            Cancel
          </AlertDialogCancel>
          <Button variant="destructive" onClick={handleRemove}>
            {isLoading && <LoaderCircle className="ml-2 size-4 animate-spin" />}
            <span> Delete</span>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteChannel;
