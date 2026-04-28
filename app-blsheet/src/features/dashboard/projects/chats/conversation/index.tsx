import { useQueryClient } from "react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader, TriangleAlert } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { QUERY } from "@/constants";
import { Message } from "@/types";
import useProject from "@/hooks/use-project";
import MessageList from "@/components/message-list";
import { useSocketProvider } from "@/providers/socket-provider";

import ChatInput from "../channel/components/chat-input";
import usePanel from "../channel/hooks/use-panel";
import useGetMessages from "../hooks/use-get-messages";
import useUpdateMessage from "../hooks/use-update-message";
import useDeleteMessage from "../hooks/use-delete-message";
import useAddReaction from "../hooks/use-add-reaction";
import useGetConversation from "./hooks/use-get-conversation";
import { SearchInput } from "@/components";
import useGetMessagesFilters from "../hooks/use-get-messages-filters";

const Conversation = () => {
  const { openPanel, parentMessageId, closePanel } = usePanel();
  const queryClient = useQueryClient();
  const socket = useSocketProvider();

  const { project } = useProject();
  const [conversationMember, setConversationMember] =
    useState<Message["member"]>();
  const [editingId, setEditingId] = useState<string | null>(null);
  const { channelId, projectId, conversationId } = useParams();
  const { isLoading, messages, refetch, hasNextPage, fetchNextPage } =
    useGetMessages({});
  const { conversation, loadingConversation } = useGetConversation();
  const { isLoading: loadingEditMessage, mutate: handleEdit } =
    useUpdateMessage({
      callAfterSuccess: () => {
        setEditingId(null);
        refetch();
      },
    });
  const { isLoading: loadingDeleteMessage, mutate: handleDelete } =
    useDeleteMessage({
      callAfterSuccess: () => {
        refetch();
      },
    });
  const { isLoading: loadingAddReaction, mutate: handleReaction } =
    useAddReaction({
      callAfterSuccess: () => {
        refetch();
      },
    });
  const { setFilters, search } = useGetMessagesFilters();

  useEffect(() => {
    if (conversation) {
      if (conversation.memberOne._id === project?.memberId)
        setConversationMember(conversation.memberTwo);
      else setConversationMember(conversation.memberTwo);
    }
  }, [conversation]);
  useEffect(() => {
    socket.on("join_channel", () => {});
    socket.emit("join_channel", { channelId: conversationId });

    return () => {
      socket.off("join_channel");
    };
  }, []);

  useEffect(() => {
    socket.on("CREATED_MESSAGE", (data: Message) => {
      queryClient.setQueryData(
        [
          QUERY.CHAT.MESSAGE.GET_MESSAGES,
          { projectId, channelId, conversationId },
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
      socket.off("CREATED_MESSAGE");
    };
  }, [socket]);

  if (loadingConversation) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="h-full flex-col gap-y-2 flex items-center justify-center">
        <TriangleAlert />
        <span>Conversation Not Found</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="h-[40px] gap-2 w-full bg-muted/50 flex items-center px-2 justify-between border-b">
        <div className="flex items-center gap-2 w-[200px]">
          <Avatar className="bg-primary size-5 shrink-0">
            <AvatarImage
              src={conversationMember?.user?.avatar?.url}
              alt="profile"
            />
            <AvatarFallback className="flex bg-foreground items-center justify-center w-full text-xs h-full text-card">
              {conversationMember?.user?.fullName[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <h1 className="font-medium text-sm truncate">
            {conversationMember?.user?.fullName}
          </h1>
        </div>

        <SearchInput
          fn={(search?: string) =>
            setFilters({
              search,
            })
          }
          className="w-full sm:max-w-full"
          text={search ? search : ""}
          placeholder="Search all chats"
        />
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <MessageList
          isLoading={isLoading}
          memberId={project?.memberId as string}
          messages={messages}
          channel={null}
          editingId={editingId}
          setEditingId={setEditingId}
          variant="conversation"
          loadingEditMessage={loadingEditMessage}
          handleEdit={(data: any) =>
            handleEdit({
              data: {
                ...data,
                projectId,
                channelId,
                conversationId,
              },
            })
          }
          loadingDeleteMessage={loadingDeleteMessage}
          handleDelete={(messageId: string) => {
            if (messageId === parentMessageId) closePanel();
            handleDelete({
              data: { messageId, projectId, channelId, conversationId },
            });
          }}
          loadingAddReaction={loadingAddReaction}
          handleReaction={(data: any) => {
            handleReaction({
              data: { ...data, projectId, channelId, conversationId },
            });
          }}
          loadMore={() => fetchNextPage()}
          canShowLoadMore={hasNextPage}
          handleThread={(id) => {
            openPanel({ messageId: id });
          }}
        />
      )}

      <ChatInput
        placeholder="Message..."
        refetch={() => {}}
        type="CONVERSATION"
      />
    </div>
  );
};

export default Conversation;
