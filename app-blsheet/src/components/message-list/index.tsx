import { Channel, Message } from "@/types";
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";

import DisplayMessage from "./display-message";
import ChannelHero from "./channel-hero";
import { Loader } from "lucide-react";

const TIME_THRESHOLD = 5;

interface MessageListProps {
  isLoading: boolean;
  messages: Message[];
  channel: Channel | null;
  variant?: "channel" | "thread" | "conversation";
  handleEdit: (data: any) => void;
  loadingEditMessage: boolean;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  loadingDeleteMessage: boolean;
  handleDelete: (messageId: string) => void;
  loadingAddReaction: boolean;
  handleReaction: (data: any) => void;
  memberId: string;
  loadMore: () => void;
  canShowLoadMore: boolean;
  handleThread: (id: string) => void;
}

const formatLabel = (dateKey: string) => {
  const date = new Date(dateKey);
  if (isToday(date)) return "Today";
  else if (isYesterday(date)) return "Yesterday";
  return format(date, "EEEE, MMMM d");
};

const MessageList = ({
  isLoading,
  messages,
  channel,
  variant,
  handleEdit,
  loadingEditMessage,
  editingId,
  setEditingId,
  loadingDeleteMessage,
  handleDelete,
  loadingAddReaction,
  handleReaction,
  memberId,
  canShowLoadMore,
  loadMore,
  handleThread,
}: MessageListProps) => {
  const groupedMessages = messages?.reduce((groups, message) => {
    const date = new Date(message.createdAt);
    const dateKey = format(date, "yyyy-MM-dd");
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].unshift(message);
    return groups;
  }, {} as Record<string, typeof messages>);

  return (
    <div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">
      {Object.entries(groupedMessages || {}).map(([dateKey, messages]) => {
        return (
          <div key={dateKey}>
            <div className="text-center my-2 relative">
              <hr className="absolute top-1/2 left-0 right-0 border-t border" />
              <span className="relative inline-block bg-muted px-4 py-1 rounded-full text-xs border shadow-sm">
                {formatLabel(dateKey)}
              </span>
            </div>
            {messages.map((message, index) => {
              const prevMessage = messages[index - 1];
              const isCompact =
                prevMessage &&
                prevMessage.member._id === message.member._id &&
                differenceInMinutes(
                  new Date(prevMessage.createdAt),
                  new Date(message.createdAt)
                ) < TIME_THRESHOLD;
              return (
                <DisplayMessage
                  key={message._id}
                  id={message._id}
                  memberId={memberId}
                  reactions={message.reactions}
                  member={message.member}
                  body={message.body}
                  image={message.image}
                  createdAt={message.createdAt}
                  updatedAt={message.updatedAt}
                  isCreator={message.isCreator}
                  isEditing={editingId === message._id}
                  setEditingId={(id: string | null) => setEditingId(id)}
                  isCompact={isCompact}
                  hideThreadButton={variant === "thread"}
                  threadCount={0}
                  handleEdit={handleEdit}
                  loadingEditMessage={loadingEditMessage}
                  loadingDeleteMessage={loadingDeleteMessage}
                  handleDelete={handleDelete}
                  loadingAddReaction={loadingAddReaction}
                  handleReaction={handleReaction}
                  handleThread={() => handleThread(message._id)}
                />
              );
            })}
          </div>
        );
      })}

      {canShowLoadMore && (
        <div className="flex items-center gap-1 justify-center my-2">
          {isLoading && <Loader className="animate-spin size-4" />}
          <button
            className="cursor-pointer text-primary"
            disabled={isLoading}
            onClick={loadMore}
          >
            Load More
          </button>
        </div>
      )}
      {variant == "channel" && channel && <ChannelHero channel={channel} />}
    </div>
  );
};

export default MessageList;
