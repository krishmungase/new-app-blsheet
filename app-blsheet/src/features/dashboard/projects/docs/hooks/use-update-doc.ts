import { useMutation } from "react-query";
import { toast, useAuth } from "@/hooks";

import apis from "../apis";
interface UseUpdateDoc {
  refetchDoc?: () => void;
  onClose?: () => void;
}

const useUpdateDoc = ({
  refetchDoc = () => {},
  onClose = () => {},
}: UseUpdateDoc) => {
  const { authToken } = useAuth();

  const { isLoading, mutate } = useMutation({
    mutationFn: ({ data }: any) => apis.updateDoc({ data, authToken }),
    onSuccess: () => {
      refetchDoc();
      onClose();
    },
    onError: (err: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: err?.response?.data?.message,
      });
    },
    retry: false,
  });

  return { isLoading, mutate };
};

export default useUpdateDoc;
