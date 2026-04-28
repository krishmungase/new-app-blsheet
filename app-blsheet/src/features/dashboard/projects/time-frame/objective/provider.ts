import { TimeFrame } from "@/types";
import { createContext, useContext } from "react";

interface TimeFrameContext {
  timeFrame: TimeFrame | null;
}

export const TimeFrameContext = createContext<TimeFrameContext>({
  timeFrame: null,
});

export const useTimeFrameContext = () => {
  const context = useContext(TimeFrameContext);
  if (!context) throw new Error("Context not found");
  return context;
};
