import { useState } from "react";
import { useMutation } from "react-query";
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

import { DocStatus } from "@/types";
import { toast, useAuth } from "@/hooks";

import apis from "../../apis";

interface DeleteTeamProps {
  docId: string;
  projectId: string;
  refetch: () => void;
}

const PublishDoc = ({ projectId, docId, refetch }: DeleteTeamProps) => {
  const { authToken } = useAuth();
  const [open, setOpen] = useState(false);

  const { mutate, isLoading } = useMutation({
    mutationFn: () =>
      apis.updateDoc({
        authToken,
        data: { docId, projectId, status: DocStatus.PUBLISHED },
      }),
    onSuccess: () => {
      toast({
        description: "Document published successfully",
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

  const handePublish = () => {
    mutate();
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size="sm" className="w-full text-xs">
          Publish Document
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Publish Document</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to publish this document?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>
            Cancel
          </AlertDialogCancel>
          <Button onClick={handePublish}>
            {isLoading && <LoaderCircle className="ml-2 size-4 animate-spin" />}
            <span> Publish </span>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PublishDoc;
