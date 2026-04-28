import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { type Editor as EditorType } from "@tiptap/react";

import { DocContext } from "./providers/doc-provider";
import useGetDoc from "../hooks/use-get-doc";
import useUpdateDoc from "../hooks/use-update-doc";
import DocCards from "./components/doc-cards";
import DispayDoc from "./components/display-doc";

import { MemberRole } from "@/types";
import { useDebounce, useUpdateDocumentTitle } from "@/hooks";
import { BackButton, Loader } from "@/components";
import Editor from "@/components/editor";
import useProject from "@/hooks/use-project";

const SingleDocPage = () => {
  const { projectId } = useParams();
  const [editor, setEditor] = useState<EditorType | null>(null);
  const { doc, isLoading, refetch } = useGetDoc();
  const { mutate } = useUpdateDoc({});
  const { project } = useProject();
  useUpdateDocumentTitle({ title: `Doc Details - ${project?.name}` });

  const [localSearch, setLocalSearch] = useState(doc?.content);
  const debouncedSearch = useDebounce(localSearch);

  useEffect(() => {
    if (debouncedSearch)
      mutate({
        data: { content: debouncedSearch, docId: doc?._id, projectId },
      });
  }, [debouncedSearch]);

  if (isLoading) return <Loader />;

  if (project?.role === MemberRole.MEMBER && !doc?.isCreator && !doc?.isMember)
    return <DispayDoc doc={doc} />;

  return (
    <DocContext.Provider
      value={{
        editor,
        setEditor,
        doc,
        isLoading,
        refetchDoc: refetch,
      }}
    >
      <div className="grid relative gap-4 xl:gap-0 xl:grid-cols-9">
        <div className="absolute top-12 z-50 hidden xl:block">
          <BackButton />
        </div>
        <div className="relative w-full xl:col-span-7 overflow-x-auto">
          <Editor
            onChange={(editor: EditorType | null) => {
              setLocalSearch(editor?.getHTML());
            }}
            content={doc?.content}
            _leftMargin={doc?.leftMargin}
            _rightMargin={doc?.rightMargin}
            isLoading={isLoading}
          />
        </div>
        <div className="w-full xl:col-span-2 xl:pt-16">
          <DocCards />
        </div>
      </div>
    </DocContext.Provider>
  );
};

export default SingleDocPage;
