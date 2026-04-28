import { toast, useAuth } from "@/hooks";
import { useMutation } from "react-query";

import apis from "../apis";

const useDeleteTimeFrame = ({
  callAfterSuccess,
}: {
  callAfterSuccess: () => void;
}) => {
  const { authToken } = useAuth();

  const { isLoading, mutate } = useMutation({
    mutationFn: ({ data }: any) => apis.deleteTimeFrame({ authToken, data }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Time Frame deleted successfully",
      });
      callAfterSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        variant: "destructive",
        description:
          error?.response?.data?.message || "Error while deleting Time Frame",
      });
    },
    retry: false,
  });

  return {
    isLoading,
    mutate,
  };
};

export default useDeleteTimeFrame;
