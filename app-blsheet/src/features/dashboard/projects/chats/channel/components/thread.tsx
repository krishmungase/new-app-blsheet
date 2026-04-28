import { useQueryClient } from "react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AlertCircle, Loader, X } from "lucide-react";

import { Message } from "@/types";
import { QUERY } from "@/constants";
import { Button } from "@/components";
import useProject from "@/hooks/use-project";
import MessageList from "@/components/message-list";
import { useSocketProvider } from "@/providers/socket-provider";
import DisplayMessage from "@/components/message-list/display-message";

import ChatInput from "./chat-input";
import usePanel from "../hooks/use-panel";
import useGetMessages from "../../hooks/use-get-messages";
import useUpdateMessage from "../../hooks/use-update-message";
import useDeleteMessage from "../../hooks/use-delete-message";
import useAddReaction from "../../hooks/use-add-reaction";
import useGetMessage from "../../hooks/use-get-message";

const Thread = () => {
  const { closePanel, parentMessageId } = usePanel();
  const queryClient = useQueryClient();
  const socket = useSocketProvider();
  const { project } = useProject();
  const { channelId, projectId, conversationId } = useParams();
  const [editingId, setEditingId] = useState<string | null>(null);
  const { isLoading, messages, refetch, hasNextPage, fetchNextPage } =
    useGetMessages({ parentMessageId });
  const {
    data: parentMessage,
    isLoading: loadingMessage,
    refetch: refetchMessage,
  } = useGetMessage({
    messageId: parentMessageId as string,
  });
  const { isLoading: loadingEditMessage, mutate: handleEdit } =
    useUpdateMessage({
      callAfterSuccess: () => {
        setEditingId(null);
        refetchMessage();
        refetch();
      },
    });
  const { isLoading: loadingDeleteMessage, mutate: handleDelete } =
    useDeleteMessage({
      callAfterSuccess: () => {
        refetchMessage();
        refetch();
      },
    });
  const { isLoading: loadingAddReaction, mutate: handleReaction } =
    useAddReaction({
      callAfterSuccess: () => {
        refetch();
        refetchMessage();
      },
    });

  useEffect(() => {
    socket.on("join_channel", () => {});
    socket.emit("join_channel", { channelId: parentMessageId });

    return () => {
      socket.off("join_channel");
    };
  }, []);

  useEffect(() => {
    socket.on("CREATED_THREAD", (data: Message) => {
      queryClient.setQueryData(
        [
          QUERY.CHAT.MESSAGE.GET_MESSAGES,
          { projectId, channelId, conversationId, parentMessageId },
        ],
        (oldData: any) => {
          return {
            ...oldData,
            pages: [
              {
                data: {
                  data: {
                    messages: [
                      {
                        ...data,
                        isCreator: data?.member?._id === project?.memberId,
                      },
                    ],
                  },
                },
              },
              ...oldData.pages,
            ],
          };
        }
      );
    });
    return () => {
      socket.off("CREATED_THREAD");
    };
  }, [socket]);

  if (loadingMessage) {
    return (
      <div className="flex flex-col h-full">
        <div className="h-[40px] w-full bg-muted/50 flex items-center px-2 justify-between">
          <h1 className="font-medium">Thread</h1>
          <Button size="iconSm" variant="transparent" onClick={closePanel}>
            <X />
          </Button>
        </div>
        <div className="flex items-center justify-center h-full">
          <Loader className="animate-spin" />
        </div>
      </div>
    );
  }

  if (!parentMessage) {
    return (
      <div className="flex flex-col h-full">
        <div className="h-[40px] w-full bg-muted/50 flex items-center px-2 justify-between">
          <h1 className="font-medium">Thread</h1>
          <Button size="iconSm" variant="transparent" onClick={closePanel}>
            <X />
          </Button>
        </div>
        <div className="flex items-center justify-center h-full flex-col gap-2">
          <AlertCircle className="text-orange-500" />
          <span>Message Not Found!</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="h-[40px] w-full bg-muted/50 flex items-center px-2 justify-between border-b">
        <h1 className="font-medium">Thread</h1>
        <Button size="iconSm" variant="transparent" onClick={closePanel}>
          <X />
        </Button>
      </div>

      <DisplayMessage
        key={parentMessage._id}
        id={parentMessage._id}
        memberId={project?.memberId as string}
        reactions={parentMessage.reactions}
        member={parentMessage.member}
        body={parentMessage.body}
        image={{ url: "", _id: "", id: "" }}
        createdAt={parentMessage.createdAt}
        updatedAt={parentMessage.updatedAt}
        isCreator={parentMessage.isCreator}
        isEditing={editingId === parentMessage._id}
        setEditingId={(id: string | null) => setEditingId(id)}
        isCompact={false}
        hideThreadButton={true}
        threadCount={0}
        handleEdit={(data: any) =>
          handleEdit({
            data: { ...data, channelId, projectId, conversationId },
          })
        }
        loadingEditMessage={loadingEditMessage}
        loadingDeleteMessage={loadingDeleteMessage}
        handleDelete={(messageId: string) =>
          handleDelete({
            data: { messageId, projectId, channelId, conversationId },
          })
        }
        loadingAddReaction={loadingAddReaction}
        handleReaction={(data: any) =>
          handleReaction({
            data: { ...data, channelId, conversationId, projectId },
          })
        }
        handleThread={() => {}}
        hideToolBar={true}
      />

      <MessageList
        isLoading={isLoading}
        memberId={project?.memberId as string}
        messages={messages}
        channel={null}
        editingId={editingId}
        setEditingId={setEditingId}
        variant="thread"
        loadingEditMessage={loadingEditMessage}
        handleEdit={(data: any) =>
          handleEdit({
            data: {
              ...data,
              projectId,
              channelId,
            },
          })
        }
        loadingDeleteMessage={loadingDeleteMessage}
        handleDelete={(messageId: string) =>
          handleDelete({
            data: { messageId, projectId, channelId, conversationId },
          })
        }
        loadingAddReaction={loadingAddReaction}
        handleReaction={(data: any) => {
          handleReaction({
            data: { ...data, projectId, channelId, conversationId },
          });
        }}
        loadMore={() => fetchNextPage()}
        canShowLoadMore={hasNextPage}
        handleThread={() => {}}
      />
      <ChatInput placeholder="Reply..." refetch={() => {}} type="THREAD" />
    </div>
  );
};

export default Thread;
