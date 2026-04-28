import { toast, useAuth } from "@/hooks";
import { useMutation } from "react-query";

import apis from "../apis";

const useUpdateLabel = ({
  callAfterSuccess,
}: {
  callAfterSuccess: () => void;
}) => {
  const { authToken } = useAuth();

  const { isLoading, mutate } = useMutation({
    mutationFn: ({ data }: any) => apis.updateLabel({ authToken, data }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Label updated successfully",
      });
      callAfterSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        variant: "destructive",
        description:
          error?.response?.data?.message || "Error while updating message",
      });
    },
    retry: false,
  });

  return {
    isLoading,
    mutate,
  };
};

export default useUpdateLabel;
