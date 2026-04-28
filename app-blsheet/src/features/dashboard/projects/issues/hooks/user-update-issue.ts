import { useMutation } from "react-query";
import { toast, useAuth } from "@/hooks";
import apis from "../apis";

interface UseUpdateIssue {
  refetchIssues: () => void;
  form: any;
  onClose: () => void;
}

const useUpdateIssue = ({ refetchIssues, form, onClose }: UseUpdateIssue) => {
  const { authToken } = useAuth();

  const { isLoading, mutate } = useMutation({
    mutationFn: ({ data }: any) => apis.updateIssue({ data, authToken }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Issue updated successfully",
      });
      refetchIssues();
      form.reset();
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

export default useUpdateIssue;
