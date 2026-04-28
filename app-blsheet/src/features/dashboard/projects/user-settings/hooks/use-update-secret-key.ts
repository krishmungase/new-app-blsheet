import { useMutation } from "react-query";

import { toast, useAuth } from "@/hooks";

import apis from "../apis";

const useUpdateSecretKey = ({ fn }: { fn: () => void }) => {
  const { authToken } = useAuth();

  const { isLoading, mutate } = useMutation({
    mutationFn: () => apis.updateSecretKey({ authToken }),
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.reqponse?.data?.message,
        variant: "default",
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Secret key updated successfully",
        variant: "default",
      });
      fn();
    },
    retry: false,
  });

  return { isUpdatingSecretKey: isLoading, updateSecretKey: mutate };
};

export default useUpdateSecretKey;
