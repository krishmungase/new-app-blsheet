import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

import { QUERY } from "@/constants";
import { toast, useAuth } from "@/hooks";
import apis from "@/features/dashboard/projects/apis";

const useGetProject = () => {
  const { authToken } = useAuth();
  const { projectId } = useParams();

  const {
    refetch,
    isLoading,
    data: response,
  } = useQuery({
    queryKey: [QUERY.PROJECT.GET_PROJECT, projectId],
    queryFn: () => apis.getProject({ params: { projectId }, authToken }),
    onError: (err: any) => {
      toast({
        title: "Error",
        description: err?.response?.data?.message,
        variant: "destructive",
      });
    },
    retry: false,
  });

  return { refetch, isLoading, project: response?.data?.data?.project };
};

export default useGetProject;
