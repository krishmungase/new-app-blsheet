import { v4 as uuid } from "uuid";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, Plus, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Subtask } from "@/types";
import { Button } from "@/components";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import useUpdateTask from "../hooks/use-update-task";

interface SubtasksProps {
  subTasks: Subtask[];
  taskId: string;
  projectId: string;
  isEditor: boolean;
}

const Subtasks = ({ taskId, projectId, subTasks, isEditor }: SubtasksProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtask, setNewSubtask] = useState("");
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  const { mutate } = useUpdateTask({
    refetchTasks: () => {},
    form: null,
    hideToast: true,
    onClose: () => {},
  });

  useEffect(() => {
    setSubtasks(subTasks);
  }, [subTasks]);

  const completedCount = subtasks.filter((task) => task.completed).length;
  const progressPercentage =
    subtasks.length > 0 ? (completedCount / subtasks.length) * 100 : 0;

  const toggleSubtask = (id: string) => {
    const updatedData = subtasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setSubtasks(updatedData);
    mutate({ data: { taskId, subTasks: updatedData, projectId } });
  };

  const addSubtask = () => {
    if (newSubtask.trim()) {
      const newTask: Subtask = {
        id: uuid(),
        title: newSubtask.trim(),
        completed: false,
      };
      setSubtasks((prev) => [...prev, newTask]);
      setNewSubtask("");
      setIsAddingSubtask(false);
      mutate({
        data: { taskId, subTasks: [...subtasks, newTask], projectId },
      });
    }
  };

  const removeSubtask = (id: string) => {
    const updatedTasks = subtasks.filter((task) => task.id !== id);
    setSubtasks(updatedTasks);
    mutate({ data: { taskId, subTasks: updatedTasks, projectId } });
  };

  return (
    <div className="border rounded-lg bg-white dark:bg-secondary shadow-sm overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center bg-primary/10 justify-between p-3 transition-colors"
      >
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
          <span className="text-sm font-medium">
            Subtasks ({completedCount}/{subtasks.length})
          </span>
        </div>
        {subtasks.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="w-16 h-2 border rounded overflow-hidden">
              <div
                className={cn(
                  "h-full transition-all",
                  progressPercentage < 50
                    ? "bg-red-500"
                    : progressPercentage < 75
                    ? "bg-orange-500"
                    : "bg-green-500"
                )}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            <span className="text-xs w-7">
              {Math.round(progressPercentage)}%
            </span>
          </div>
        )}
      </button>

      {isExpanded && (
        <div className="border-gray-100">
          {subtasks.length > 0 && (
            <div className="p-3 space-y-2">
              {subtasks.map((subtask) => (
                <div key={subtask.id} className="flex items-center gap-2 group">
                  <Checkbox
                    checked={subtask.completed}
                    onCheckedChange={() => {
                      if (isEditor) toggleSubtask(subtask.id);
                    }}
                    className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                  />
                  <span
                    className={`flex-1 text-xs ${
                      subtask.completed ? "line-through" : ""
                    }`}
                  >
                    {subtask.title}
                  </span>

                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:bg-red-100 hover:text-red-500",
                      !isEditor && "group-hover:opacity-0"
                    )}
                    onClick={() => {
                      if (isEditor) removeSubtask(subtask.id);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          {isEditor && (
            <div className="border-t border-primary/20 p-2">
              {isAddingSubtask ? (
                <div className="flex gap-2">
                  <Input
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    placeholder="Enter subtask title..."
                    className="text-sm h-8 w-full"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") addSubtask();
                      if (e.key === "Escape") {
                        setIsAddingSubtask(false);
                        setNewSubtask("");
                      }
                    }}
                    autoFocus
                  />
                  <Button
                    size="sm"
                    className="text-xs"
                    onClick={addSubtask}
                    disabled={!newSubtask.trim()}
                  >
                    Add
                  </Button>
                  <Button
                    size="sm"
                    className="text-xs"
                    variant="ghost"
                    onClick={() => {
                      setIsAddingSubtask(false);
                      setNewSubtask("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <button
                  className="text-primary text-sm flex items-center gap-1 justify-center w-full hover:underline"
                  onClick={() => setIsAddingSubtask(true)}
                >
                  <Plus size={15} />
                  Add subtask
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Subtasks;
