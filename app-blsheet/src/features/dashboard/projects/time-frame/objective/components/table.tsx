import { format } from "date-fns";
import { Link } from "react-router-dom";
import { TriangleAlert } from "lucide-react";

import { OKR_STATUS_COLOR } from "@/constants";
import { cn, formatNumber } from "@/lib/utils";
import { MemberRole, Objective } from "@/types";
import useProject from "@/hooks/use-project";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import Delete from "./delete";
import Update from "./update";
import Create from "./create";

const progressColorFn = (progress: number) => {
  if (progress < 50) return "bg-red-400 border-red-500";
  else if (progress >= 50 && progress < 70)
    return "bg-orange-400 border-orange-500";
  return "bg-green-400 border-green-500";
};

interface TableViewProps {
  objectives: Objective[];
  refetch: () => void;
}

const TableView = ({ objectives, refetch }: TableViewProps) => {
  const { project } = useProject();
  if (!objectives.length) {
    return (
      <div className="flex items-center justify-center gap-2 flex-col h-[50vh]">
        <TriangleAlert size={35} className="text-orange-500" />
        <span>No objective has been created yet.</span>
        <Create refetch={refetch} />
      </div>
    );
  }

  return (
    <div className="border rounded-tl-lg rounded-tr-lg overflow-auto w-full my-3">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-fit text-foreground text-center border-r">
              Sr.No
            </TableHead>
            <TableHead className="min-w-[400px] text-foreground border-r">
              Title
            </TableHead>
            <TableHead className="w-fit text-foreground text-center border-r">
              Progress
            </TableHead>
            <TableHead className="min-w-[200px] text-foreground text-center border-r">
              Team
            </TableHead>
            <TableHead className="min-w-[250px] text-foreground text-center border-r">
              Owner
            </TableHead>
            <TableHead className="min-w-[300px] text-foreground text-center border-r">
              Period
            </TableHead>
            <TableHead className="min-w-[250px] text-foreground text-center border-r">
              Creator
            </TableHead>
            <TableHead className="min-w-[150px] text-foreground text-center border-r">
              Status
            </TableHead>
            {project?.role !== MemberRole.MEMBER && (
              <TableHead className="min-w-[150px] text-foreground text-center">
                Actions
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {(objectives || []).map((objective: Objective, i) => (
            <TableRow
              key={objective._id}
              className={cn(
                objective.progress === 100 &&
                  "bg-green-50 hover:bg-green-50 dark:bg-green-950"
              )}
            >
              <TableCell className="border-r">
                <Badge className="bg-orange-50 text-orange-400 border-orange-400">
                  O.{i + 1}
                </Badge>
              </TableCell>
              <TableCell className="font-medium border-r">
                <Link
                  to={`/dashboard/workspace/${project?.projectId}/time-frame/${objective.timeFrameId}/objective/${objective._id}`}
                  className="text-active hover:text-active/80"
                >
                  {objective.title}
                </Link>
              </TableCell>
              <TableCell className="border-r">
                <div className="flex items-center gap-1 text-center">
                  <div
                    className={cn(
                      progressColorFn(objective.progress ?? 0),
                      "bg-muted border flex items-center rounded-full h-3 w-[50px]"
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
                  <span className="text-[8px]">
                    {formatNumber(objective.progress ?? 0)}%
                  </span>
                </div>
              </TableCell>
              <TableCell className="border-r">
                <Badge className="text-blue-500 bg-blue-100 flex items-center justify-center">
                  {objective.team.name}
                </Badge>
              </TableCell>
              <TableCell className="border-r">
                <div className="flex items-center space-x-2 justify-center">
                  <Avatar className="flex items-center justify-center size-6">
                    <AvatarImage
                      src={objective?.owner?.avatar?.url}
                      alt="profile-picture"
                    />
                    <AvatarFallback className="bg-foreground text-card">
                      {objective.owner.fullName[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">
                    {objective.owner.fullName}
                  </span>
                </div>
              </TableCell>
              <TableCell className="border-r">
                <Badge className="bg-muted text-foreground flex items-center justify-center">
                  {format(objective.startDate, "LLL dd, y")} -{" "}
                  {format(objective.endDate, "LLL dd, y")}
                </Badge>
              </TableCell>
              <TableCell className="border-r">
                <div className="flex items-center space-x-2 justify-center">
                  <Avatar className="flex items-center justify-center size-6">
                    <AvatarImage
                      src={objective?.creator?.avatar?.url}
                      alt="profile-picture"
                    />
                    <AvatarFallback className="bg-foreground text-card">
                      {objective.creator.fullName[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span>{objective.creator.fullName}</span>
                </div>
              </TableCell>
              <TableCell className="border-r">
                <Badge
                  className={cn(
                    OKR_STATUS_COLOR[objective.status],
                    "flex items-center justify-center"
                  )}
                >
                  {objective.status}
                </Badge>
              </TableCell>
              {project?.role !== MemberRole.MEMBER && (
                <TableCell className="min-w-[150px]">
                  <div className="flex items-center justify-center gap-2">
                    <Delete
                      projectId={project?.projectId as string}
                      timeFrameId={objective.timeFrameId}
                      refetch={refetch}
                      objectiveId={objective._id}
                    />
                    <Update refetch={refetch} objective={objective} />
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableView;
