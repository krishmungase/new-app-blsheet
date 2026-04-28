import { Loader, Pagination } from "@/components";

import useGetObjective from "../hooks/use-get-objective";
import useGetKeyResults from "./hooks/use-get-key-results";

import Header from "./components/header";
import Details from "./components/details";
import TableView from "./components/table";
import useGetKeyResultFilters from "./hooks/use-get-key-result-filters";
import KeyResultHeader from "./components/key-result-header";
import { useUpdateDocumentTitle } from "@/hooks";
import useProject from "@/hooks/use-project";

const ObjectiveDetails = () => {
  const { project } = useProject();
  const { page, limit, setFilters } = useGetKeyResultFilters();
  const { objective, isLoading, refetch } = useGetObjective();
  const {
    keyResults,
    refetch: refetchKRs,
    isLoading: loadingKRs,
    hasNextPage,
    hasPrevPage,
    totalPages,
    total,
  } = useGetKeyResults();
  useUpdateDocumentTitle({
    title: `Objective & Key Result - ${project?.name}`,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="relative">
      <Header
        refetch={() => {
          refetch();
          refetchKRs();
        }}
        objective={objective}
      />
      <Details objective={objective} />
      <KeyResultHeader total={total} />
      {loadingKRs ? (
        <Loader />
      ) : (
        <TableView
          refetch={() => {
            refetch();
            refetchKRs();
          }}
          keyResults={keyResults}
        />
      )}

      {keyResults?.length > 0 && (
        <div className="pt-3">
          <Pagination
            setFilters={setFilters}
            page={page}
            limit={limit}
            totalPages={totalPages}
            hasNextPage={!hasNextPage}
            hasPrevPage={!hasPrevPage}
          />
        </div>
      )}
    </div>
  );
};

export default ObjectiveDetails;
