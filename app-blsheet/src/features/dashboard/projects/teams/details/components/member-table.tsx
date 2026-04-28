import { useParams } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Member, MemberRole } from "@/types";
import { MEMBER_ROLE_COLORS } from "@/constants";
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

import RemoveMember from "./remove-member";

interface MemberTableProps {
  members: Member[];
  leader: Member;
}

const MemberTable = ({ members, leader }: MemberTableProps) => {
  const { project } = useProject();
  const { teamId } = useParams();

  if (!members.length) {
    return (
      <div className="flex items-center justify-center py-8 flex-col gap-2 rounded-lg">
        <span>No member added yet. Please add a team member!</span>
      </div>
    );
  }

  return (
    <div className="border mt-4 rounded-tl-lg rounded-tr-lg overflow-auto w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[250px] text-foreground border-r">
              Name
            </TableHead>
            <TableHead className="min-w-[200px] text-foreground border-r">
              Email
            </TableHead>
            <TableHead
              className={cn(
                "min-w-[200px] text-foreground",
                project?.role === MemberRole.OWNER && "border-r"
              )}
            >
              Role
            </TableHead>

            {project?.role === MemberRole.OWNER && (
              <TableHead className="text-foreground">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member: Member) => (
            <TableRow key={member._id}>
              <TableCell className="border-r">
                <div className="flex items-center space-x-2">
                  <Avatar className="flex items-center justify-center size-6">
                    <AvatarImage
                      src={member?.user?.avatar?.url}
                      alt="profile-picture"
                    />
                    <AvatarFallback className="bg-foreground text-card">
                      {member.user.fullName[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span>{member.user.fullName}</span>
                </div>
              </TableCell>

              <TableCell className="border-r">{member.email}</TableCell>
              <TableCell
                className={cn(project?.role === MemberRole.OWNER && "border-r")}
              >
                <Badge
                  className={cn(
                    MEMBER_ROLE_COLORS[member.role],
                    "w-[100px] flex items-center justify-center"
                  )}
                >
                  {member.role}
                </Badge>
              </TableCell>

              {project?.role === MemberRole.OWNER && (
                <TableCell className="text-foreground">
                  {leader?._id === member._id ? (
                    <span>-</span>
                  ) : (
                    <RemoveMember
                      teamId={teamId as string}
                      memberId={member._id!}
                      projectId={project.projectId}
                    />
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MemberTable;
