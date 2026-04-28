import useProject from "@/hooks/use-project";
import { useUpdateDocumentTitle } from "@/hooks";

import BoardView from "./components/board-view";
import useGetTasks from "./hooks/use-get-tasks";
import TaskFilters from "./components/task-filters";
import TableView from "./components/table-view";
import useGetTaskFilters from "./hooks/use-get-task-filters";
import CalendarView from "./components/calendar-view";

const ProjectTasks = () => {
  const { project } = useProject();
  const { tasks, refetch, isLoading } = useGetTasks();
  const { view } = useGetTaskFilters();

  useUpdateDocumentTitle({
    title: `Tasks - ${project?.name}`,
  });

  return (
    <div className="space-y-2">
      <div className="p-2 bg-muted border flex-col sm:flex-row rounded-lg flex gap-2 sm:items-center sm:justify-between">
        <div className="flex items-center justify-center space-x-2">
          <h1 className="text-base">Tasks</h1>
        </div>
        <TaskFilters refetchTasks={refetch} projectId={project?.projectId!} />
      </div>
      {view === "table" ? (
        <TableView tasks={tasks} refetchTasks={refetch} isLoading={isLoading} />
      ) : view === "calendar" ? (
        <CalendarView
          tasks={tasks}
          refetchTask={refetch}
          isLoading={isLoading}
        />
      ) : (
        <BoardView tasks={tasks} refetchTasks={refetch} isLoading={isLoading} />
      )}
    </div>
  );
};

export default ProjectTasks;
