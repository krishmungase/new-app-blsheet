import { SearchInput, SelectFilters } from "@/components";
import { InvitationStatus, MemberRole } from "@/types";

import useGetMemberFilters from "../hooks/use-get-member-filters";
import InviteMember from "./invite-member";
import useProject from "@/hooks/use-project";

const options = [
  { value: "All", label: "All" },
  { value: InvitationStatus.ACCEPTED, label: InvitationStatus.ACCEPTED },
  { value: InvitationStatus.PENDING, label: InvitationStatus.PENDING },
  { value: InvitationStatus.REJECTED, label: InvitationStatus.REJECTED },
];

const MemberFilters = ({ refetchMembers }: { refetchMembers: () => void }) => {
  const { project } = useProject();
  const { email, invitationStatus, setFilters } = useGetMemberFilters();

  return (
    <>
      <SearchInput
        fn={(email?: string) => setFilters({ email })}
        text={email ? email : ""}
        placeholder="Search all members"
      />
      <div className="flex items-center gap-2 w-full sm:w-fit">
        <SelectFilters
          fn={(value: InvitationStatus) =>
            setFilters({ invitationStatus: value })
          }
          title="Status"
          selectedValue={invitationStatus}
          options={options}
        />
        {project?.role !== MemberRole.MEMBER && (
          <InviteMember refetchMembers={refetchMembers} />
        )}
      </div>
    </>
  );
};

export default MemberFilters;
