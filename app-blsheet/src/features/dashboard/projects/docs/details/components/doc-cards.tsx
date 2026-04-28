import AssignMember from "./assign-member";
import MemberCard from "./member-card";
import { useDocContext } from "../providers/doc-provider";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { MemberRole, DocStatus } from "@/types";
import useProject from "@/hooks/use-project";

import { DOC_ACCESS_TYPE_COLOR, DOC_STATUS_TYPE_COLOR } from "@/constants";
import PublishDoc from "./publish-doc";
import ChangeAccess from "./change-access";
import ChangeStatus from "./change-status";
import RenameDoc from "./rename-doc";

const DocCards = () => {
  const { project } = useProject();
  const { doc, refetchDoc } = useDocContext();

  if (!doc) return null;

  return (
    <div className="space-y-3 w-full col-span-2">
      <RenameDoc />
      {doc?.status === DocStatus.PUBLISHED ? (
        <div className="space-y-2 p-3 rounded-lg bg-muted border shadow-sm h-fit w-full">
          <div className="flex items-center justify-between">
            <h1 className="text-primary text-sm font-bold">Assingees</h1>
            {(project?.role !== MemberRole.MEMBER || doc?.isCreator) && (
              <AssignMember
                members={doc?.members!}
                projectId={project?.projectId!}
                docId={doc?._id!}
                refetchDoc={refetchDoc}
              />
            )}
          </div>

          <div className="flex items-center w-full flex-col space-y-1 pt-2">
            {doc?.members.length > 0 ? (
              doc?.members.map((member) => (
                <MemberCard
                  key={member._id}
                  docId={doc?._id}
                  member={member}
                  refetchDoc={refetchDoc}
                  projectId={project?.projectId!}
                />
              ))
            ) : (
              <div className="text-sm flex items-start justify-start w-full">
                No Assignees
              </div>
            )}
          </div>
        </div>
      ) : project?.role !== MemberRole.MEMBER || doc?.isCreator ? (
        <div className="space-y-2 p-3 rounded-lg bg-muted border shadow-sm h-fit w-full">
          <h1 className="text-primary text-sm font-bold">Publish Document</h1>
          <PublishDoc
            refetch={refetchDoc}
            projectId={project?.projectId as string}
            docId={doc._id}
          />
        </div>
      ) : null}
      <div className="space-y-2 p-3 rounded-lg bg-muted border shadow-sm h-fit w-full">
        <h1 className="text-primary text-sm font-bold">Status</h1>
        {project?.role !== MemberRole.MEMBER || doc?.isCreator ? (
          <ChangeStatus
            docId={doc?._id}
            refetch={refetchDoc}
            value={doc.status}
          />
        ) : (
          <div className="flex items-center">
            <Badge
              className={cn(
                DOC_STATUS_TYPE_COLOR[doc.status],
                "text-white px-3 py-1 text-xs"
              )}
            >
              {doc?.status}
            </Badge>
          </div>
        )}
      </div>

      <div className="space-y-2 p-3 rounded-lg bg-muted border shadow-sm h-fit w-full">
        <h1 className="text-primary text-sm font-bold">Access</h1>
        {project?.role !== MemberRole.MEMBER || doc?.isCreator ? (
          <ChangeAccess
            docId={doc?._id}
            refetch={refetchDoc}
            value={doc.accessType}
          />
        ) : (
          <div className="flex items-center">
            <Badge
              className={cn(
                DOC_ACCESS_TYPE_COLOR[doc.accessType],
                "text-white px-3 py-1 text-xs"
              )}
            >
              {doc?.accessType}
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocCards;
