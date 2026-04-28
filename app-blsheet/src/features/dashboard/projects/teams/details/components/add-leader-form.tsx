import { useState } from "react";
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

import { useTeamContext } from "../provider/team-provider";
import useAddOrRemoveLeader from "../hooks/use-add-or-remove-leader";

interface AddLeaderFormProps {
  projectId: string;
  teamId: string;
  onClose: () => void;
}

const AddLeaderForm = ({ teamId, projectId, onClose }: AddLeaderFormProps) => {
  const [open, setOpen] = useState(false);
  const { refetchTeam, team } = useTeamContext();
  const { mutate } = useAddOrRemoveLeader({ refetchTeam, onClose });
  const [search, setSearch] = useState("");

  const filteredMembers = team?.members?.filter((member: Member) =>
    member.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          Add Leader
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="sm:w-[420px] p-2">
        <Input
          placeholder="Search members..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-2"
        />
        {filteredMembers?.length === 0 ? (
          <p className="p-2 text-sm text-muted-foreground">No member found</p>
        ) : (
          filteredMembers?.map((member: Member) => (
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

export default AddLeaderForm;
