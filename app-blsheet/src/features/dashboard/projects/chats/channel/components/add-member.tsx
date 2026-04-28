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

import useGetMembers from "../../../members/hooks/use-get-members";
import useGetMemberFilters from "../../../members/hooks/use-get-member-filters";
import useAddMember from "../hooks/use-add-member";

interface AddMemberProps {
  projectId: string;
  channelId: string;
  refetch: () => void;
}

const AddMember = ({ projectId, channelId, refetch }: AddMemberProps) => {
  const [open, setOpen] = useState(false);
  const { members } = useGetMembers({});
  const { email, setFilters } = useGetMemberFilters();
  const { mutate } = useAddMember({
    callAfterSuccess: () => refetch(),
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
          Assign Members to Task
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
                  data: { memberId: member._id, projectId, channelId },
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

export default AddMember;
