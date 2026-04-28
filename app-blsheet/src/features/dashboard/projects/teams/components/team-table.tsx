import { Loader } from "@/components";
import { Member, Team, MemberRole } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useProject from "@/hooks/use-project";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "react-router-dom";
import DeleteTeam from "./delete-team";
import CreateTeam from "./create-team";
import { cn } from "@/lib/utils";

interface TeamTableProps {
  teams: Team[];
  isLoading: boolean;
  refetchTeams: () => void;
}

const TeamTable = ({ teams, isLoading, refetchTeams }: TeamTableProps) => {
  const { project } = useProject();

  if (isLoading) return <Loader />;

  if (!teams.length) {
    return (
      <div className="flex items-center justify-center py-8 flex-col gap-2 bg-muted rounded-lg">
        <span>No team created yet. Please create a team to get started!</span>
        <CreateTeam
          refetch={refetchTeams}
          projectId={project?.projectId as string}
        />
      </div>
    );
  }

  return (
    <div className="border rounded-tl-lg rounded-tr-lg overflow-auto w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[250px] text-foreground border-r">
              Team Name
            </TableHead>
            <TableHead className="min-w-[250px] text-foreground border-r">
              Leader
            </TableHead>
            <TableHead
              className={cn(
                "min-w-[200px] text-foreground",
                project?.role !== MemberRole.MEMBER && "border-r"
              )}
            >
              Members
            </TableHead>
            {project?.role !== MemberRole.MEMBER && (
              <TableHead className="min-w-[200px] text-foreground">
                Actions
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {teams.map((team: Team) => (
            <TableRow key={team._id}>
              <TableCell className="font-medium border-r">
                <Link
                  className="text-primary hover:text-primary/80"
                  to={`/dashboard/setup/${project?.projectId}/teams/${team._id}/details`}
                >
                  {team.name}
                </Link>
              </TableCell>

              {team?.leader?._id ? (
                <TableCell className="flex items-center gap-2 border-r">
                  <Avatar className="size-6">
                    <AvatarImage
                      src={team?.leader?.user.avatar?.url}
                      alt={team?.leader?.user?.fullName}
                    />
                    <AvatarFallback>
                      {team?.leader?.user?.fullName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">
                    {team?.leader?.user?.fullName}
                  </span>
                </TableCell>
              ) : (
                <TableCell className="border-r">-</TableCell>
              )}

              {team?.members?.length ? (
                <TableCell
                  className={cn(
                    project?.role !== MemberRole.MEMBER && "border-r"
                  )}
                >
                  <div className="flex items-center gap-2">
                    {team.members.map((member: Member) => (
                      <Tooltip key={member._id}>
                        <TooltipContent className="text-xs">
                          {member.user.fullName}
                        </TooltipContent>
                        <TooltipTrigger>
                          <Avatar key={member._id} className="size-6">
                            <AvatarImage
                              src={member?.user?.avatar?.url}
                              alt={member.user.fullName}
                            />
                            <AvatarFallback>
                              {member.user.fullName[0]}
                            </AvatarFallback>
                          </Avatar>
                        </TooltipTrigger>
                      </Tooltip>
                    ))}
                  </div>
                </TableCell>
              ) : (
                <TableCell
                  className={cn(
                    project?.role !== MemberRole.MEMBER && "border-r"
                  )}
                >
                  -
                </TableCell>
              )}

              {project?.role !== MemberRole.MEMBER && (
                <TableCell>
                  <DeleteTeam
                    refetchTeams={refetchTeams}
                    teamId={team?._id as string}
                    projectId={project?.projectId as string}
                  />
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TeamTable;
