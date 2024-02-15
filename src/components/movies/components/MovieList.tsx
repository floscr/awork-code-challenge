import React from "react";

import { MovieQueryData } from "../types/MovieQueryData";
import { GroupedMovies } from "../types/GroupedMovies";

interface MovieProps {
  movie: MovieQueryData;
  onSelectMovieId: (id: string) => void;
}

const Movie = function ({ movie, onSelectMovieId }: MovieProps) {
  return (
    <div
      key={movie.imdbID}
      className="cursor-pointer overflow-hidden rounded-lg border border-slate-700 bg-slate-800 shadow-lg hover:border-blue-400"
      onClick={() => onSelectMovieId(movie.imdbID)}
    >
      <div
        className="h-56 bg-cover bg-center"
        style={{ backgroundImage: `url(${movie.Poster})` }}
      >
        {movie.Poster === "N/A" && (
          <div className="flex h-56 items-center justify-center bg-slate-600 opacity-50">
            No Image Available
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold leading-snug">{movie.Title}</h3>
        <p className="text-sm opacity-50">
          {movie.Type}, {movie.Year}
        </p>
        <a
          href={`https://www.imdb.com/title/${movie.imdbID}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-blue-500 hover:text-blue-600"
        >
          View on IMDB
        </a>
      </div>
    </div>
  );
};

interface MovieListProps {
  movies: GroupedMovies;
  onSelectMovieId: (id: string) => void;
}

export const MovieList: React.FC<MovieListProps> = ({
  movies,
  onSelectMovieId,
}) => {
  const years = Array.from(movies.keys()).sort().reverse();

  return (
    <div className="container mx-auto px-0">
      {years.map((year) => {
        return (
          <div key={year} className="mb-8">
            <h2 className="mb-4 text-xl font-bold">{year}</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {movies.get(year)!.map((movie) => (
                <Movie
                  key={movie.imdbID}
                  movie={movie}
                  onSelectMovieId={onSelectMovieId}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
