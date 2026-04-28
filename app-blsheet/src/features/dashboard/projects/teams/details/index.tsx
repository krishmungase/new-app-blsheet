import { useParams } from "react-router-dom";

import { BackButton, Loader } from "@/components";

import useGetTeam from "./hooks/use-get-team";
import AddMember from "./components/add-member";
import { TeamContext } from "./provider/team-provider";
import MemberTable from "./components/member-table";
import TeamLeader from "./components/team-leader";
import AddLeader from "./components/add-leader";

const TeamDetails = () => {
  const { projectId, teamId } = useParams();
  const { team, isLoading, refetch } = useGetTeam({
    projectId: projectId as string,
    teamId: teamId as string,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader />
      </div>
    );
  }

  return (
    <TeamContext.Provider value={{ team, refetchTeam: refetch }}>
      <div className="relative">
        <div className="pb-5 scroll-smooth">
          <div className="mx-auto overflow-y-auto h-[calc(100vh_-160px)]">
            <div className="p-2 bg-muted border flex-col sm:flex-row rounded-lg flex gap-2 sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <BackButton url={`/dashboard/setup/${projectId}/teams`} />
                <span className="text-base">{team.name}</span>{" "}
                <span className="text-card bg-secondary-foreground rounded-xl sm:px-2 px-4 md:px-4 text-xs md:text-sm py-1">
                  {team.members.length}
                </span>
              </div>
              <div className="flex items-center sm:space-x-2 flex-col sm:flex-row gap-2">
                {!team?.leader?.email && <AddLeader />}
                <AddMember />
              </div>
            </div>
            <TeamLeader />
            <MemberTable members={team?.members} leader={team?.leader} />
          </div>
        </div>
      </div>
    </TeamContext.Provider>
  );
};

export default TeamDetails;
