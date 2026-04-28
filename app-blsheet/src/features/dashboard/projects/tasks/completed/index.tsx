import useGetCompletedTasks from "../hooks/use-get-completed-tasks";
import TaskFilters from "../components/task-filters";
import { useParams } from "react-router-dom";
import useGetTaskFilters from "../hooks/use-get-task-filters";
import TaskCard from "../components/task-card";

import { Task } from "@/types";
import useProject from "@/hooks/use-project";
import { useUpdateDocumentTitle } from "@/hooks";
import { BackButton, Loader, Pagination } from "@/components";

const CompletedTasks = () => {
  const { project } = useProject();
  const { projectId } = useParams();
  const { setFilters, page, limit } = useGetTaskFilters();
  const {
    isLoading,
    tasks,
    refetch,
    total,
    hasNextPage,
    hasPrevPage,
    totalPages,
  } = useGetCompletedTasks();
  useUpdateDocumentTitle({ title: `Completed Tasks - ${project?.name}` });

  return (
    <div className="relative">
      <div className="p-2 bg-muted border flex-col sm:flex-row rounded-lg flex gap-2 sm:items-center sm:justify-between">
        <div className="flex items-center justify-center space-x-2">
          <BackButton url={`/dashboard/workspace/${projectId}/tasks`} />
          <h1 className="text-active font-medium w-full">
            Completed Tasks{" "}
            <span className="bg-primary px-4 text-sm py-1 rounded-full text-white">
              {total}
            </span>
          </h1>
        </div>
        <TaskFilters
          projectId={projectId as string}
          refetchTasks={refetch}
          hideCreate={true}
        />
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <div className="py-5 grid sm:grid-cols-2 xl:grid-cols-3 gap-3 justify-items-center">
          {tasks.map((task: Task) => (
            <TaskCard
              task={task}
              refetchTasks={refetch}
              key={task._id}
              isCompleted={true}
            />
          ))}
        </div>
      )}
      <div className="flex items-center justify-center">
        <Pagination
          totalPages={totalPages}
          hasNextPage={!hasNextPage}
          hasPrevPage={!hasPrevPage}
          setFilters={setFilters}
          page={page}
          limit={limit}
        />
      </div>
    </div>
  );
};

export default CompletedTasks;
