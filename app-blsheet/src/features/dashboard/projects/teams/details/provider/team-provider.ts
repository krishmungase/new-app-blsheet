import { Team } from "../../../../../../types";
import { createContext, useContext } from "react";

interface TeamContext {
  team: Team | null;
  refetchTeam: () => void;
}

export const TeamContext = createContext<TeamContext>({
  team: null,
  refetchTeam: () => {},
});

export const useTeamContext = () => {
  const context = useContext(TeamContext);
  if (!context || !context.team) throw new Error("Team context not found");
  return context;
};
