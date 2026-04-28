import { z } from "zod";

export const labelSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(100, { message: "Name must not be longer than 100 characters." }),
  description: z.optional(z.string()),
  color: z.string({ message: "Color is required" }),
});

export type LabelValues = z.infer<typeof labelSchema>;
