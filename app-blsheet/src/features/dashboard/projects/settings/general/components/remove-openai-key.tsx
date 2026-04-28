import { useState } from "react";
import { useMutation } from "react-query";
import { LoaderCircle, Trash2 } from "lucide-react";
import { Button } from "@/components";
import { toast, useAuth } from "@/hooks";

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

interface RemoveOpenAIKeyProps {
  projectId: string;
  refetchProject: () => void;
}

const RemoveOpenAIKey = ({
  projectId,
  refetchProject,
}: RemoveOpenAIKeyProps) => {
  const { authToken } = useAuth();
  const [open, setOpen] = useState(false);

  const { isLoading, mutate } = useMutation({
    mutationFn: ({ data }: { data: { projectId: string } }) =>
      apis.removeOpenAIKey({ authToken, data }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "OpenAI Key removed successfully",
      });
      setOpen(false);
      refetchProject();
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
    mutate({ data: { projectId } });
  };

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
          <AlertDialogTitle>Remove OpenAI Key?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove openai key?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>
            Cancel
          </AlertDialogCancel>
          <Button variant="destructive" onClick={handleRemove}>
            {isLoading && <LoaderCircle className="ml-2 size-4 animate-spin" />}
            <span>Remove</span>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RemoveOpenAIKey;
