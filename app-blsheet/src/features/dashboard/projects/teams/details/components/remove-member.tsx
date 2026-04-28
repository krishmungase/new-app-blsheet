import { useState } from "react";
import { useMutation } from "react-query";
import { Trash2, LoaderCircle } from "lucide-react";

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

import apis from "../../apis";
import { useTeamContext } from "../provider/team-provider";

interface RemoveMemberProps {
  teamId: string;
  projectId: string;
  memberId: string;
}

const RemoveMember = ({ projectId, teamId, memberId }: RemoveMemberProps) => {
  const { refetchTeam } = useTeamContext();
  const { authToken } = useAuth();
  const [open, setOpen] = useState(false);

  const { isLoading, mutate } = useMutation({
    mutationFn: ({ data }: any) =>
      apis.addOrRemoveTeamMember({ authToken, data }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Member removed successfully",
      });
      refetchTeam();
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
    mutate({ data: { projectId, teamId, memberId, isRemove: true } });
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
          <AlertDialogTitle>Remove Member?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove this member?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>
            Cancel
          </AlertDialogCancel>
          <Button variant="destructive" onClick={handleRemove}>
            {isLoading && <LoaderCircle className="ml-2 size-4 animate-spin" />}
            <span> Remove</span>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RemoveMember;
