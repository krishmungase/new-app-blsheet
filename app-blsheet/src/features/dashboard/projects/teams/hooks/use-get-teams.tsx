import { useQuery } from "react-query";
import { QUERY } from "@/constants";
import { toast, useAuth } from "@/hooks";

import apis from "../apis";
import useGetTeamsFilters from "./use-get-teams-filters";

interface UseGetTeamsProps {
  projectId: string;
}

const useGetTeams = ({ projectId }: UseGetTeamsProps) => {
  const { page, limit, name } = useGetTeamsFilters();
  const { authToken } = useAuth();

  const {
    isLoading,
    refetch,
    data: response,
  } = useQuery({
    queryKey: [QUERY.TEAM.GET_TEAMS, { projectId, page, limit, name }],
    queryFn: () =>
      apis.getTeams({ authToken, params: { projectId, page, limit, name } }),
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message,
        variant: "destructive",
      });
    },
  });

  return {
    isLoading,
    refetch,
    teams: response?.data?.data?.teams ?? [],
    total: response?.data?.data?.total,
    totalPages: response?.data?.data?.totalPages,
    hasPrevPage: response?.data?.data?.hasPrevPage,
    hasNextPage: response?.data?.data?.hasNextPage,
    issueCounts: response?.data?.data?.issueCounts,
  };
};

export default useGetTeams;
