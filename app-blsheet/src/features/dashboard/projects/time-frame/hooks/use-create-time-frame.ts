import { toast, useAuth } from "@/hooks";
import { useMutation } from "react-query";

import apis from "../apis";

const useCreateTimeFrame = ({
  callAfterSuccess,
}: {
  callAfterSuccess: () => void;
}) => {
  const { authToken } = useAuth();

  const { isLoading, mutate } = useMutation({
    mutationFn: ({ data }: any) => apis.createTimeFrame({ authToken, data }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Time Frame created successfully",
      });
      callAfterSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        variant: "destructive",
        description:
          error?.response?.data?.message || "Error while creating Time Frame",
      });
    },
    retry: false,
  });

  return {
    isLoading,
    mutate,
  };
};

export default useCreateTimeFrame;
