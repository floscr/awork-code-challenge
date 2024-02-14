import { z } from "zod";
import { ApiResponseErrorSchema } from "./MovieError";

export const MovieQueryDataSchema = z.object({
  Title: z.string(),
  Year: z.string(),
  imdbID: z.string(),
  Type: z.string(),
  Poster: z.string(),
});

const ApiQuerySuccessSchema = z.object({
  Response: z.literal("True"),
  Search: z.array(MovieQueryDataSchema).optional(),
});

export const ApiQueryResponseSchema = z.union([
  ApiQuerySuccessSchema,
  ApiResponseErrorSchema,
]);

export type MovieQueryData = z.infer<typeof MovieQueryDataSchema>[];
