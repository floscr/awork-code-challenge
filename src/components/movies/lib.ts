import { z } from "zod";

import {
  ApiDetailsResponseSchema,
  MovieDetailsData,
} from "./types/MovieDetailsData";
import { ApiQueryResponseSchema, MovieQueryData } from "./types/MovieQueryData";
import { FetchResult, Ok, Err } from "./types/FetchResult";

interface FetchMoviesDataParams {
  query?: string;
  id?: string;
  apiKey?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const omdApiKey: string = import.meta.env.VITE_OMDBAPI_KEY;

const omdbUrl = ({
  query,
  id,
  apiKey = omdApiKey,
}: FetchMoviesDataParams): URL => {
  const url = new URL("https://www.omdbapi.com/");
  url.searchParams.set("apikey", apiKey);

  if (query) {
    url.searchParams.set("s", query);
  }

  if (id) {
    url.searchParams.set("i", id);
  }

  return url;
};

export const onError = function (error: Error): string {
  if (error instanceof z.ZodError) {
    return "Invalid API response structure.";
  } else {
    return error.message || "An unexpected error occurred.";
  }
};

export const fetchMoviesByQuery = async (
  query: string,
): Promise<MovieQueryData[]> => {
  const url = omdbUrl({ query }).toString();

  const response = await fetch(url);
  if (!response.ok) throw new Error("Network response was not ok.");

  const jsonData = (await response.json()) as unknown;
  const data = ApiQueryResponseSchema.parse(jsonData);

  if (data.Response === "True") {
    return data.Search ?? [];
  } else {
    throw new Error(data.Error);
  }
};

export const fetchMovieById = async (
  id: string,
): Promise<FetchResult<MovieDetailsData>> => {
  const url = omdbUrl({ id }).toString();

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok.");

    const jsonData = (await response.json()) as unknown;
    const data = ApiDetailsResponseSchema.parse(jsonData);

    if (data.Response === "True") {
      return Ok(data);
    } else {
      throw new Error(data.Error);
    }
  } catch (error) {
    return Err(onError(error as Error));
  }
};
