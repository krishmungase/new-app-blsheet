import { useState } from "react";
import { LoaderCircle, Trash2 } from "lucide-react";

import { MemberRole } from "@/types";
import useProject from "@/hooks/use-project";

import Hint from "@/components/ui/hint";
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

import useDeleteKeyResult from "../hooks/use-delete-key-result";

interface DeleteProps {
  timeFrameId: string;
  projectId: string;
  objectiveId: string;
  keyResultId: string;
  refetch: () => void;
}

const Delete = ({
  projectId,
  timeFrameId,
  objectiveId,
  keyResultId,
  refetch,
}: DeleteProps) => {
  const { project } = useProject();
  const [open, setOpen] = useState(false);
  const { mutate, isLoading } = useDeleteKeyResult({
    callAfterSuccess: () => {
      refetch();
    },
  });

  const handleRemove = () => {
    mutate({ data: { timeFrameId, projectId, objectiveId, keyResultId } });
  };

  if (project?.role === MemberRole.MEMBER) return null;

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Hint label="Delete KR">
          <button
            className="text-red-500 hover:text-red-500/80"
            onClick={() => setOpen(true)}
          >
            <Trash2 size={15} />
          </button>
        </Hint>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Key Result?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this key result?
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
