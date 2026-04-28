import { useMutation } from "react-query";

import { toast, useAuth } from "@/hooks";

import apis from "../apis";

const useDeleteSecretKey = ({ fn }: { fn: () => void }) => {
  const { authToken } = useAuth();

  const { isLoading, mutate } = useMutation({
    mutationFn: () => apis.deleteSecretKey({ authToken }),
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
        description: "Secret key deleted successfully",
        variant: "default",
      });
      fn();
    },
    retry: false,
  });

  return { isDeletingSecretKey: isLoading, deleteSecretKey: mutate };
};

export default useDeleteSecretKey;
