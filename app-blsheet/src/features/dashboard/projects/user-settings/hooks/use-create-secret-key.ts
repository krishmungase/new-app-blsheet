import { useMutation } from "react-query";

import { toast, useAuth } from "@/hooks";

import apis from "../apis";

const useCreateSecretKey = ({ fn }: { fn: () => void }) => {
  const { authToken } = useAuth();

  const { isLoading, mutate } = useMutation({
    mutationFn: () => apis.createSecretKey({ authToken }),
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.reqponse?.data?.message,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Secret key created successfully",
        variant: "default",
      });

      fn();
    },
    retry: false,
  });

  return { isCreatingSecretKey: isLoading, createSecretKey: mutate };
};

export default useCreateSecretKey;
