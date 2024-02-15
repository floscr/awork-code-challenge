import React from "react";

import { MovieDetailsData } from "../types/MovieDetailsData";

interface MovieDetailsProps {
  movie: MovieDetailsData;
}

export const MovieDetails: React.FC<MovieDetailsProps> = ({ movie }) => {
  return (
    <div className="flex flex-col rounded-lg bg-slate-700 p-5 shadow-lg md:flex-row">
      <div className="md:shrink-0">
        <img
          src={movie.Poster}
          alt="Movie Poster"
          className="w-full rounded-lg md:w-48"
        />
      </div>
      <div className="mt-4 md:ml-6 md:mt-0">
        <div className="text-sm font-semibold uppercase tracking-wide text-indigo-500">
          {movie.Genre}
        </div>
        <a
          href={`https://www.imdb.com/title/${movie.imdbID}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 block text-lg font-medium leading-tight text-black hover:underline dark:text-white"
        >
          {movie.Title}
        </a>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{movie.Plot}</p>
      </div>
    </div>
  );
};
