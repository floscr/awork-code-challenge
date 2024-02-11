import { z } from "zod";

export const ApiResponseErrorSchema = z.object({
  Response: z.literal("False"),
  Error: z.string(),
});
