import { MemberRole, Task } from "@/types";
import { Badge } from "@/components/ui/badge";
import useProject from "@/hooks/use-project";
import {
  TASK_LEVLE,
  TASK_PRIORITY_COLOR,
  TASK_STATUS_COLOR,
} from "@/constants";

import AssignMember from "../../components/assign-member";
import MemberCard from "../../components/member-card";
import ChangeStatus from "../../components/change-status";

interface TaskCardProps {
  task: Task;
  refetchTask: () => void;
}

const TaskCard = ({ task, refetchTask }: TaskCardProps) => {
  const { project } = useProject();
  if (!task) return null;

  return (
    <div className="space-y-3 w-full col-span-2">
      <div className="space-y-2 p-3 rounded-lg bg-muted border shadow-sm h-fit w-full">
        <div className="flex items-center justify-between">
          <h1 className="text-primary text-sm font-bold">Assingees</h1>
          {project?.role !== MemberRole.MEMBER && (
            <AssignMember
              members={task?.members!}
              projectId={project?.projectId!}
              taskId={task?._id!}
              refetchTasks={refetchTask}
            />
          )}
        </div>

        <div className="flex items-center w-full flex-col space-y-1 pt-2">
          {task.members.length > 0 ? (
            task?.members.map((member) => (
              <MemberCard
                key={member._id}
                taskId={task?._id}
                member={member}
                refetchTasks={refetchTask}
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

      <div className="space-y-2 p-3 rounded-lg bg-muted border shadow-sm h-fit w-full">
        <h1 className="text-primary text-sm font-bold">Priority</h1>
        <div className="flex items-center">
          <Badge className={TASK_PRIORITY_COLOR[task?.priority!]}>
            {task?.priority}
          </Badge>
        </div>
      </div>

      <div className="space-y-2 p-3 rounded-lg bg-muted border shadow-sm h-fit w-full">
        <h1 className="text-primary text-sm font-bold">Update Status</h1>
        {project?.role !== MemberRole.MEMBER ? (
          <ChangeStatus
            refetch={refetchTask}
            value={task.status}
            taskId={task._id}
            level={[0, 4]}
          />
        ) : task.isMember ? (
          <ChangeStatus
            refetch={refetchTask}
            value={task.status}
            taskId={task._id}
            level={TASK_LEVLE[task.status]}
          />
        ) : (
          <div className="flex items-center">
            <Badge className={TASK_STATUS_COLOR[task?.status!]}>
              {task?.status}
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
