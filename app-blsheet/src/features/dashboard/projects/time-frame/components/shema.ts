import { z } from "zod";

export const timeFrameSchema = z.object({
  label: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(100, { message: "Name must not be longer than 100 characters." }),
  startDate: z.date({ message: "Start date required." }),
  endDate: z.date({ message: "End date required." }),
});

export type TimeFrameValue = z.infer<typeof timeFrameSchema>;
