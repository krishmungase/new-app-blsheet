import { useState } from "react";
import { LoaderCircle } from "lucide-react";

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

import useDeleteLabel from "../hooks/use-delete-label";

interface DeleteLabel {
  labelId: string;
  projectId: string;
  refetch: () => void;
}

const DeleteLabel = ({ labelId, projectId, refetch }: DeleteLabel) => {
  const { project } = useProject();
  const [open, setOpen] = useState(false);
  const { mutate, isLoading } = useDeleteLabel({
    callAfterSuccess: () => {
      refetch();
    },
  });

  const handleRemove = () => {
    mutate({ data: { lableId: labelId, projectId } });
  };

  if (project?.role === MemberRole.MEMBER) return null;

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          onClick={() => setOpen(true)}
          variant="outline"
          className="text-red-500 hover:text-white hover:bg-red-500 transition-all"
          size="xs"
        >
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete label?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this label?
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

export default DeleteLabel;
