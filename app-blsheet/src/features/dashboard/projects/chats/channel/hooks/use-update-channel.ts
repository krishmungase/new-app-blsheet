import { toast, useAuth } from "@/hooks";
import { useMutation } from "react-query";

import apis from "../../apis";

interface UseUpdateChannelProps {
  callAfterSuccess: () => void;
}

const useUpdateChannel = ({ callAfterSuccess }: UseUpdateChannelProps) => {
  const { authToken } = useAuth();

  const { isLoading, mutate } = useMutation({
    mutationFn: ({ data }: any) => apis.updateChannel({ authToken, data }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Channel updated successfully",
      });
      callAfterSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        variant: "destructive",
        description:
          error?.response?.data?.message || "Error while updating channels",
      });
    },
    retry: false,
  });

  return {
    isLoading,
    mutate,
  };
};

export default useUpdateChannel;
