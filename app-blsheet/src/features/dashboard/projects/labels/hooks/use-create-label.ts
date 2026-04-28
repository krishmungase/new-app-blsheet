import { toast, useAuth } from "@/hooks";
import { useMutation } from "react-query";

import apis from "../apis";

interface UseCreateLabelProps {
  callAfterSuccess: () => void;
}

const useCreateLabel = ({ callAfterSuccess }: UseCreateLabelProps) => {
  const { authToken } = useAuth();

  const { isLoading, mutate } = useMutation({
    mutationFn: ({ data }: any) => apis.createLabel({ authToken, data }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Label created successfully",
      });
      callAfterSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        variant: "destructive",
        description:
          error?.response?.data?.message || "Error while creating label",
      });
    },
    retry: false,
  });

  return {
    isLoading,
    mutate,
  };
};

export default useCreateLabel;
