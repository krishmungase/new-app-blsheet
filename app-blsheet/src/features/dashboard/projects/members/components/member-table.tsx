import { cn } from "@/lib/utils";
import { Loader } from "@/components";
import { Badge } from "@/components/ui/badge";
import { INVITATION_STATUS_COLORS, MEMBER_ROLE_COLORS } from "@/constants";
import { InvitationStatus, Member, MemberRole } from "@/types";
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
import MemberActions from "./member-actions";

interface MemberTableProps {
  members: Member[];
  isLoading: boolean;
  refetchMembers: () => void;
}

const MemberTable = ({
  members,
  isLoading,
  refetchMembers,
}: MemberTableProps) => {
  const { project } = useProject();

  if (isLoading) return <Loader />;

  return (
    <div className="border rounded-tl-lg rounded-tr-lg overflow-auto w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[250px] text-foreground border-r">
              Name
            </TableHead>
            <TableHead className="min-w-[200px] text-foreground border-r">
              Email
            </TableHead>
            <TableHead className="min-w-[200px] text-foreground border-r text-center">
              Role
            </TableHead>
            <TableHead
              className={cn(
                "text-foreground text-center",
                project?.role === MemberRole.OWNER && "border-r"
              )}
            >
              Status
            </TableHead>
            {project?.role === MemberRole.OWNER && (
              <TableHead className="text-foreground">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member: Member) => (
            <TableRow key={member._id}>
              {member.invitationStatus === InvitationStatus.ACCEPTED ? (
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
              ) : (
                <TableCell className="border-r">-</TableCell>
              )}
              <TableCell className="border-r">{member.email}</TableCell>
              <TableCell className="border-r flex items-center justify-center">
                <Badge
                  className={cn(
                    MEMBER_ROLE_COLORS[member.role],
                    "w-[100px] flex items-center justify-center"
                  )}
                >
                  {member.role}
                </Badge>
              </TableCell>
              <TableCell
                className={cn(project?.role === MemberRole.OWNER && "border-r")}
              >
                <div className="flex items-center justify-center">
                  <Badge
                    className={cn(
                      INVITATION_STATUS_COLORS[member.invitationStatus!],
                      "w-[110px] flex items-center justify-center"
                    )}
                  >
                    {member.invitationStatus}
                  </Badge>
                </div>
              </TableCell>

              {project?.role === MemberRole.OWNER &&
                (member.role !== MemberRole.OWNER ? (
                  <TableCell className="text-foreground">
                    <MemberActions
                      role={member.role}
                      memberId={member._id!}
                      refetchMembers={refetchMembers}
                      projectId={project.projectId}
                    />
                  </TableCell>
                ) : (
                  <TableCell className="text-center">-</TableCell>
                ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MemberTable;
