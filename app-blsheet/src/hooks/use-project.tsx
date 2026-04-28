import { RootState } from "@/store";
import { useSelector } from "react-redux";

const useProject = () => {
  const { project } = useSelector((state: RootState) => state.project);
  return { project };
};

export default useProject;
