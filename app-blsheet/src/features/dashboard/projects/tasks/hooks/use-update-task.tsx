import { useMutation } from "react-query";
import apis from "../apis";
import { toast, useAuth } from "@/hooks";

interface UseUpdateTask {
  refetchTasks: () => void;
  form: any;
  onClose: () => void;
  hideToast?: boolean;
}

const useUpdateTask = ({
  refetchTasks,
  form,
  onClose,
  hideToast = false,
}: UseUpdateTask) => {
  const { authToken } = useAuth();

  const { isLoading, mutate } = useMutation({
    mutationFn: ({ data }: any) => apis.updateTask({ data, authToken }),
    onSuccess: () => {
      if (!hideToast) {
        toast({
          title: "Success",
          description: "Task updated successfully",
        });
      }
      refetchTasks();
      if (form) form?.reset();
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

export default useUpdateTask;
