import { useMutation } from "react-query";

import { toast, useAuth } from "@/hooks";
import apis from "../apis";

const useDeleteMessage = ({
  callAfterSuccess,
}: {
  callAfterSuccess: () => void;
}) => {
  const { authToken } = useAuth();

  const { isLoading, mutate } = useMutation({
    mutationFn: ({ data }: any) => apis.deleteMessage({ authToken, data }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Message deleted successfully",
      });
      callAfterSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        variant: "destructive",
        description:
          error?.response?.data?.message || "Error while deleting message",
      });
    },
    retry: false,
  });

  return {
    isLoading,
    mutate,
  };
};

export default useDeleteMessage;
