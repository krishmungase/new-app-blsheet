import { useQuery } from "react-query";

import { QUERY } from "@/constants";
import { toast, useAuth } from "@/hooks";

import apis from "../../apis";

interface UseGetTeamProps {
  projectId: string;
  teamId: string;
}

const useGetTeam = ({ projectId, teamId }: UseGetTeamProps) => {
  const { authToken } = useAuth();

  const {
    isLoading,
    refetch,
    data: response,
  } = useQuery({
    queryKey: [QUERY.TEAM.GET_TEAM, { projectId, teamId }],
    queryFn: () => {
      if (!teamId) return;
      return apis.getTeam({ authToken, params: { projectId, teamId } });
    },
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
    team: response?.data?.data,
  };
};

export default useGetTeam;
