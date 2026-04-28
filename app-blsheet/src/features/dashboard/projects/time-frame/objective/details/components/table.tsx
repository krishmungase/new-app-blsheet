import { useParams } from "react-router-dom";

import { cn, deduplicateByDate, formatNumber } from "@/lib/utils";
import { KeyResult, MemberRole } from "@/types";
import { OKR_STATUS_COLOR } from "@/constants";
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
import useProject from "@/hooks/use-project";

import { TriangleAlert } from "lucide-react";

import Create from "./create";
import Delete from "./delete";
import Update from "./update";
import UpdateCurrentValue from "./update-current-value";
import MetricDialog from "../../components/metric-dialog";

export const progressColorFn = (progress: number) => {
  if (progress < 50) return "bg-red-400 border-red-500";
  else if (progress >= 50 && progress < 70)
    return "bg-orange-400 border-orange-500";
  return "bg-green-400 border-green-500";
};

interface TableViewProps {
  keyResults: KeyResult[];
  refetch: () => void;
}

const TableView = ({ keyResults, refetch }: TableViewProps) => {
  const { timeFrameId } = useParams();
  const { project } = useProject();
  if (!keyResults.length) {
    return (
      <div className="flex items-center justify-center gap-2 flex-col h-[50vh]">
        <TriangleAlert size={35} className="text-orange-500" />
        <span>No Key Result has been created yet.</span>
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
            <TableHead className="min-w-[150px] text-foreground text-center border-r">
              Current Value
            </TableHead>
            <TableHead className="min-w-[150px] text-foreground text-center border-r">
              Target Value
            </TableHead>
            <TableHead className="min-w-[200px] text-foreground text-center border-r">
              Team
            </TableHead>
            <TableHead className="min-w-[250px] text-foreground text-center border-r">
              Owner
            </TableHead>
            <TableHead className="min-w-[250px] text-foreground text-center border-r">
              Creator
            </TableHead>
            <TableHead className="min-w-[150px] text-foreground text-center border-r">
              Status
            </TableHead>
            <TableHead className="min-w-[150px] text-foreground text-center">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(keyResults || []).map((keyResult: KeyResult, i) => (
            <TableRow
              key={keyResult._id}
              className={cn(
                keyResult.progress === 100 &&
                  "bg-green-50 hover:bg-green-50 dark:bg-green-950"
              )}
            >
              <TableCell className="border-r">
                <Badge className="bg-orange-50 text-orange-400 border-orange-400">
                  KR.{i + 1}
                </Badge>
              </TableCell>
              <TableCell className="font-medium border-r">
                {keyResult.title}
              </TableCell>
              <TableCell className="border-r">
                <div className="flex items-center gap-1 text-center">
                  <div
                    className={cn(
                      progressColorFn(keyResult.progress),
                      "bg-muted border flex items-center rounded-full h-3 w-[50px]"
                    )}
                  >
                    <div
                      className={cn(
                        "h-2.5 rounded-full  flex items-center justify-center",
                        progressColorFn(keyResult.progress)
                      )}
                      style={{ width: `${keyResult.progress}%` }}
                    />
                  </div>
                  <span className="text-[8px]">
                    {formatNumber(keyResult.progress)}%
                  </span>
                </div>
              </TableCell>
              <TableCell className="border-r">
                <div className="flex items-center justify-center font-medium">
                  {keyResult.currentValue}({keyResult.unit})
                </div>
              </TableCell>
              <TableCell className="border-r">
                <div className="flex items-center justify-center font-medium">
                  {keyResult.targetValue}({keyResult.unit})
                </div>
              </TableCell>
              <TableCell className="border-r">
                <Badge className="text-blue-500 bg-blue-100 flex items-center justify-center">
                  {keyResult.team.name}
                </Badge>
              </TableCell>
              <TableCell className="border-r">
                <div className="flex items-center space-x-2 justify-center">
                  <Avatar className="flex items-center justify-center size-6">
                    <AvatarImage
                      src={keyResult?.owner?.avatar?.url}
                      alt="profile-picture"
                    />
                    <AvatarFallback className="bg-foreground text-card">
                      {keyResult.owner.fullName[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">
                    {keyResult.owner.fullName}
                  </span>
                </div>
              </TableCell>

              <TableCell className="border-r">
                <div className="flex items-center space-x-2 justify-center">
                  <Avatar className="flex items-center justify-center size-6">
                    <AvatarImage
                      src={keyResult?.creator?.avatar?.url}
                      alt="profile-picture"
                    />
                    <AvatarFallback className="bg-foreground text-card">
                      {keyResult.creator.fullName[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span>{keyResult.creator.fullName}</span>
                </div>
              </TableCell>
              <TableCell className="border-r">
                <Badge
                  className={cn(
                    OKR_STATUS_COLOR[keyResult.status],
                    "flex items-center justify-center"
                  )}
                >
                  {keyResult.status}
                </Badge>
              </TableCell>
              <TableCell className="min-w-[150px]">
                <div className="flex items-center justify-center gap-2">
                  {project?.role !== MemberRole.MEMBER && (
                    <>
                      <Delete
                        projectId={project?.projectId as string}
                        timeFrameId={timeFrameId as string}
                        refetch={refetch}
                        objectiveId={keyResult.objectiveId}
                        keyResultId={keyResult._id}
                      />
                      <Update refetch={refetch} keyResult={keyResult} />
                    </>
                  )}
                  <UpdateCurrentValue refetch={refetch} keyResult={keyResult} />
                  <MetricDialog
                    data={deduplicateByDate(keyResult.progressMetric)}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableView;
