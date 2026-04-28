import { useState } from "react";
import { formatDate } from "date-fns";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

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
import { toast, useAuth } from "@/hooks";
import { Loader } from "@/components";
import { QUERY } from "@/constants";

import apis from "../../tasks/apis";
import { cn } from "@/lib/utils";

const chartConfig = {
  desktop: {
    label: "Count",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const MemberAnalytics = () => {
  const [report, setReport] = useState([]);
  const { projectId } = useParams();
  const { authToken } = useAuth();

  const { isLoading } = useQuery({
    queryKey: [QUERY.TASK.GET_COMPLETED_MEMBERS_TASKS, projectId],
    queryFn: () =>
      apis.getMembersCompletedTasks({ authToken, params: { projectId } }),
    onSuccess: ({ data }) => {
      const report = (data?.data || []).map((data: any) => ({
        count: data?.completedTasksCount,
        name: data?.user?.fullName,
        avatar: data?.user?.avatar?.url,
      }));
      setReport(report);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <Loader />
      </div>
    );
  }

  return <AreaChart report={report} />;
};

interface AreaChartProps {
  report: { count: number; name: string; avatar: string }[];
}

const AreaChart = ({ report }: AreaChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Warrior Board</CardTitle>
        <CardDescription>{formatDate(new Date(), "MMMM yyyy")}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className={cn(`aspect-auto w-full h-[200px]`)}
        >
          <BarChart
            accessibilityLayer
            data={report}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              hide
            />
            <XAxis dataKey="count" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="count"
              layout="vertical"
              fill="var(--color-desktop)"
              radius={4}
            >
              <LabelList
                dataKey="name"
                position="insideLeft"
                offset={8}
                className="fill-[--color-label]"
                fontSize={12}
              />
              <LabelList
                dataKey="count"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="text-muted-foreground">
          Spotlight the top performers blazing through their tasks and leading
          the team to success.
        </div>
      </CardFooter>
    </Card>
  );
};

export default MemberAnalytics;
