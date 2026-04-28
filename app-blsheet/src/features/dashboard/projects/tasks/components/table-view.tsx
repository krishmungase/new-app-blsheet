import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { cn } from "@/lib/utils";
import useProject from "@/hooks/use-project";
import { MemberRole, Task, TaskStatus } from "@/types";
import { TASK_PRIORITY_COLOR, TASK_STATUS_COLOR } from "@/constants";

import DeleteTask from "./delete-task";
import AssignMember from "./assign-member";
import CreateUpdateTask from "./create-update-task";
import { Loader } from "lucide-react";

const TableView = ({
  tasks,
  refetchTasks,
  isLoading,
}: {
  tasks: Task[];
  refetchTasks: () => void;
  isLoading: boolean;
}) => {
  const navigate = useNavigate();
  const { project } = useProject();

  const redirectToTask = (task: Task) => {
    const url = `/dashboard/workspace/${project?.projectId}/tasks/${task._id}`;
    navigate(url);
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center py-10">
        <Loader className="animate-spin" size={15} />
      </div>
    );

  return (
    <div className="border rounded-tl-lg rounded-tr-lg overflow-auto w-full my-3">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-fit text-foreground text-center border-r">
              Task.No
            </TableHead>
            <TableHead className="min-w-[400px] text-foreground border-r">
              Title
            </TableHead>
            <TableHead className="min-w-[150px] text-foreground text-center border-r">
              Status
            </TableHead>
            <TableHead className="w-fit text-foreground text-center border-r">
              Priority
            </TableHead>
            <TableHead className="min-w-[200px] text-foreground text-center border-r">
              Assignees
            </TableHead>
            <TableHead className="min-w-[200px] text-foreground text-center border-r">
              Due Date
            </TableHead>

            <TableHead className="min-w-[200px] text-foreground text-center border-r">
              Creator
            </TableHead>
            {project?.role !== MemberRole.MEMBER && (
              <TableHead className="min-w-[150px] text-foreground text-center">
                Actions
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {(tasks || []).map((task: Task) => (
            <TableRow
              key={task._id}
              className={cn(
                task.status === TaskStatus.COMPLETED &&
                  "bg-green-50 hover:bg-green-50 dark:bg-green-950"
              )}
            >
              <TableCell className="border-r">
                <Badge className="rounded-full px-3 bg-active/10 text-active">
                  #{task.taskNumber}
                </Badge>
              </TableCell>

              <TableCell className="font-medium border-r">
                <div
                  className="mt-2 cursor-pointer"
                  onClick={() => redirectToTask(task)}
                >
                  <h1 className="text-[13px] font-[450] text-foregorund transition-all">
                    {task.title}
                  </h1>
                </div>
              </TableCell>

              <TableCell className="border-r">
                <Badge
                  className={cn(
                    TASK_STATUS_COLOR[task.status],
                    "flex items-center justify-center"
                  )}
                >
                  {task.status}
                </Badge>
              </TableCell>

              <TableCell className="border-r">
                <div className="flex items-center">
                  <Badge
                    className={cn(
                      TASK_PRIORITY_COLOR[task.priority],
                      "w-[80px] flex items-center justify-center"
                    )}
                  >
                    {task.priority.toUpperCase()}
                  </Badge>
                </div>
              </TableCell>

              <TableCell className="border-r">
                <div className="flex items-center justify-center">
                  {task.members.map((member) => (
                    <Avatar
                      className="bg-foreground text-card size-6 flex items-center justify-center"
                      key={member._id}
                    >
                      <AvatarFallback className="bg-foreground text-card size-6 text-sm">
                        {member.email[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ))}

                  {project?.role !== MemberRole.MEMBER &&
                    task.status !== TaskStatus.COMPLETED && (
                      <AssignMember
                        taskId={task._id}
                        projectId={task.projectId}
                        members={task.members}
                        refetchTasks={refetchTasks}
                      />
                    )}
                </div>
              </TableCell>

              <TableCell className="border-r">
                <div className="flex items-center justify-center">
                  {format(task.dueDate, "LLL dd, y")}
                </div>
              </TableCell>

              <TableCell className="border-r">
                <div className="space-x-1 flex items-center justify-center">
                  <Avatar className="flex items-center justify-center size-6">
                    <AvatarImage
                      src={task.creator?.avatar?.url}
                      alt="profile"
                    />
                    <AvatarFallback className="bg-foreground text-card text-sm">
                      {task?.creator?.fullName[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-foreground">
                    {task?.creator?.fullName}
                  </span>
                </div>
              </TableCell>

              {project?.role !== MemberRole.MEMBER && (
                <TableCell className="min-w-[150px]">
                  <div className="flex items-center gap-2 justify-center">
                    <CreateUpdateTask
                      projectId={task.projectId}
                      forUpdate={true}
                      refetchTasks={refetchTasks}
                      task={task}
                      taskId={task._id}
                    />
                    <DeleteTask
                      taskId={task._id}
                      projectId={task.projectId}
                      refetchTasks={refetchTasks}
                    />
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
