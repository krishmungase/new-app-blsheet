import { useState } from "react";
import { Trash2, LoaderCircle } from "lucide-react";
import { useMutation } from "react-query";

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
import { toast, useAuth } from "@/hooks";
import useProject from "@/hooks/use-project";

import apis from "../apis";

interface DeleteTeamProps {
  docId: string;
  projectId: string;
  refetch: () => void;
}

const DeleteDoc = ({ projectId, docId, refetch }: DeleteTeamProps) => {
  const { authToken } = useAuth();
  const { project } = useProject();
  const [open, setOpen] = useState(false);

  const { mutate, isLoading } = useMutation({
    mutationFn: () => apis.deleteDoc({ authToken, data: { docId, projectId } }),
    onSuccess: () => {
      toast({
        content: "Document deleted successfully",
        title: "Success",
      });
      refetch();
    },
    onError: (err: any) => {
      toast({
        title: "error",
        content: err?.response?.data?.message,
        variant: "destructive",
      });
    },
    retry: false,
  });

  const handleRemove = () => {
    mutate();
  };

  if (project?.role === MemberRole.MEMBER) return null;

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <button
          onClick={() => setOpen(true)}
          className="text-red-500 hover:text-red-500/80 transition-all"
        >
          <Trash2 size={15} />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Document?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this document?
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

export default DeleteDoc;
