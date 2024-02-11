import { z } from "zod";
import { ApiResponseErrorSchema } from "./MovieError";

export const MovieDetailsDataSchema = z
  .object({
    Title: z.string(),
    Year: z.string(),
    Rated: z.string(),
    Released: z.string(),
    Runtime: z.string(),
    Genre: z.string(),
    Director: z.string(),
    Writer: z.string(),
    Actors: z.string(),
    Plot: z.string(),
    Language: z.string(),
    Country: z.string(),
    Awards: z.string(),
    Poster: z.string(),
    Ratings: z.array(
      z.object({
        Source: z.string(),
        Value: z.string(),
      }),
    ),
    Metascore: z.string(),
    imdbRating: z.string(),
    imdbVotes: z.string(),
    imdbID: z.string(),
    Type: z.string(),
    DVD: z.string(),
    BoxOffice: z.string(),
    Production: z.string(),
    Website: z.string().optional(),
  })
  .passthrough();

const ApiDetailsSuccessSchema = MovieDetailsDataSchema.extend({
  Response: z.literal("True"),
});

export const ApiDetailsResponseSchema = z.union([
  ApiDetailsSuccessSchema,
  ApiResponseErrorSchema,
]);

export type MovieDetailsData = z.infer<typeof MovieDetailsDataSchema>;
