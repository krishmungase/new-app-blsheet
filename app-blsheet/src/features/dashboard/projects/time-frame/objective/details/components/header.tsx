import { useParams } from "react-router-dom";

import { BackButton } from "@/components";
import useProject from "@/hooks/use-project";
import { MemberRole, Objective } from "@/types";

import Create from "./create";

interface HeaderProps {
  refetch: () => void;
  objective: Objective;
}

const Header = ({ refetch, objective }: HeaderProps) => {
  const { projectId, timeFrameId } = useParams();
  const { project } = useProject();

  return (
    <div className="p-2 bg-muted border flex-col sm:flex-row rounded-lg flex gap-2 sm:items-center sm:justify-between">
      <div className="flex items-center gap-1 bg-muted rounded-lg">
        <BackButton
          url={`/dashboard/workspace/${projectId}/time-frame/${timeFrameId}`}
        />
        <h1 className="text-sm sm:text-base font-medium text-primary">
          {objective.title}
        </h1>
      </div>

      <div className="flex items-center sm:space-x-2 flex-col sm:flex-row gap-2 sm:w-fit">
        {project?.role !== MemberRole.MEMBER && <Create refetch={refetch} />}
      </div>
    </div>
  );
};

export default Header;
