import { z } from "zod";

export const keyResultSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(200, { message: "Name must not be longer than 200 characters." }),
  targetValue: z.coerce
    .number({ message: "Target value is required" })
    .min(1, { message: "Target value must be greater than 0" }),
  unit: z.string({ message: "Unit is required" }),
});

export type KeyResultValue = z.infer<typeof keyResultSchema>;
