import { Project } from "@/types";
import { createSlice } from "@reduxjs/toolkit";

interface ProjectSliceType {
  project: Project | null;
}

const initialState: ProjectSliceType = {
  project: null,
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setProject: (state, action) => {
      const project = action.payload;
      state.project = project;
    },
  },
});

export const { setProject } = projectSlice.actions;
export default projectSlice.reducer;
