import { SearchInput, SelectFilters } from "@/components";
import { TaskPriority } from "@/types";

import useGetTaskFilters from "../hooks/use-get-task-filters";
import { PRIORITY_OPTIONS, TASK_VIEW_OPTIONS } from "@/constants";
import CreateTask from "./create-update-task";
import MultiSelectFilters from "@/components/shared/multi-select-filters";

interface TaskFiltersProps {
  projectId: string;
  refetchTasks: () => void;
  hideCreate?: boolean;
}

const TaskFilters = ({
  projectId,
  refetchTasks,
  hideCreate,
}: TaskFiltersProps) => {
  const {
    title,
    setFilters,
    priority,
    assignedToMe,
    createdByMe,
    sortByCreated,
    view,
  } = useGetTaskFilters();

  return (
    <div className="flex items-center sm:space-x-2 flex-col sm:flex-row gap-2">
      <SearchInput
        fn={(title?: string) =>
          setFilters({
            assignedToMe: assignedToMe as string,
            createdByMe: createdByMe as string,
            sortByCreated: sortByCreated as string,
            title,
          })
        }
        text={title ? title : ""}
        placeholder="Search all tasks"
      />

      <SelectFilters
        fn={(value: string) =>
          setFilters({
            assignedToMe: assignedToMe as string,
            createdByMe: createdByMe as string,
            sortByCreated: sortByCreated as string,
            title: title as string,
            priority: priority as TaskPriority,
            view: value === "All" ? "board" : value,
          })
        }
        title="View"
        selectedValue={view ? view : "board"}
        options={TASK_VIEW_OPTIONS}
      />

      <div className="flex items-center justify-center gap-2 w-full">
        <MultiSelectFilters
          title="Filters"
          options={[
            {
              value: "assignedToMe",
              label: "Assigned To Me",
              isSelected: assignedToMe === "true",
            },
            {
              value: "createdByMe",
              label: "Created By Me",
              isSelected: createdByMe === "true",
            },
            {
              value: "sortByCreated",
              label: "Sort By Created",
              isSelected: sortByCreated === "true",
            },
          ]}
          fn={(value: any) => {
            setFilters({
              assignedToMe,
              sortByCreated,
              createdByMe,
              title: title as string,
              priority,
              ...value,
            });
          }}
        />
        <SelectFilters
          fn={(value: TaskPriority) =>
            setFilters({
              assignedToMe: assignedToMe as string,
              createdByMe: createdByMe as string,
              sortByCreated: sortByCreated as string,
              title: title as string,
              priority: value,
            })
          }
          title="Priority"
          selectedValue={priority ? priority : "All"}
          options={PRIORITY_OPTIONS}
        />
        {!hideCreate && (
          <div className="w-full hidden sm:block">
            <CreateTask projectId={projectId} refetchTasks={refetchTasks} />
          </div>
        )}
      </div>

      {!hideCreate && (
        <div className="w-full sm:hidden">
          <CreateTask projectId={projectId} refetchTasks={refetchTasks} />
        </div>
      )}
    </div>
  );
};

export default TaskFilters;
