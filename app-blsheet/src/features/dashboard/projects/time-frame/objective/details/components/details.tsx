import { format } from "date-fns";

import { Objective } from "@/types";
import { cn, formatNumber } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { progressColorFn } from "./table";
import MetricDialog from "../../components/metric-dialog";

const Details = ({ objective }: { objective: Objective }) => {
  return (
    <div className="bg-muted p-3 my-3 rounded-lg">
      <p className="text-sm">{objective.description}</p>
      <div className="flex items-center justify-between flex-col sm:flex-row mt-2 gap-2">
        <div className="flex items-center gap-1 text-center w-full">
          <div
            className={cn(
              progressColorFn(objective.progress ?? 0),
              "bg-muted border flex items-center rounded-full h-3 w-full sm:w-[200px]"
            )}
          >
            <div
              className={cn(
                "h-2.5 rounded-full  flex items-center justify-center",
                progressColorFn(objective.progress ?? 0)
              )}
              style={{ width: `${objective.progress ?? 0}%` }}
            />
          </div>
          <span className="text-sm">
            {formatNumber(objective.progress ?? 0)}%
          </span>
        </div>

        <div className="flex items-center space-x-2 justify-center">
          <Avatar className="flex items-center justify-center size-6 shrink-0">
            <AvatarImage
              src={objective?.owner?.avatar?.url}
              alt="profile-picture"
            />
            <AvatarFallback className="bg-foreground text-card">
              {objective.owner.fullName[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium truncate">
            {objective.owner.fullName}
          </span>
        </div>
      </div>
      <div className="flex items-center mt-2 justify-between sm:justify-start gap-2">
        <Badge className="bg-muted text-foreground px-0 mx-0">
          {format(objective.startDate, "LLL dd, y")} -{" "}
          {format(objective.endDate, "LLL dd, y")}
        </Badge>

        <MetricDialog data={objective.progressMetric} title="Show Metric" />
      </div>
    </div>
  );
};

export default Details;
