import { z } from "zod";

export const objectiveSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(150, { message: "Name must not be longer than 150 characters." }),
  description: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." }),
});

export type ObjectiveValue = z.infer<typeof objectiveSchema>;
