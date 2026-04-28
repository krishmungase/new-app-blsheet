import { Loader, Pagination } from "@/components";
import useGetTimeFrames from "./hooks/use-get-time-frames";
import useGetTimeFramesFilters from "./hooks/use-get-time-frames-filters";
import Header from "./components/header";
import Display from "./components/display";

import { useUpdateDocumentTitle } from "@/hooks";
import useProject from "@/hooks/use-project";

const TimeFrame = () => {
  const { project } = useProject();
  const { setFilters, page, limit } = useGetTimeFramesFilters();
  const {
    isLoading,
    timeFrames,
    totalPages,
    hasNextPage,
    hasPrevPage,
    total,
    refetch,
  } = useGetTimeFrames();
  useUpdateDocumentTitle({ title: `Time Frames - ${project?.name}` });

  return (
    <div className="relative">
      {!!timeFrames.length && <Header total={total} refetch={refetch} />}

      {isLoading ? (
        <Loader />
      ) : (
        <Display timeFrames={timeFrames} refetch={refetch} />
      )}

      {timeFrames?.length > 0 && (
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

export default TimeFrame;
