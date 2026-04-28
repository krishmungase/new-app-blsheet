import { toast, useAuth } from "@/hooks";
import { useMutation } from "react-query";

import apis from "../../../apis";

const useDeleteKeyResult = ({
  callAfterSuccess,
}: {
  callAfterSuccess: () => void;
}) => {
  const { authToken } = useAuth();

  const { isLoading, mutate } = useMutation({
    mutationFn: ({ data }: any) => apis.deleteKeyResult({ authToken, data }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "KeyResult deleted successfully",
      });
      callAfterSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        variant: "destructive",
        description:
          error?.response?.data?.message || "Error while deleting KeyResult",
      });
    },
    retry: false,
  });

  return {
    isLoading,
    mutate,
  };
};

export default useDeleteKeyResult;
