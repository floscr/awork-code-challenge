import React from "react";

import { MovieDetailsData } from "../types/MovieDetailsData";

const detailKeys = [
  "Director",
  "Writer",
  "Actors",
  "Language",
  "Country",
  "Awards",
  "imdbRating",
  "imdbVotes",
  "Metascore",
  "Runtime",
  "Released",
  "Rated",
  "Type",
  "DVD",
  "BoxOffice",
  "Production",
];

const isDetailAvailable = function (detail?: string): boolean {
  return !!detail && detail !== "N/A";
};

interface MovieDetailProps {
  property: string;
  children: React.ReactNode;
}
const MovieDetail: React.FC<MovieDetailProps> = ({ property, children }) => (
  <p>
    <span className="font-bold">{property}</span>: {children}
  </p>
);

interface MovieDetailsProps {
  movie: MovieDetailsData;
}

export const MovieDetails: React.FC<MovieDetailsProps> = ({ movie }) => {
  const details: [string, string][] = detailKeys.reduce<[string, string][]>(
    (acc, key: string) => {
      const detail = movie[key];
      if (isDetailAvailable(detail as string | undefined)) {
        return [...acc, [key, detail as string]];
      } else {
        return acc;
      }
    },
    [],
  );

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
          className="mt-1 block text-lg leading-tight text-black hover:underline dark:text-white"
        >
          {movie.Title} ({movie.Year})
        </a>
        <div className="space-y-5 text-gray-600 dark:text-gray-400">
          <p className="mt-2">{movie.Plot}</p>
          <div>
            {details.map(([property, value]) => (
              <MovieDetail key={property} property={property}>
                {value}
              </MovieDetail>
            ))}
            {isDetailAvailable(movie.Website) && (
              <MovieDetail property={"Website"}>
                <a
                  href={movie.Website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {movie.Website}
                </a>
              </MovieDetail>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
