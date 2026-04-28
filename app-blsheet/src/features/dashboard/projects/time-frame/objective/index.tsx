import { AlertCircle } from "lucide-react";
import { Loader, Pagination } from "@/components";

import Header from "./components/header";
import { TimeFrameContext } from "./provider";
import useGetTimeFrame from "../hooks/use-get-time-frame";
import useGetObjectives from "./hooks/use-get-objectives";
import TableView from "./components/table";
import useGetObjectivesFilters from "./hooks/use-get-objective-filters";

import { useUpdateDocumentTitle } from "@/hooks";
import useProject from "@/hooks/use-project";

const Objective = () => {
  const { project } = useProject();
  const { setFilters, page, limit } = useGetObjectivesFilters();
  const { timeFrame, isLoading } = useGetTimeFrame();
  const {
    isLoading: loading,
    objectives,
    refetch,
    total,
    totalPages,
    hasNextPage,
    hasPrevPage,
  } = useGetObjectives();
  useUpdateDocumentTitle({ title: `Objectives - ${project?.name}` });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader />
      </div>
    );
  }

  if (!timeFrame) {
    return (
      <div className="flex items-center flex-col gap-2 justify-center h-[50vh]">
        <AlertCircle className="text-orange-400" size={20} />
        <span className="font-medium">Time frame not found!</span>
      </div>
    );
  }

  return (
    <TimeFrameContext.Provider value={{ timeFrame }}>
      <div className="relative">
        <Header refetch={refetch} total={total} />
        {loading ? (
          <Loader />
        ) : (
          <TableView refetch={refetch} objectives={objectives} />
        )}
      </div>

      {objectives?.length > 0 && (
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
    </TimeFrameContext.Provider>
  );
};

export default Objective;
