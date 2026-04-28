import { useState } from "react";
import { Editor as EditorType } from "@tiptap/react";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import Image from "@tiptap/extension-image";
import ImageResize from "tiptap-extension-resize-image";
import Underline from "@tiptap/extension-underline";
import FontFamily from "@tiptap/extension-font-family";
import TextStyle from "@tiptap/extension-text-style";
import Heading from "@tiptap/extension-heading";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";

import Ruler from "./ruler";
import Toolbar from "./toolbar";
import { EditorContext } from "./editor-provider";
import { FontSizeExtension } from "@/extensions/font-size";
import { useSidebar } from "../ui/sidebar";

interface EditorProps {
  content: string;
  _leftMargin: number;
  _rightMargin: number;
  isLoading: boolean;
  onChange?: (editor: EditorType | null) => void;
}

const Editor = ({
  content,
  _leftMargin,
  _rightMargin,
  isLoading,
  onChange = () => {},
}: EditorProps) => {
  const { isMobile } = useSidebar();
  const [editor, setEditor] = useState<EditorType | null>(null);
  const [leftMargin, setLeftMargin] = useState<number>(_leftMargin ?? 56);
  const [rightMargin, setRightMargin] = useState<number>(_rightMargin ?? 56);

  const originalEditor = useEditor({
    onCreate: ({ editor }) => setEditor(editor),
    onDestroy: () => setEditor(null),
    onUpdate: ({ editor }) => {
      onChange(editor);
      setEditor(editor);
    },
    onSelectionUpdate: ({ editor }) => setEditor(editor),
    onTransaction: ({ editor }) => setEditor(editor),
    onFocus: ({ editor }) => setEditor(editor),
    onBlur: ({ editor }) => setEditor(editor),
    editorProps: {
      attributes: {
        style: `padding-left:${isMobile ? 10 : leftMargin}px; padding-right:${
          isMobile ? 10 : rightMargin
        }px;`,
        class:
          "focus:outline-none print:border-0 bg-background border border flex flex-col min-h-[1054px] xl:w-[816px] pt-10 pb-10 cursor-text",
      },
    },
    extensions: [
      StarterKit,
      FontSizeExtension,
      Color,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),
      Highlight.configure({
        multicolor: true,
      }),
      TextStyle,
      FontFamily,
      TableRow,
      TableHeader,
      Heading.configure({
        levels: [1, 2, 3, 4, 5],
      }),
      Image,
      Underline,
      ImageResize,
      Table.configure({
        resizable: true,
      }),
      TableCell,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content,
  });

  return (
    <EditorContext.Provider
      value={{
        editor,
        setEditor,
        leftMargin,
        setLeftMargin,
        rightMargin,
        setRightMargin,
        isLoading,
      }}
    >
      <Toolbar />
      <Ruler />
      <div className="h-[calc(100vh_-200px)] overflow-y-auto">
        <div className="overflow-x-auto print:p-0 print:bg-white bg-background print:overflow-visible print:text-black">
          <div className="flex justify-center xl:w-[816px] py-4 print:py-0 mx-auto print:w-full print:min-w-0">
            <EditorContent editor={originalEditor} />
          </div>
        </div>
      </div>
    </EditorContext.Provider>
  );
};

export default Editor;
