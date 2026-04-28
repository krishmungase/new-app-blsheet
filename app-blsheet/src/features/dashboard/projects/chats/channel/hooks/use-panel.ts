import useGetMessagesFilter from "./use-get-messages-filter";

const usePanel = () => {
  const { setFilters, parentMessageId } = useGetMessagesFilter();

  const openPanel = ({ messageId }: { messageId: string }) => {
    setFilters({ parentMessageId: messageId });
  };

  const closePanel = () => {
    setFilters({ parentMessageId: undefined });
  };

  return { openPanel, closePanel, parentMessageId };
};

export default usePanel;
