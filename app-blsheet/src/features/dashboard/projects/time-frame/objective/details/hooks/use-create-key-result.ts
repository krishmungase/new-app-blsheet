import { toast, useAuth } from "@/hooks";
import { useMutation } from "react-query";

import apis from "../../../apis";

const useCreateKeyResult = ({
  callAfterSuccess,
}: {
  callAfterSuccess: () => void;
}) => {
  const { authToken } = useAuth();

  const { isLoading, mutate } = useMutation({
    mutationFn: ({ data }: any) => apis.createKeyResult({ authToken, data }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "KeyResult created successfully",
      });
      callAfterSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        variant: "destructive",
        description:
          error?.response?.data?.message || "Error while creating KeyResult",
      });
    },
    retry: false,
  });

  return {
    isLoading,
    mutate,
  };
};

export default useCreateKeyResult;
