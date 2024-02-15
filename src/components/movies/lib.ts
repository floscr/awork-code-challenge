import { z } from "zod";

import GroupMoviesWorker from "./groupingWorker.ts?worker";

import {
  ApiDetailsResponseSchema,
  MovieDetailsData,
} from "./types/MovieDetailsData";
import { ApiQueryResponseSchema, MovieQueryData } from "./types/MovieQueryData";
import { GroupedMovies } from "./types/GroupedMovies";

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
  console.error(error);
  if (error instanceof z.ZodError) {
    return "Invalid API response structure.";
  } else {
    return error.message || "An unexpected error occurred.";
  }
};

export const asyncWorkerGroupMovies = function (
  movies: MovieQueryData[],
): Promise<GroupedMovies> {
  return new Promise((res, rej) => {
    const worker = new GroupMoviesWorker();
    worker.postMessage(movies);

    worker.onmessage = (e) => {
      res(e.data as GroupedMovies);
      worker.terminate();
    };

    worker.onerror = (error) => {
      console.error(`Worker error: ${error.message}`);
      rej(error.message);
      worker.terminate();
    };
  });
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

export const fetchMovieById = async (id: string): Promise<MovieDetailsData> => {
  const url = omdbUrl({ id }).toString();

  const response = await fetch(url);
  if (!response.ok) throw new Error("Network response was not ok.");

  const jsonData = (await response.json()) as unknown;
  const data = ApiDetailsResponseSchema.parse(jsonData);

  if (data.Response === "True") {
    return data;
  } else {
    throw new Error(data.Error);
  }
};
