import { toast, useAuth } from "@/hooks";
import { useMutation } from "react-query";

import apis from "../../apis";

const useDeleteObjective = ({
  callAfterSuccess,
}: {
  callAfterSuccess: () => void;
}) => {
  const { authToken } = useAuth();

  const { isLoading, mutate } = useMutation({
    mutationFn: ({ data }: any) => apis.deleteObjective({ authToken, data }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Objective deleted successfully",
      });
      callAfterSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        variant: "destructive",
        description:
          error?.response?.data?.message || "Error while deleting objective",
      });
    },
    retry: false,
  });

  return {
    isLoading,
    mutate,
  };
};

export default useDeleteObjective;
