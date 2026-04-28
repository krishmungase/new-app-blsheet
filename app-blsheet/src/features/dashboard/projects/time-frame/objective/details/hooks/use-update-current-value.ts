import { toast, useAuth } from "@/hooks";
import { useMutation } from "react-query";

import apis from "../../../apis";

const useUpdateCurrentValue = ({
  callAfterSuccess,
}: {
  callAfterSuccess: () => void;
}) => {
  const { authToken } = useAuth();

  const { isLoading, mutate } = useMutation({
    mutationFn: ({ data }: any) =>
      apis.updateKRCurrentValue({ authToken, data }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Current value updated successfully",
      });
      callAfterSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        variant: "destructive",
        description:
          error?.response?.data?.message ||
          "Error while updating current value",
      });
    },
    retry: false,
  });

  return {
    isLoading,
    mutate,
  };
};

export default useUpdateCurrentValue;
