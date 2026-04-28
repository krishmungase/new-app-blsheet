import { useState } from "react";
import { useMutation } from "react-query";
import { LoaderCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { toast, useAuth } from "@/hooks";
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

import apis from "../../../apis";

interface DeleteTaskProps {
  projectId: string;
}

const DeleteProject = ({ projectId }: DeleteTaskProps) => {
  const { authToken } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const { isLoading, mutate } = useMutation({
    mutationFn: ({ data }: { data: { _id: string } }) =>
      apis.deleteProject({ authToken, data }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
      navigate("/");
    },
    onError: (err: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: err?.response?.data?.message,
      });
    },
    retry: false,
  });

  const handleRemove = () => {
    mutate({ data: { _id: projectId } });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button onClick={() => setOpen(true)} variant="destructive">
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Project?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this project?
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

export default DeleteProject;
