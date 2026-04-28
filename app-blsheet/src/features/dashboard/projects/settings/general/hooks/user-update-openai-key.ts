import { useMutation } from "react-query";
import { toast, useAuth } from "@/hooks";

import apis from "../../../apis";

interface UseUpdateOpenAIKey {
  refetchProject: () => void;
  setOpen: (open: boolean) => void;
}

const useUpdateOpenAIKey = ({
  refetchProject,
  setOpen,
}: UseUpdateOpenAIKey) => {
  const { authToken } = useAuth();

  const { isLoading, mutate } = useMutation({
    mutationFn: ({ data }: any) => apis.updateOpenAIKey({ authToken, data }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "OpenAI Key updated successfully",
      });
      refetchProject();
      setOpen(false);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.response?.data?.message,
      });
    },
    retry: false,
  });

  return { isLoading, mutate };
};

export default useUpdateOpenAIKey;
