import { useMutation } from "react-query";
import { toast, useAuth } from "@/hooks";
import apis from "../../apis";

interface UseAddMember {
  refetchTeam: () => void;
  onClose: () => void;
}

const useAddMember = ({ refetchTeam, onClose }: UseAddMember) => {
  const { authToken } = useAuth();

  const { mutate, isLoading } = useMutation({
    mutationFn: ({ data }: any) =>
      apis.addOrRemoveTeamMember({ authToken, data }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Add Team Member successfully",
      });
      refetchTeam();
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message,
        variant: "destructive",
      });
    },
  });

  return { mutate, isLoading };
};

export default useAddMember;
