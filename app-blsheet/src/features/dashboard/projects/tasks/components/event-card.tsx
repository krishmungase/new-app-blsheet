import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Task } from "@/types";
import { TASK_CARD_BORDER_COLOR, TASK_STATUS_DOT_COLOR } from "@/constants";

interface EventCard {
  task: Task;
}

const EventCard = ({ task }: EventCard) => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const handleOnClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    const url = `/dashboard/workspace/${projectId}/tasks/${task._id}`;
    navigate(url);
  };

  return (
    <div
      onClick={handleOnClick}
      className={cn(
        "rounded-md p-1 border-l-2 text-xs bg-muted cursor-pointer",
        TASK_CARD_BORDER_COLOR[task.priority]
      )}
    >
      <div className="w-full">
        <div className="flex items-center space-x-1">
          <div
            className={cn(
              "rounded-full !size-2",
              TASK_STATUS_DOT_COLOR[task.status]
            )}
          />
          <h1 className="text-primary truncate font-medium">{task.title}</h1>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
