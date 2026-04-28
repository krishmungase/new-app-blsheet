import { toast, useAuth } from "@/hooks";
import { useMutation } from "react-query";

import apis from "../../apis";

const useCreateObjective = ({
  callAfterSuccess,
}: {
  callAfterSuccess: () => void;
}) => {
  const { authToken } = useAuth();

  const { isLoading, mutate } = useMutation({
    mutationFn: ({ data }: any) => apis.createObjective({ authToken, data }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Objective created successfully",
      });
      callAfterSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        variant: "destructive",
        description:
          error?.response?.data?.message || "Error while creating Objective",
      });
    },
    retry: false,
  });

  return {
    isLoading,
    mutate,
  };
};

export default useCreateObjective;
