import { useMutation } from "react-query";

import { toast, useAuth } from "@/hooks";
import apis from "../apis";

const useAddReaction = ({
  callAfterSuccess,
}: {
  callAfterSuccess: () => void;
}) => {
  const { authToken } = useAuth();

  const { isLoading, mutate } = useMutation({
    mutationFn: ({ data }: any) => apis.addReaction({ authToken, data }),
    onSuccess: () => {
      callAfterSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        variant: "destructive",
        description:
          error?.response?.data?.message || "Error while adding reaction",
      });
    },
    retry: false,
  });

  return {
    isLoading,
    mutate,
  };
};

export default useAddReaction;
