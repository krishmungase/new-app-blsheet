import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

import { toast, useAuth } from "@/hooks";
import { QUERY } from "@/constants";

import apis from "../apis";
import useGetTaskFilters from "./use-get-task-filters";

const useGetCompletedTasks = () => {
  const { projectId } = useParams();
  const { authToken } = useAuth();
  const { page, limit, title, priority } = useGetTaskFilters();

  const {
    isLoading,
    refetch,
    data: response,
  } = useQuery({
    queryKey: [
      QUERY.TASK.GET_COMPLETED_TASKS,
      { projectId, page, limit, title, priority },
    ],
    queryFn: () =>
      apis.getCompletedTasks({
        params: { projectId, page, limit, title, priority },
        authToken,
      }),
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message,
        variant: "destructive",
      });
    },
    retry: false,
  });

  return {
    isLoading,
    refetch,
    tasks: response?.data?.data?.tasks ?? [],
    hasNextPage: response?.data?.data?.hasNextPage,
    hasPrevPage: response?.data?.data?.hasPrevPage,
    total: response?.data?.data?.total ?? 0,
    totalPages: response?.data?.data?.totalPages ?? 0,
  };
};

export default useGetCompletedTasks;
