import { useMutation } from "react-query";
import { toast, useAuth } from "@/hooks";
import apis from "../apis";

interface UseCreateIssue {
  refetchIssues: () => void;
  form: any;
  onClose: () => void;
}

const useCreateIssue = ({ refetchIssues, form, onClose }: UseCreateIssue) => {
  const { authToken } = useAuth();

  const { isLoading, mutate } = useMutation({
    mutationFn: ({ data }: any) => apis.createIssue({ data, authToken }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Issue created successfully",
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

export default useCreateIssue;
