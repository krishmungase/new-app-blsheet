import { useState } from "react";
import { LoaderCircle, Trash2 } from "lucide-react";

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

import useDeleteObjective from "../hooks/use-delete-objective";

interface DeleteProps {
  timeFrameId: string;
  projectId: string;
  objectiveId: string;
  refetch: () => void;
}

const Delete = ({
  projectId,
  timeFrameId,
  objectiveId,
  refetch,
}: DeleteProps) => {
  const { project } = useProject();
  const [open, setOpen] = useState(false);
  const { mutate, isLoading } = useDeleteObjective({
    callAfterSuccess: () => {
      refetch();
    },
  });

  const handleRemove = () => {
    mutate({ data: { timeFrameId, projectId, objectiveId } });
  };

  if (project?.role === MemberRole.MEMBER) return null;

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <button
          className="text-red-500 hover:text-red-500/80"
          onClick={() => setOpen(true)}
        >
          <Trash2 size={15} />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Objective?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this objective?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>
            Cancel
          </AlertDialogCancel>
          <Button variant="destructive" onClick={handleRemove}>
            {isLoading && <LoaderCircle className="ml-2 size-4 animate-spin" />}
            <span>Delete</span>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Delete;
