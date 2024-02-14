import { MovieQueryData } from "./types/MovieQueryData";
import { GroupedMovies } from "./types/GroupedMovies";

const groupMoviesByYear = (movies: MovieQueryData[]): GroupedMovies => {
  return movies.reduce((acc: GroupedMovies, movie: MovieQueryData) => {
    const currentYearItems = acc.get(movie.Year);
    const newCurrentYearItems = currentYearItems
      ? [...currentYearItems, movie]
      : [movie];

    acc.set(movie.Year, newCurrentYearItems);

    return acc;
  }, new Map());
};

self.addEventListener("message", (e) => {
  const movies = e.data as MovieQueryData[];
  const groupedMovies = groupMoviesByYear(movies);
  self.postMessage(groupedMovies);
});
