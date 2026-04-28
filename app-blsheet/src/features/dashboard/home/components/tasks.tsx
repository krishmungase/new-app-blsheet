import { ClipboardPlus, ListTodo } from "lucide-react";
import { useState } from "react";
import { useQuery } from "react-query";

import { toast, useAuth } from "@/hooks";
import { Loader } from "@/components";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import apis from "../../projects/tasks/apis";

const Tasks = () => {
  const [count, setCount] = useState([]);
  const [createdTasks, setCreatedTasks] = useState(0);
  const { authToken } = useAuth();

  const { isLoading } = useQuery({
    queryKey: ["GET_USER_ASSIGNED_TASKS"],
    queryFn: () => apis.getUserAssignedTasks({ authToken }),
    onSuccess: ({ data }) => {
      const count = (data?.data?.tasks || []).reduce(
        (acc: number, item: any) => Number(acc) + item.count,
        []
      );
      setCount(count);
      setCreatedTasks(data?.data?.createdTasks?.taskCount ?? 0);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.response?.data?.message,
      });
    },
    retry: false,
  });

  return (
    <>
      <Card className="w-full h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Assigned Tasks
          </CardTitle>
          <ListTodo className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        {isLoading ? (
          <Loader />
        ) : (
          <CardContent>
            <div className="text-2xl font-bold">{count}</div>
            <div className="flex sm:items-center flex-col gap-2 sm:flex-row sm:justify-between mt-2 text-xs">
              Total tasks assigned to you across all projects
            </div>
          </CardContent>
        )}
      </Card>
      <Card className="w-full h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Created Tasks
          </CardTitle>
          <ClipboardPlus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        {isLoading ? (
          <Loader />
        ) : (
          <CardContent>
            <div className="text-2xl font-bold">{createdTasks}</div>
            <div className="flex sm:items-center flex-col gap-2 sm:flex-row sm:justify-between mt-2 text-xs">
              Total tasks created by you across all projects
            </div>
          </CardContent>
        )}
      </Card>
    </>
  );
};

export default Tasks;
