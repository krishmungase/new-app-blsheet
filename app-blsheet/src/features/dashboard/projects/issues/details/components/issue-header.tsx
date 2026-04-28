import { VscIssues } from "react-icons/vsc";
import { formatDistance } from "date-fns";
import { useIssueContext } from "../provider";
import { cn } from "@/lib/utils";
import { IssueStatus } from "@/types";

const IssueHeader = () => {
  const { issue } = useIssueContext();

  if (!issue) return null;

  return (
    <div className="border-b pb-2 border-primary/50">
      <div className="flex items-center justify-between">
        <h1 className="text-active font-medium">{issue?.title}</h1>
      </div>

      <div className="flex items-center space-y-2 mt-1">
        <div className="md:flex items-center justify-center space-x-2">
          <div className="flex items-center space-x-2">
            <div
              className={cn(
                "flex items-center justify-center space-x-1 rounded-full px-4 py-1 text-white",
                issue.status === IssueStatus.CLOSED
                  ? "bg-red-500"
                  : "bg-emerald-700"
              )}
            >
              <VscIssues />
              <span>{issue?.status}</span>
            </div>
            <span className="text-sm text-foreground font-medium">
              {issue.creator.fullName}
            </span>
          </div>

          <div className="sm:flex text-muted-foreground items-center justify-center">
            <div className="text-sm">
              opened this issue {formatDistance(issue.createdAt, new Date())}{" "}
              ago
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueHeader;
