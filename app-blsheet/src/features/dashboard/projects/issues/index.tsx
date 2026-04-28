import { useParams } from "react-router-dom";
import { CircleDot } from "lucide-react";

import { cn } from "@/lib/utils";
import { Issue, IssueStatus } from "@/types";
import { Loader, Pagination, SearchInput } from "@/components";
import { useUpdateDocumentTitle } from "@/hooks";
import useProject from "@/hooks/use-project";

import IssueCard from "./components/issue-card";
import useGetIssues from "./hooks/use-get-issues";
import useGetIssueFilters from "./hooks/use-get-issues-filters";
import CreateOrUpdateIssue from "./components/create-or-update-issue";
import IssueFilters from "./components/issue-filters";

const ProjectIssues = () => {
  const { project } = useProject();
  const { projectId } = useParams();
  const {
    isLoading,
    refetch,
    issues,
    hasNextPage,
    hasPrevPage,
    totalPages,
    issueCounts,
  } = useGetIssues();
  const {
    title,
    status,
    setFilters,
    limit,
    page,
    assignedToMe,
    sortByCreated,
    createdByMe,
  } = useGetIssueFilters();

  useUpdateDocumentTitle({
    title: `Issues - ${project?.name}`,
  });

  return (
    <div className="grid sm:grid-cols-6">
      <div className="relative space-y-4 sm:col-span-4">
        <div className="flex items-center justify-between space-x-2">
          <SearchInput
            text={title!}
            fn={(title) =>
              setFilters({
                assignedToMe: assignedToMe as string,
                createdByMe: createdByMe as string,
                sortByCreated: sortByCreated as string,
                title,
              })
            }
            placeholder="Search all issues"
          />
          <CreateOrUpdateIssue
            refetchIssues={refetch}
            projectId={projectId as string}
          />
        </div>

        <div className="border rounded-lg">
          <div className="border-b p-3 justify-between flex items-center">
            <div className="flex items-center space-x-3 text-sm">
              <button
                onClick={() =>
                  setFilters({
                    assignedToMe: assignedToMe as string,
                    createdByMe: createdByMe as string,
                    sortByCreated: sortByCreated as string,
                    status: IssueStatus.OPEN,
                    title: title as string,
                  })
                }
                className={cn(
                  status !== IssueStatus.CLOSED && "text-active underline"
                )}
              >
                {issueCounts?.Open ?? 0} Open
              </button>

              <button
                onClick={() =>
                  setFilters({
                    assignedToMe: assignedToMe as string,
                    createdByMe: createdByMe as string,
                    sortByCreated: sortByCreated as string,
                    status: IssueStatus.CLOSED,
                    title: title as string,
                  })
                }
                className={cn(
                  status === IssueStatus.CLOSED && "text-active underline"
                )}
              >
                {issueCounts?.Closed ?? 0} Closed
              </button>
            </div>
            <div className="w-fit">
              <IssueFilters />
            </div>
          </div>
          {isLoading ? (
            <Loader />
          ) : issues?.length > 0 ? (
            issues.map((issue: Issue) => (
              <IssueCard issue={issue} key={issue._id} />
            ))
          ) : (
            <div className="flex items-center justify-center py-5 space-y-2 flex-col">
              <CircleDot />
              <span>No issues available at the moment</span>
            </div>
          )}
        </div>

        <Pagination
          totalPages={totalPages}
          hasNextPage={!hasNextPage}
          hasPrevPage={!hasPrevPage}
          limit={limit}
          page={page}
          setFilters={setFilters}
        />
      </div>
      <div className="col-span-2 hidden sm:block p-3"></div>
    </div>
  );
};

export default ProjectIssues;
