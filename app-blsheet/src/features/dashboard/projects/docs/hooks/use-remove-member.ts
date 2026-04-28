import { useMutation } from "react-query";
import { toast, useAuth } from "@/hooks";

import apis from "../apis";

const useRemoveMember = ({ refetch }: { refetch: () => void }) => {
  const { authToken } = useAuth();

  const { isLoading, mutate } = useMutation({
    mutationFn: ({ data }: any) => apis.removeMember({ data, authToken }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Member removed successfully",
      });
      refetch();
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

export default useRemoveMember;
