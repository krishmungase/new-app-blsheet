import { toast, useAuth } from "@/hooks";
import { useMutation } from "react-query";

import apis from "../apis";

const useUpdateTimeFrame = ({
  callAfterSuccess,
}: {
  callAfterSuccess: () => void;
}) => {
  const { authToken } = useAuth();

  const { isLoading, mutate } = useMutation({
    mutationFn: ({ data }: any) => apis.updateTimeFrame({ authToken, data }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Time Frame updated successfully",
      });
      callAfterSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        variant: "destructive",
        description:
          error?.response?.data?.message || "Error while updating Time Frame",
      });
    },
    retry: false,
  });

  return {
    isLoading,
    mutate,
  };
};

export default useUpdateTimeFrame;
