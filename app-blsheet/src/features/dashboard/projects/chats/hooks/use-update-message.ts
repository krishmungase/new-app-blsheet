import { toast, useAuth } from "@/hooks";
import { useMutation } from "react-query";

import apis from "../apis";

interface UseUpdateMessageProps {
  callAfterSuccess: () => void;
}

const useUpdateMessage = ({ callAfterSuccess }: UseUpdateMessageProps) => {
  const { authToken } = useAuth();

  const { isLoading, mutate } = useMutation({
    mutationFn: ({ data }: any) => apis.updateMessage({ authToken, data }),
    onSuccess: () => {
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

export default useUpdateMessage;
