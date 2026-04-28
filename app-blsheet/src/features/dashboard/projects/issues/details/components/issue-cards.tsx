import { IssueStatus, MemberRole } from "@/types";
import { Badge } from "@/components/ui/badge";
import { TASK_PRIORITY_COLOR } from "@/constants";
import useProject from "@/hooks/use-project";

import { useIssueContext } from "../provider";
import MemberCard from "./member-card";
import AssignMember from "./assign-member";

const IssueCards = () => {
  const { issue, refetchIssue } = useIssueContext();
  const { project } = useProject();

  if (!issue) return null;

  return (
    <div className="space-y-3 w-full col-span-2">
      <div className="space-y-2 p-3 rounded-lg bg-muted border shadow-sm h-fit w-full">
        <div className="flex items-center justify-between">
          <h1 className="text-primary text-sm font-bold">Assignees</h1>
          {project?.role !== MemberRole.MEMBER && (
            <AssignMember
              members={issue.members}
              projectId={project?.projectId as string}
              issueId={issue._id}
              refetchIssues={refetchIssue}
            />
          )}
        </div>

        <div className="flex items-center w-full flex-col space-y-1 pt-2">
          {issue?.members?.length > 0 ? (
            <div className="flex flex-col space-y-2 w-full">
              {issue?.members.map((member) => (
                <MemberCard
                  projectId={project?.projectId as string}
                  issueId={issue._id}
                  key={member._id}
                  member={member}
                  refetchIssues={refetchIssue}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center text-sm font-medium text-center">
              No members assigned to this task.
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2 p-3 rounded-lg bg-muted border shadow-sm h-fit w-full">
        <h1 className="text-primary text-sm font-bold">Priority</h1>
        <div className="flex items-center">
          <Badge className={TASK_PRIORITY_COLOR[issue?.priority!]}>
            {issue?.priority}
          </Badge>
        </div>
      </div>

      <div className="space-y-2 p-3 rounded-lg bg-muted border shadow-sm h-fit w-full">
        <h1 className="text-primary text-sm font-bold">Status</h1>
        <div className="flex items-center">
          <Badge
            className={
              issue.status === IssueStatus.OPEN
                ? "bg-green-100 text-green-500 border border-green-500"
                : "bg-red-100 text-red-500 border border-red-500"
            }
          >
            {issue?.status}
          </Badge>
        </div>
      </div>

      <div className="space-y-2 p-3 rounded-lg bg-muted border shadow-sm h-fit w-full">
        <h1 className="text-primary text-sm font-bold">Labels</h1>
        <div className="flex items-center">
          <Badge className="bg-orange-100 text-orange-500 border border-orange-500">
            {issue?.labels[0]}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default IssueCards;
