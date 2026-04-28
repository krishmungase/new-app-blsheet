import { useState } from "react";
import { useQuery } from "react-query";
import {
  CircleDashedIcon,
  ListTodoIcon,
  ScanEyeIcon,
  CircleCheckBigIcon,
} from "lucide-react";

import { toast, useAuth } from "@/hooks";
import { TaskStatus } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import apis from "../../tasks/apis";
import { GridEffect, Loader } from "@/components";
import { useParams } from "react-router-dom";

const TaskIcons = {
  [TaskStatus.TODO]: <ListTodoIcon className="text-red-500" size={20} />,
  [TaskStatus.IN_PROGRESS]: (
    <CircleDashedIcon className="text-orange-500" size={20} />
  ),
  [TaskStatus.UNDER_REVIEW]: (
    <ScanEyeIcon className="text-blue-500" size={20} />
  ),
  [TaskStatus.COMPLETED]: (
    <CircleCheckBigIcon className="text-green-500" size={20} />
  ),
};

const LoadingCard = () => {
  return (
    <div className="w-full h-[100px] flex items-center justify-center">
      <Loader />
    </div>
  );
};

const TaskAnalyticsCard = ({
  status,
  count,
}: {
  status: TaskStatus;
  count: number;
}) => {
  return (
    <Card className="w-full relative">
      <GridEffect />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{status} Task</CardTitle>
        {TaskIcons[status]}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{count}</div>
      </CardContent>
    </Card>
  );
};

const TaskAnalytics = () => {
  const { projectId } = useParams();
  const [data, setData] = useState([]);
  const { authToken } = useAuth();

  const { isLoading } = useQuery({
    queryKey: ["GET_USER_ASSIGNED_TASKS", projectId],
    queryFn: () =>
      apis.getUserAssignedTasks({ authToken, params: { projectId } }),
    onSuccess: ({ data }) => {
      setData(data?.data?.tasks);
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

  if (isLoading) return <LoadingCard />;

  return (
    <div>
      <h1 className="font-medium mb-2">Your Tasks Analytics</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.map((info: { status: TaskStatus; count: number }) => (
          <TaskAnalyticsCard
            key={info.status}
            status={info.status}
            count={info.count}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskAnalytics;
