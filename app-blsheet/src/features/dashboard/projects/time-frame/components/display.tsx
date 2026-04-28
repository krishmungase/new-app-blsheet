import { format } from "date-fns";
import { Link } from "react-router-dom";

import Hint from "@/components/ui/hint";
import { ListComponent } from "@/components";
import useProject from "@/hooks/use-project";
import { MemberRole, TimeFrame } from "@/types";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import Update from "./update";
import Delete from "./delete";
import { TriangleAlert } from "lucide-react";
import Create from "./create";

interface DisplayProps {
  timeFrames: TimeFrame[];
  refetch: () => void;
}

interface CardTimeFrameProps {
  timeFrame: TimeFrame;
  refetch: () => void;
}

const Display = ({ refetch, timeFrames }: DisplayProps) => {
  if (!timeFrames.length) {
    return (
      <div className="flex h-[50vh] items-center flex-col gap-2 justify-center">
        <TriangleAlert className="text-orange-500" size={35} />
        <span>No time frame has been created yet.!</span>
        <Create refetch={refetch} />
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 py-3">
      <ListComponent
        data={timeFrames}
        renderItem={(item: TimeFrame) => (
          <TimeFrameCard key={item._id} timeFrame={item} refetch={refetch} />
        )}
      />
    </div>
  );
};

const TimeFrameCard = ({ timeFrame, refetch }: CardTimeFrameProps) => {
  const { project } = useProject();

  return (
    <div className="rounded-lg bg-muted">
      <div className="p-3">
        <Link
          to={`/dashboard/workspace/${timeFrame.projectId}/time-frame/${timeFrame._id}`}
          className="font-bold text-sm text-primary hover:text-primary/80 cursor-pointer"
        >
          {timeFrame.label}
        </Link>
      </div>
      <div className="p-3 border-t flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Hint label={timeFrame.creator.fullName}>
            <Avatar className="flex items-center justify-center size-6">
              <AvatarImage
                src={timeFrame.creator?.avatar?.url}
                alt="profile-picture"
              />
              <AvatarFallback className="flex bg-foreground items-center text-sm justify-center w-full h-full text-card">
                {timeFrame.creator?.fullName[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Hint>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-[13px] space-x-1">
            <span>{format(timeFrame.startDate, "dd MMM, yyyy")}</span>
            <span>-</span>
            <span>{format(timeFrame.endDate, "dd MMM, yyyy")}</span>
          </div>

          {project?.role !== MemberRole.MEMBER && (
            <div className="flex items-center justify-center gap-1">
              <Update refetch={refetch} timeFrame={timeFrame} />
              <Delete
                refetch={refetch}
                timeFrameId={timeFrame._id}
                projectId={timeFrame.projectId}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Display;
