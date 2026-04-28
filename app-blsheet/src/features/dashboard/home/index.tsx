import Tasks from "./components/tasks";
import Projects from "./components/projects";
import CompletedTaskAnalytics from "./components/completed-task-analytics";
import TaskAnalyticsCards from "./components/task-analyitcs-cards";
import { useUpdateDocumentTitle } from "@/hooks";

const DashboardHome = () => {
  useUpdateDocumentTitle({
    title: "Your Dashboard",
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        <Projects />
        <Tasks />
      </div>

      <TaskAnalyticsCards />

      <CompletedTaskAnalytics />
    </div>
  );
};

export default DashboardHome;
