import { useQueryClient } from "react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TriangleAlert } from "lucide-react";

import { Message } from "@/types";
import { QUERY } from "@/constants";
import { Loader, SearchInput } from "@/components";
import useProject from "@/hooks/use-project";
import MessageList from "@/components/message-list";
import { useSocketProvider } from "@/providers/socket-provider";

import usePanel from "./hooks/use-panel";
import ChatInput from "./components/chat-input";
import useGetChannel from "./hooks/use-get-channel";
import SettingButton from "./components/setting-button";
import useGetMessages from "../hooks/use-get-messages";
import useUpdateMessage from "../hooks/use-update-message";
import useDeleteMessage from "../hooks/use-delete-message";
import useAddReaction from "../hooks/use-add-reaction";
import useGetMessagesFilters from "../hooks/use-get-messages-filters";

const Channel = () => {
  const { openPanel, parentMessageId, closePanel } = usePanel();
  const queryClient = useQueryClient();
  const socket = useSocketProvider();
  const { page, setFilters, search } = useGetMessagesFilters();
  const { project } = useProject();
  const [editingId, setEditingId] = useState<string | null>(null);
  const { channelId, projectId } = useParams();
  const { isLoading, messages, refetch, hasNextPage, fetchNextPage } =
    useGetMessages({});
  const { loadingChannel, channel, refetchChannel } = useGetChannel();
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

  useEffect(() => {
    socket.on("join_channel", () => {});
    socket.emit("join_channel", { channelId });

    return () => {
      socket.off("join_channel");
    };
  }, []);

  useEffect(() => {
    socket.on("CREATED_MESSAGE", (data: Message) => {
      queryClient.setQueryData(
        [QUERY.CHAT.MESSAGE.GET_MESSAGES, { projectId, channelId }],
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

  if (page === 1 && loadingChannel) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="h-full flex-col gap-y-2 flex items-center justify-center">
        <TriangleAlert />
        <span>Channel Not Found</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="h-[40px] gap-1 w-full bg-muted/50 flex items-center px-2 justify-between border-b">
        <h1 className="font-medium truncate w-[200px]"># {channel?.name}</h1>
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
        <SettingButton
          channel={channel}
          refetch={refetchChannel}
          members={channel.members}
        />
      </div>
      {isLoading ? (
        <Loader />
      ) : (
        <MessageList
          isLoading={isLoading}
          memberId={project?.memberId as string}
          messages={messages}
          channel={channel}
          editingId={editingId}
          setEditingId={setEditingId}
          variant="channel"
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
          handleDelete={(messageId: string) => {
            if (messageId === parentMessageId) closePanel();
            handleDelete({ data: { messageId, projectId, channelId } });
          }}
          loadingAddReaction={loadingAddReaction}
          handleReaction={(data: any) => {
            handleReaction({ data: { ...data, projectId, channelId } });
          }}
          loadMore={() => fetchNextPage()}
          canShowLoadMore={hasNextPage}
          handleThread={(id) => {
            openPanel({ messageId: id });
          }}
        />
      )}
      <ChatInput placeholder="Message..." refetch={() => {}} type="CHANNEL" />
    </div>
  );
};

export default Channel;
