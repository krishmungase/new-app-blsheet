import { useMutation } from "react-query";

import { toast, useAuth } from "@/hooks";
import apis from "../apis";

const useDeleteLabel = ({
  callAfterSuccess,
}: {
  callAfterSuccess: () => void;
}) => {
  const { authToken } = useAuth();

  const { isLoading, mutate } = useMutation({
    mutationFn: ({ data }: any) => apis.deleteLabel({ authToken, data }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Label deleted successfully",
      });
      callAfterSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        variant: "destructive",
        description:
          error?.response?.data?.message || "Error while deleting label",
      });
    },
    retry: false,
  });

  return {
    isLoading,
    mutate,
  };
};

export default useDeleteLabel;
