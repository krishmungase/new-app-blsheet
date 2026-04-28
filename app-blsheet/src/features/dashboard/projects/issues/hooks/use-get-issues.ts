import { QUERY } from "@/constants";
import { toast, useAuth } from "@/hooks";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

import apis from "../apis";
import useGetIssueFilters from "./use-get-issues-filters";

const useGetIssues = () => {
  const { projectId } = useParams();
  const { authToken } = useAuth();
  const {
    title,
    priority,
    status,
    page,
    limit,
    assignedToMe,
    createdByMe,
    sortByCreated,
  } = useGetIssueFilters();

  const {
    isLoading,
    refetch,
    data: response,
  } = useQuery({
    queryKey: [
      QUERY.ISSUE.GET_ISSUES,
      projectId,
      {
        title,
        priority,
        status,
        page,
        limit,
        assignedToMe,
        createdByMe,
        sortByCreated,
      },
    ],
    queryFn: () =>
      apis.getIssues({
        params: {
          projectId,
          title,
          priority,
          status,
          page,
          limit,
          assignedToMe,
          createdByMe,
          sortByCreated,
        },
        authToken,
      }),
    onError: (err: any) => {
      toast({
        title: "Error",
        description: err?.response?.data?.message,
        variant: "destructive",
      });
    },
    retry: false,
  });

  return {
    isLoading,
    refetch,
    issues: response?.data?.data?.issues,
    total: response?.data?.data?.total,
    totalPages: response?.data?.data?.totalPages,
    hasPrevPage: response?.data?.data?.hasPrevPage,
    hasNextPage: response?.data?.data?.hasNextPage,
    issueCounts: response?.data?.data?.issueCounts,
  };
};

export default useGetIssues;
