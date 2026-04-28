import { useMutation } from "react-query";
import { toast, useAuth } from "@/hooks";

import apis from "../../../apis";

interface UseUpdateProject {
  refetchProject: () => void;
  setOpen: (open: boolean) => void;
}

const useUpdateProject = ({ refetchProject, setOpen }: UseUpdateProject) => {
  const { authToken } = useAuth();

  const { isLoading, mutate } = useMutation({
    mutationFn: ({ data }: any) => apis.updateProject({ authToken, data }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Project updated successfully",
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

export default useUpdateProject;
