import { useState } from "react";
import { Loader, Pagination } from "@/components";

import useGetLabels from "./hooks/use-get-labels";
import TagButton from "./components/tag-button";
import CreateLabelForm from "./components/create-label-form";
import CreateLabelButton from "./components/create-label-button";
import SearchFilter from "./components/search-filter";
import useGetLabelsFilters from "./hooks/use-get-labels-filters";
import LabelTable from "./components/label-table";

import { Label } from "@/types";
import { useUpdateDocumentTitle } from "@/hooks";
import useProject from "@/hooks/use-project";

const Labels = () => {
  const { project } = useProject();
  const [isCreate, setIsCreate] = useState(false);
  const { page, limit, setFilters } = useGetLabelsFilters();
  const [updateLabel, setUpdateLabel] = useState<Label | null>(null);
  const {
    refetch,
    isLoading,
    labels,
    total,
    hasNextPage,
    hasPrevPage,
    totalPages,
  } = useGetLabels();
  useUpdateDocumentTitle({ title: `Labels - ${project?.name}` });

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 w-full">
          <TagButton />
          <div className="w-full hidden md:block">
            <SearchFilter />
          </div>
        </div>
        <CreateLabelButton
          toggleCreateLabel={() => setIsCreate((prev) => !prev)}
        />
      </div>

      <div className="w-full block md:hidden mt-2">
        <SearchFilter />
      </div>

      {(isCreate || updateLabel) && (
        <div className="mt-3">
          <CreateLabelForm
            refetch={refetch}
            closeCreateLabelForm={() => {
              setIsCreate(false);
              setUpdateLabel(null);
            }}
            label={updateLabel as Label}
            forUpdate={!!updateLabel}
            setUpdatedLabel={setUpdateLabel}
          />
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center h-[300px]">
          <Loader />
        </div>
      ) : (
        <div className="mt-2">
          <LabelTable
            refetch={refetch}
            labels={labels}
            total={total}
            setUpdateLabel={setUpdateLabel}
          />
        </div>
      )}

      <div className="mt-3">
        <Pagination
          totalPages={totalPages}
          hasNextPage={!hasNextPage}
          hasPrevPage={!hasPrevPage}
          limit={limit}
          page={page}
          setFilters={setFilters}
        />
      </div>
    </div>
  );
};

export default Labels;
