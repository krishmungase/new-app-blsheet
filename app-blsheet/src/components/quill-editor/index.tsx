import {
  MutableRefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Quill, { type QuillOptions } from "quill";
import { Delta, Op } from "quill/core";

import { PiTextAa } from "react-icons/pi";
import { Image, Loader2, Smile, XIcon } from "lucide-react";
import { MdSend } from "react-icons/md";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import Hint from "../ui/hint";
import EmojiPopover from "../shared/emoji-popover";

interface QuillEditorValue {
  image: File | null;
  body: string;
}
interface QuillEditorProps {
  variant?: "update" | "create";
  onSubmit: ({ image, body }: QuillEditorValue) => void;
  onCancel?: () => void;
  placeholder: string;
  defaultValue?: Delta | Op[];
  disabled?: boolean;
  innerRef?: MutableRefObject<Quill | null>;
  isLoading?: boolean;
}

const QuillEditor = ({
  variant = "create",
  onSubmit,
  onCancel,
  placeholder,
  defaultValue = [],
  disabled = false,
  innerRef,
  isLoading = false,
}: QuillEditorProps) => {
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [visibleToolbar, setVisibleToolbar] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const submitRef = useRef(onSubmit);
  const placeholderRef = useRef(placeholder);
  const defaultValueRef = useRef(defaultValue);
  const disabledRef = useRef(disabled);
  const quillRef = useRef<Quill | null>(null);
  const imageRef = useRef<HTMLInputElement | null>(null);

  const onEmojiSelect = (emoji: any) => {
    const quill = quillRef.current;
    quill?.insertText(quill?.getSelection()?.index || 0, emoji?.native);
  };

  useLayoutEffect(() => {
    submitRef.current = onSubmit;
    placeholderRef.current = placeholder;
    defaultValueRef.current = defaultValue;
    disabledRef.current = disabled;
  });

  useEffect(() => {
    if (!containerRef?.current) return;
    const container = containerRef.current;
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div")
    );

    const options: QuillOptions = {
      theme: "snow",
      placeholder: placeholderRef.current,
      modules: {
        toolbar: [
          ["bold", "italic", "strike"],
          ["link"],
          [{ list: "ordered" }, { list: "bullet" }],
        ],
        keyboard: {
          bindings: {
            enter: {
              key: "Enter",
              handler: () => {
                const text = quill.getText();
                const image = imageRef.current?.files![0] || null;
                const isEmpty =
                  !image && text.replace(/<(.|\n)*?>/g, "").trim().length === 0;
                if (isEmpty) return;

                const body = JSON.stringify(quill.getContents());
                submitRef.current?.({ image, body });
                return;
              },
            },
            shift_enter: {
              key: "Enter",
              shiftKey: true,
              handler: () => {
                quill.insertText(quill.getSelection()?.index || 0, "\n");
              },
            },
          },
        },
      },
    };

    const quill = new Quill(editorContainer, options);
    quillRef.current = quill;
    quillRef.current.focus();

    quill.setContents(defaultValueRef.current);

    if (innerRef?.current) innerRef.current = quill;

    quill.setContents(defaultValueRef.current);
    setText(quill.getText());
    quill.on(Quill.events.TEXT_CHANGE, () => {
      setText(quill.getText());
    });

    return () => {
      quill.off(Quill.events.TEXT_CHANGE);
      if (container) {
        container.innerHTML = "";
      }
      if (quillRef) {
        quillRef.current = null;
      }
      if (innerRef) {
        innerRef.current = null;
      }
    };
  }, [innerRef]);

  const isEmpty = !image && text.replace(/<(.|\n)*?>/g, "").trim().length === 0;
  const toogleToolbar = () => {
    setVisibleToolbar((prev) => !prev);
    const toolbarElement = containerRef?.current?.querySelector(".ql-toolbar");
    if (toolbarElement) {
      toolbarElement.classList.toggle("hidden");
    }
  };

  return (
    <div className="flex flex-col">
      <input
        type="file"
        accept="image/*"
        ref={imageRef}
        onChange={(event) => setImage(event.target.files![0])}
        className="hidden"
      />
      <div className="flex flex-col border rounded-md overflow-hidden focus-within:border-primary/10 focus-within:shadow-sm transition">
        <div ref={containerRef} className="quill-editor h-full" />
        {!!image && (
          <div className="relative size-[62px] flex items-center justify-center group/image p-2">
            <Hint label="Remove image">
              <button
                onClick={() => {
                  setImage(null);
                  imageRef.current!.value = "";
                }}
                className="hidden group-hover/image:flex rounded-full bg-red-500 text-white absolute -top-2.5 -right-2.5 size-5 z-[4] items-center justify-center"
              >
                <XIcon className="size-3" />
              </button>
            </Hint>
            <img
              src={URL.createObjectURL(image)}
              alt="Uploaded"
              className="rounded-xl overflow-hidden border object-cover"
            />
          </div>
        )}
        <div className="flex px-2 pb-2 z-[5]">
          <Hint label={!visibleToolbar ? "Hide toolbar" : "Show toolbar"}>
            <Button
              disabled={disabled}
              size="iconSm"
              variant={visibleToolbar ? "active" : "ghost"}
              onClick={toogleToolbar}
            >
              <PiTextAa className="size-4" />
            </Button>
          </Hint>

          <EmojiPopover onEmojiSelect={onEmojiSelect} hint="Emoji">
            <Button disabled={false} size="iconSm" variant="ghost">
              <Smile className="size-4" />
            </Button>
          </EmojiPopover>

          {variant === "create" && (
            <Hint label="Image">
              <Button
                disabled={false}
                size="iconSm"
                variant="ghost"
                onClick={() => imageRef.current?.click()}
              >
                <Image className="size-4" />
              </Button>
            </Hint>
          )}

          {variant === "update" && (
            <div className="ml-auto flex items-center gap-x-2">
              <Button
                size="sm"
                variant="outline"
                disabled={false}
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button
                disabled={false}
                size="sm"
                className="ml-auto bg-green-500 hover:bg-green-500/80 text-white"
                onClick={() =>
                  onSubmit({
                    image,
                    body: JSON.stringify(quillRef.current?.getContents()),
                  })
                }
              >
                {isLoading && <Loader2 className="animate-spin" />}
                Save
              </Button>
            </div>
          )}

          {variant === "create" && (
            <Button
              disabled={disabled || isEmpty}
              size="iconSm"
              className="ml-auto bg-green-500 hover:bg-green-500/80 text-white"
              onClick={() =>
                onSubmit({
                  image,
                  body: JSON.stringify(quillRef.current?.getContents()),
                })
              }
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <MdSend />}
            </Button>
          )}
        </div>
      </div>
      {variant === "create" && (
        <div
          className={cn(
            "p-2 text-[10px] text-muted-foreground flex justify-end opacity-0 transition",
            !isEmpty && "opacity-100"
          )}
        >
          <p>
            <strong>Shift + Enter</strong> to add a new line
          </p>
        </div>
      )}
    </div>
  );
};

export default QuillEditor;
