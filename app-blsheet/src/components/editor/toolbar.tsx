import {
  LucideIcon,
  PrinterIcon,
  Redo2Icon,
  Undo2Icon,
  SpellCheckIcon,
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  ListTodoIcon,
  RemoveFormattingIcon,
} from "lucide-react";

import ToolbarButton from "./toolbar-button";
import { useEditorContext } from "./editor-provider";
import { Separator } from "../ui/separator";
import FontFamilyButton from "./font-family-button";
import HeadingButton from "./heading-button";
import TextColorButton from "./text-color-button";
import HighlightTextButton from "./highlight-text-button";
import LinkButton from "./link-button";
import ImageButton from "./img-button";
import TextAlignButton from "./text-align-button";
import ListButton from "./list-button";
import FontSizeButton from "./font-size-button";
import DownloadPdf from "./download-pdf";

interface Section {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  isActive?: boolean;
}

const Toolbar = () => {
  const { editor } = useEditorContext();

  const sections: Section[][] = [
    [
      {
        label: "Undo",
        icon: Undo2Icon,
        onClick: () => editor?.chain().focus().undo().run(),
      },
      {
        label: "Redo",
        icon: Redo2Icon,
        onClick: () => editor?.chain().focus().redo().run(),
      },
      {
        label: "Print",
        icon: PrinterIcon,
        onClick: () => window.print(),
      },
      {
        label: "Spell Check",
        icon: SpellCheckIcon,
        onClick: () => {
          const current = editor?.view.dom.getAttribute("spellcheck");
          const newSpellcheck = current === "true" ? "false" : "true";
          editor?.view.dom.setAttribute("spellcheck", newSpellcheck);
        },
      },
    ],
    [
      {
        label: "Bold",
        icon: BoldIcon,
        isActive: editor?.isActive("bold"),
        onClick: () => editor?.chain().focus().toggleBold().run(),
      },
      {
        label: "Italic",
        icon: ItalicIcon,
        isActive: editor?.isActive("italic"),
        onClick: () => editor?.chain().focus().toggleItalic().run(),
      },
      {
        label: "Underline",
        icon: UnderlineIcon,
        isActive: editor?.isActive("underline"),
        onClick: () => editor?.chain().focus().toggleUnderline().run(),
      },
      {
        label: "Remove Formating",
        icon: RemoveFormattingIcon,
        onClick: () => editor?.chain().focus().unsetAllMarks().run(),
      },
    ],
    [],
    [
      {
        label: "List Todo",
        icon: ListTodoIcon,
        onClick: () => editor?.chain().focus().toggleTaskList().run(),
        isActive: editor?.isActive("todoList"),
      },
    ],
  ];

  return (
    <div className="bg-muted px-2.5 py-0.5 rounded-[25px] min-h-[40px] flex items-center gap-x-0.5 overflow-x-auto print:hidden">
      {sections[0].map((item) => (
        <ToolbarButton key={item.label} {...item} />
      ))}
      <Separator
        orientation="vertical"
        className="h-6 bg-muted-foreground mx-2"
      />
      <FontFamilyButton />
      <Separator
        orientation="vertical"
        className="h-6 bg-muted-foreground mx-2"
      />
      <FontSizeButton />
      <Separator
        orientation="vertical"
        className="h-6 bg-muted-foreground mx-2"
      />
      {sections[1].map((item) => (
        <ToolbarButton key={item.label} {...item} />
      ))}
      <Separator
        orientation="vertical"
        className="h-6 bg-muted-foreground mx-2"
      />
      {sections[2].map((item) => (
        <ToolbarButton key={item.label} {...item} />
      ))}
      <TextColorButton />
      <HighlightTextButton />
      <Separator
        orientation="vertical"
        className="h-6 bg-muted-foreground mx-2"
      />
      <HeadingButton />
      <Separator
        orientation="vertical"
        className="h-6 bg-muted-foreground mx-2"
      />
      <LinkButton />
      <ImageButton />
      {sections[3].map((item) => (
        <ToolbarButton key={item.label} {...item} />
      ))}
      <TextAlignButton />
      <ListButton />
      <Separator
        orientation="vertical"
        className="h-6 bg-muted-foreground mx-2"
      />
      <DownloadPdf />
    </div>
  );
};

export default Toolbar;
