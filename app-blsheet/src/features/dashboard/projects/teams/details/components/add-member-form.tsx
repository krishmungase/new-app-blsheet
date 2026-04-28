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
import { InvitationStatus, Member } from "@/types";
import { useDebounce } from "@/hooks";

import useAddMember from "../hooks/use-add-member";
import { useTeamContext } from "../provider/team-provider";
import useGetMembers from "../../../members/hooks/use-get-members";
import useGetMemberFilters from "../../../members/hooks/use-get-member-filters";

interface AddMemberFormProps {
  projectId: string;
  teamId: string;
  onClose: () => void;
}

const AddMemberForm = ({ teamId, projectId, onClose }: AddMemberFormProps) => {
  const [open, setOpen] = useState(false);
  const { members } = useGetMembers({
    params: {
      invitationStatus: InvitationStatus.ACCEPTED,
    },
  });
  const { refetchTeam } = useTeamContext();
  const { mutate } = useAddMember({ refetchTeam, onClose });
  const { email, setFilters } = useGetMemberFilters();

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
          Add Member
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
                    memberId: member._id,
                    projectId,
                    teamId,
                    isRemove: false,
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

export default AddMemberForm;
