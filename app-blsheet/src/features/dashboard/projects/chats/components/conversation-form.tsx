import { useEffect, useState } from "react";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Member } from "@/types";
import { useDebounce } from "@/hooks";

import useGetMembers from "../../members/hooks/use-get-members";
import useGetMemberFilters from "../../members/hooks/use-get-member-filters";
import useCreateConversation from "../conversation/hooks/use-create-conversation";
import useProject from "@/hooks/use-project";

interface ConversationFormProps {
  projectId: string;
  onClose: () => void;
  refetch: () => void;
}

const ConversationForm = ({ onClose, refetch }: ConversationFormProps) => {
  const { project } = useProject();
  const [open, setOpen] = useState(false);
  const { members } = useGetMembers({});
  const { email, setFilters } = useGetMemberFilters();
  const { mutate } = useCreateConversation({
    callAfterSuccess: () => {
      onClose();
      refetch();
    },
  });

  const [localSearch, setLocalSearch] = useState(email);
  const debouncedSearch = useDebounce(localSearch);

  useEffect(() => {
    setFilters({ email: debouncedSearch! });
  }, [debouncedSearch]);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          Create conversation with
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="sm:w-[420px] p-2">
        <Input
          placeholder="Search members..."
          value={localSearch as string}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="mb-2"
        />
        {members?.length === 0 ? (
          <p className="p-2 text-sm text-muted-foreground">No member found</p>
        ) : (
          members?.map((member: Member) => (
            <DropdownMenuItem
              key={member._id}
              className="cursor-pointer"
              onSelect={() => {
                mutate({
                  data: {
                    memberOneId: project?.memberId,
                    memberTwoId: member._id,
                    projectId: project?.projectId,
                  },
                });
                setOpen(false);
              }}
            >
              {member.email}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ConversationForm;
