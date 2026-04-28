import { Issue, MemberRole } from "@/types";
import { Badge } from "@/components/ui/badge";
import { DottedSeparator } from "@/components";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useProject from "@/hooks/use-project";
import ProseStyleComponent from "@/components/shared/prose-style-comp";

import CreateOrUpdateIssue from "../../components/create-or-update-issue";
import { useIssueContext } from "../provider";
import ChangeStatus from "./change-status";
import DeleteIssue from "./delete-issue";
import IssueComments from "./issue-comments";

interface IssueInfoCard {
  issue: Issue;
  refetchIssue: () => void;
}

const IssueInfoCard = () => {
  const { issue, refetchIssue } = useIssueContext();
  const { project } = useProject();

  if (!issue) return null;

  return (
    <div className="col-span-4">
      <div className="mt-5 prose prose-stone !prose-sm max-w-full">
        <div className="border rounded-lg">
          <div className="px-4 py-2 border-b space-y-2 sm:space-y-0 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="space-x-2 flex items-center">
              <Avatar className="flex items-center justify-center size-6">
                <AvatarImage src={issue?.creator?.avatar?.url} alt="profile" />
                <AvatarFallback className="bg-foreground text-card text-sm">
                  {issue?.creator?.fullName[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium text-foreground text-xs sm:text-sm">
                {issue.creator.fullName}
              </span>
            </div>

            <div className="flex items-center justify-between sm:justify-center gap-3">
              <div className="flex items-center">
                {
                  <Badge className="px-2 rounded-full bg-orange-100 text-orange-500">
                    {project?.role}
                  </Badge>
                }
              </div>
              {(project?.role !== MemberRole.MEMBER || issue.isCreator) && (
                <div className="flex items-center justify-center gap-3">
                  <CreateOrUpdateIssue
                    projectId={project?.projectId!}
                    forUpdate={true}
                    issue={issue}
                    issueId={issue._id}
                    refetchIssues={refetchIssue}
                  />
                  <DeleteIssue
                    projectId={project?.projectId!}
                    refetchIssue={refetchIssue}
                    issueId={issue._id}
                  />
                </div>
              )}
            </div>
          </div>
          <ProseStyleComponent content={issue.description} />
          {/* <div
            className="text-foreground prose-sm !min-w-full px-6 md:px-8 prose py-1 md:py-2 prose-a:text-blue-500 hover:prose-a:text-blue-500/80 prose-ol:ml-5 prose-ul:ml-5"
            dangerouslySetInnerHTML={{ __html: issue.description }}
          /> */}
        </div>
      </div>
      <div className="py-2">
        <ChangeStatus />
      </div>
      <DottedSeparator color="blue" className="my-3" />
      <IssueComments
        refetchIssue={refetchIssue}
        comments={issue.comments}
        issueId={issue._id}
      />
    </div>
  );
};

export default IssueInfoCard;
