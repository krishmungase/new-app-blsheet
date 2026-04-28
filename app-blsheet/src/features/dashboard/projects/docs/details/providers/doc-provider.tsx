import { type Editor } from "@tiptap/react";
import { createContext, useContext } from "react";

import { Document } from "@/types";

interface DocContext {
  doc: Document | null;
  refetchDoc: () => void;
  editor: Editor | null;
  setEditor: (editor: Editor | null) => void;
  isLoading: boolean;
}

export const DocContext = createContext<DocContext>({
  doc: null,
  refetchDoc: () => {},
  editor: null,
  setEditor: () => {},
  isLoading: false,
});

export const useDocContext = () => {
  const context = useContext(DocContext);
  if (!context || !context.doc) throw new Error("Doc context not found");
  return context;
};
