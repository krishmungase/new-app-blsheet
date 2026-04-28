import { MemberRole } from "@/types";
import useProject from "@/hooks/use-project";

import { useDocContext } from "../providers/doc-provider";
import UpdateTitle from "./update-title";

const RenameDoc = () => {
  const { project } = useProject();
  const { doc } = useDocContext();

  return (
    <div className="space-y-2 p-3 rounded-lg bg-muted border shadow-sm h-fit w-full">
      <div className="flex items-center justify-between gap-1">
        <h1 className="text-primary text-sm font-bold">Document Title</h1>
        {(project?.role !== MemberRole.MEMBER || doc?.isCreator) && (
          <UpdateTitle title={doc?.title as string} />
        )}
      </div>

      <p className="text-sm">{doc?.title}</p>
    </div>
  );
};

export default RenameDoc;
