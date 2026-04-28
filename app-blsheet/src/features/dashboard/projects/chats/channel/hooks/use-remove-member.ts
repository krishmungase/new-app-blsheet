import { toast, useAuth } from "@/hooks";
import { useMutation } from "react-query";

import apis from "../../apis";

interface UseRemoveMember {
  callAfterSuccess: () => void;
}

const useRemoveMember = ({ callAfterSuccess }: UseRemoveMember) => {
  const { authToken } = useAuth();

  const { isLoading, mutate } = useMutation({
    mutationFn: ({ data }: any) => apis.removeMember({ authToken, data }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Member removed successfully",
      });
      callAfterSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        variant: "destructive",
        description:
          error?.response?.data?.message || "Error while adding member",
      });
    },
    retry: false,
  });

  return {
    isLoading,
    mutate,
  };
};

export default useRemoveMember;
