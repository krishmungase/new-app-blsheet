import { MemberRole } from "@/types";
import { Pagination, SearchInput } from "@/components";
import useProject from "@/hooks/use-project";

import CreateTeam from "./components/create-team";
import useGetTeams from "./hooks/use-get-teams";
import useGetTeamsFilters from "./hooks/use-get-teams-filters";
import TeamTable from "./components/team-table";
import { useUpdateDocumentTitle } from "@/hooks";

const ProjectTeams = () => {
  const { page, limit, name, setFilters } = useGetTeamsFilters();
  const { project } = useProject();
  const {
    isLoading,
    teams,
    refetch,
    total,
    totalPages,
    hasNextPage,
    hasPrevPage,
  } = useGetTeams({
    projectId: project?.projectId as string,
  });

  useUpdateDocumentTitle({
    title: `Teams - ${project?.name}`,
  });

  return (
    <div className="space-y-2">
      <div className="p-2 bg-muted border flex-col sm:flex-row rounded-lg flex gap-2 sm:items-center sm:justify-between">
        <div className="text-center">
          <span className="text-base">Project Teams</span>{" "}
          <span className="text-card bg-secondary-foreground rounded-xl sm:px-2 px-4 md:px-4 text-xs md:text-sm py-1">
            {total}
          </span>
        </div>

        <div className="flex items-center sm:space-x-2 flex-col sm:flex-row gap-2">
          <SearchInput
            fn={(name?: string) => setFilters({ name })}
            text={name ? name : ""}
            placeholder="Search all teams"
          />
          {project?.role !== MemberRole.MEMBER && (
            <CreateTeam
              refetch={refetch}
              projectId={project?.projectId as string}
            />
          )}
        </div>
      </div>
      <TeamTable teams={teams} isLoading={isLoading} refetchTeams={refetch} />
      {!!teams?.length && (
        <div className="pt-3">
          <Pagination
            setFilters={setFilters}
            page={page ? page : 1}
            limit={limit ? limit : 10}
            totalPages={totalPages}
            hasNextPage={!hasNextPage}
            hasPrevPage={!hasPrevPage}
          />
        </div>
      )}
    </div>
  );
};

export default ProjectTeams;
