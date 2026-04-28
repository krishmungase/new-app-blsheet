import { useMutation } from "react-query";
import { toast, useAuth } from "@/hooks";
import apis from "../../apis";

interface useAddOrRemoveLeader {
  refetchTeam: () => void;
  onClose: () => void;
  isRemove?: boolean;
}

const useAddOrRemoveLeader = ({
  refetchTeam,
  onClose,
  isRemove,
}: useAddOrRemoveLeader) => {
  const { authToken } = useAuth();

  const { mutate, isLoading } = useMutation({
    mutationFn: ({ data }: any) => apis.addOrRemoveLeader({ authToken, data }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: `${isRemove ? "Remove" : "Add"} team leader successfully`,
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

export default useAddOrRemoveLeader;
