import Quill from "quill";
import { useRef, useState } from "react";
import { useParams } from "react-router-dom";

import QuillEditor from "@/components/quill-editor";
import useCreateMessage from "../../hooks/use-create-message";
import usePanel from "../hooks/use-panel";

interface ChatInputProps {
  placeholder: string;
  refetch?: () => void;
  type: "CONVERSATION" | "CHANNEL" | "THREAD";
}

interface BodyType {
  image: File | null;
  body: string;
}

const ChatInput = ({
  placeholder,
  refetch = () => {},
  type,
}: ChatInputProps) => {
  const { parentMessageId } = usePanel();
  const { channelId, projectId, conversationId } = useParams();
  const [editorKey, setEditorKey] = useState(0);
  const editorRef = useRef<Quill | null>(null);
  const { mutate, isLoading } = useCreateMessage({
    callAfterSuccess: () => {
      refetch();
    },
  });

  const handeOnSubmit = ({ image, body }: BodyType) => {
    const data = {
      image,
      body,

      projectId,
      channelId,
      conversationId,
      ...(type === "THREAD" && { parentMessageId }),
    };
    mutate({ data });
    setEditorKey((prev) => prev + 1);
  };

  return (
    <div className="px-5 w-full">
      <QuillEditor
        key={editorKey}
        onSubmit={handeOnSubmit}
        placeholder={placeholder}
        disabled={isLoading}
        innerRef={editorRef}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ChatInput;
