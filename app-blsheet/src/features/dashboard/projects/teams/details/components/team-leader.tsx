import { useParams } from "react-router-dom";

import { cn } from "@/lib/utils";
import { MEMBER_ROLE_COLORS } from "@/constants";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import AddLeader from "./add-leader";
import RemoveLeader from "./remove-leader";
import { useTeamContext } from "../provider/team-provider";
import useProject from "@/hooks/use-project";
import { MemberRole } from "@/types";

const TeamLeader = () => {
  const { team } = useTeamContext();
  const { projectId } = useParams();
  const { project } = useProject();

  if (!team?.leader.email) return null;

  return (
    <div className="border mt-4 rounded-lg px-6 py-3">
      {project?.role !== MemberRole.MEMBER ? (
        <div className="flex itecenter justify-between">
          <h1 className="text-primary font-bold text-center">Team Leader</h1>
          <div className="flex items-center justify-center gap-2 text-center">
            <AddLeader isUpdate={true} />
            <RemoveLeader
              projectId={projectId as string}
              teamId={team._id as string}
              memberId={team.leader._id as string}
            />
          </div>
        </div>
      ) : (
        <h1 className="text-primary font-bold text-center md:text-start">
          Team Leader
        </h1>
      )}

      <div className="mt-2 flex flex-col md:flex-row gap-2 items-center text-sm md:text-base md:justify-between">
        <div className="flex items-center space-x-2">
          <Avatar className="flex items-center justify-center size-6">
            <AvatarImage
              src={team?.leader?.user?.avatar?.url}
              alt="profile-picture"
            />
            <AvatarFallback className="bg-foreground text-card">
              {team?.leader.user.fullName[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span>{team?.leader?.user?.fullName}</span>
        </div>
        <span>{team.leader.email}</span>
        <Badge
          className={cn(
            MEMBER_ROLE_COLORS[team.leader.role],
            "w-[100px] flex items-center justify-center"
          )}
        >
          {team.leader.role}
        </Badge>
      </div>
    </div>
  );
};

export default TeamLeader;
