import { toast, useAuth } from "@/hooks";
import { useMutation } from "react-query";

import apis from "../../../apis";

const useUpdateKeyResult = ({
  callAfterSuccess,
}: {
  callAfterSuccess: () => void;
}) => {
  const { authToken } = useAuth();

  const { isLoading, mutate } = useMutation({
    mutationFn: ({ data }: any) => apis.updateKeyResult({ authToken, data }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "KeyResult updated successfully",
      });
      callAfterSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        variant: "destructive",
        description:
          error?.response?.data?.message || "Error while updating KeyResult",
      });
    },
    retry: false,
  });

  return {
    isLoading,
    mutate,
  };
};

export default useUpdateKeyResult;
