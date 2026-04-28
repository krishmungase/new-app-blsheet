import { toast, useAuth } from "@/hooks";
import { useMutation } from "react-query";

import apis from "../apis";

interface UseCreateMessageProps {
  callAfterSuccess: () => void;
}

const useCreateMessage = ({ callAfterSuccess }: UseCreateMessageProps) => {
  const { authToken } = useAuth();

  const { isLoading, mutate } = useMutation({
    mutationFn: ({ data }: any) => apis.createMessage({ authToken, data }),
    onSuccess: () => {
      callAfterSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        variant: "destructive",
        description:
          error?.response?.data?.message || "Error while creating message",
      });
    },
    retry: false,
  });

  return {
    isLoading,
    mutate,
  };
};

export default useCreateMessage;
