import { useParams } from "react-router-dom";
import useGetTeams from "../../teams/hooks/use-get-teams";
import { SelectField } from "@/components";
import { Member, Team } from "@/types";
import useGetTeam from "../../teams/details/hooks/use-get-team";

interface TeamAndOwnerProps {
  setTeamDetails: React.Dispatch<
    React.SetStateAction<{
      teamId: string;
      ownerId: string;
    }>
  >;
  teamDetails: {
    teamId: string;
    ownerId: string;
  };
}

const TeamAndOwner = ({ teamDetails, setTeamDetails }: TeamAndOwnerProps) => {
  const { projectId } = useParams();
  const { teams, isLoading: loadingTeams } = useGetTeams({
    projectId: projectId as string,
  });
  const { team, isLoading: loadingTeam } = useGetTeam({
    projectId: projectId as string,
    teamId: teamDetails.teamId,
  });
  const onChange = (teamId: string) => {
    setTeamDetails({ teamId, ownerId: "" });
  };
  const onChangeOwner = (ownerId: string) => {
    setTeamDetails((prev) => ({ ...prev, ownerId }));
  };

  return (
    <>
      <SelectField
        isLoading={loadingTeams}
        placeholder="Team"
        field={{ onChange, value: teamDetails.teamId }}
        options={(teams || []).map((t: Team) => ({
          label: t.name,
          value: t._id,
        }))}
      />

      {teamDetails.teamId && (
        <SelectField
          isLoading={loadingTeam}
          placeholder="Owner"
          field={{ onChange: onChangeOwner, value: teamDetails.ownerId }}
          options={(team?.members || []).map((m: Member) => ({
            label: m.user.fullName,
            value: m._id,
          }))}
        />
      )}
    </>
  );
};

export default TeamAndOwner;
