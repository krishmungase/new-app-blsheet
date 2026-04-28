import { Pagination } from "@/components";

import DocsFilters from "./components/docs-filters";
import DocTable from "./components/doc-table";
import useGetDocs from "./hooks/use-get-docs";
import useGetDocsFilters from "./hooks/use-get-docs-filters";
import DocumentHeader from "./components/document-header";

import { useUpdateDocumentTitle } from "@/hooks";
import useProject from "@/hooks/use-project";

const ProjectDocs = () => {
  const { project } = useProject();
  const { docs, isLoading, refetch, totalPages, hasNextPage, hasPrevPage } =
    useGetDocs();
  const { page, limit, setFilters } = useGetDocsFilters();
  useUpdateDocumentTitle({ title: `Docs - ${project?.name}` });

  return (
    <div className="space-y-2">
      <div className="p-2 bg-muted border flex-col sm:flex-row rounded-lg flex gap-2 sm:items-center sm:justify-between">
        <div className="flex items-center justify-center space-x-2">
          <h1 className="text-base">Documents </h1>
        </div>
        <DocsFilters />
      </div>
      <DocumentHeader />

      <DocTable docs={docs} isLoading={isLoading} refetchDocs={refetch} />

      {docs?.length > 0 && (
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

export default ProjectDocs;
