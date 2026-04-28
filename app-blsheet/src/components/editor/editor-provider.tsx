import { type Editor } from "@tiptap/react";
import { createContext, useContext } from "react";

interface EditorContext {
  editor: Editor | null;
  setEditor: (editor: Editor | null) => void;
  leftMargin: number;
  setLeftMargin: React.Dispatch<React.SetStateAction<number>>;
  rightMargin: number;
  setRightMargin: React.Dispatch<React.SetStateAction<number>>;
  isLoading: boolean;
}

export const EditorContext = createContext<EditorContext>({
  editor: null,
  setEditor: () => {},
  leftMargin: 56,
  setLeftMargin: () => {},
  rightMargin: 56,
  setRightMargin: () => {},
  isLoading: false,
});

export const useEditorContext = () => {
  const context = useContext(EditorContext);
  if (!context) throw new Error("Editor context not found");
  return context;
};
