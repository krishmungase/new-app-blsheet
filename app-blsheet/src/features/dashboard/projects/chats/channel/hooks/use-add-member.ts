import { toast, useAuth } from "@/hooks";
import { useMutation } from "react-query";

import apis from "../../apis";

interface UseAddMember {
  callAfterSuccess: () => void;
}

const useAddMember = ({ callAfterSuccess }: UseAddMember) => {
  const { authToken } = useAuth();

  const { isLoading, mutate } = useMutation({
    mutationFn: ({ data }: any) => apis.addMember({ authToken, data }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Member added successfully",
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

export default useAddMember;
