import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { useQuery } from "react-query";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { toast, useAuth } from "@/hooks";
import { Loader } from "@/components";
import apis from "../../projects/tasks/apis";

const chartConfig = {
  desktop: {
    label: "Completed Tasks",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const CompletedTaskAnalytics = () => {
  const [data, setData] = useState([]);
  const { authToken } = useAuth();
  const { isLoading } = useQuery({
    queryKey: ["LAST_30_DAYS_TASKS"],
    queryFn: () => apis.getLast30DaysTasks({ authToken }),
    onSuccess: ({ data }) => {
      setData(data?.data);
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
    <Card>
      <CardHeader>
        <CardTitle>Completed Task</CardTitle>
        <CardDescription>Last 30 days</CardDescription>
      </CardHeader>
      {isLoading ? (
        <Loader />
      ) : (
        <CardContent>
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <BarChart accessibilityLayer data={data}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="completedDate"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="count" fill="var(--color-desktop)" radius={8} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      )}
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing completed tasks for the last 30 days
        </div>
      </CardFooter>
    </Card>
  );
};

export default CompletedTaskAnalytics;
