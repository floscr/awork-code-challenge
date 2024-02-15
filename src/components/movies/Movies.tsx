import { IconMovie } from "@tabler/icons-react";
import { cancelable, CancelablePromise } from "cancelable-promise";

import { Search } from "./Search";
import { useState } from "react";
import {
  fetchMovieById,
  fetchMoviesByQuery,
  asyncWorkerGroupMovies,
  onError,
} from "./lib";
import { MovieQueryData } from "./types/MovieQueryData";
import { MovieDetailsData } from "./types/MovieDetailsData";
import { GroupedMovies } from "./types/GroupedMovies";
import { match, P } from "ts-pattern";

type Route =
  | { name: "home" }
  | { name: "loading" }
  | { name: "search"; query?: string; data: GroupedMovies }
  | { name: "details"; id: string; data: MovieDetailsData }
  | { name: "error"; error: string };

interface State {
  route: Route;
}

interface HeaderProps {
  onSearch: (query: string) => void;
}

const defaultState: State = {
  route: { name: "home" },
};

const Header = function ({ onSearch }: HeaderProps) {
  return (
    <div className="flex w-full justify-center bg-slate-900">
      <nav className="flex w-full max-w-screen-lg items-center justify-between p-5">
        <h1 className="primary flex space-x-3 font-medium">
          <IconMovie />
          <span>MovieDB</span>
        </h1>
        <Search onSubmit={onSearch} />
      </nav>
    </div>
  );
};

export const MovieDetails = ({ movie }: { movie: MovieDetailsData }) => {
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

export const MovieList = ({ movies, onSelectMovieId }: MovieListProps) => {
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

interface MainRouteProps {
  route: Route;
  onSelectMovieId: (id: string) => void;
}

const MainRoute: React.FC<MainRouteProps> = function ({
  route,
  onSelectMovieId,
}) {
  return match(route)
    .with({ name: "home" }, () => <div>{"Hello"}</div>)
    .with({ name: "search", data: P.select() }, (movies) => (
      <MovieList movies={movies} onSelectMovieId={onSelectMovieId} />
    ))
    .with({ name: "details", data: P.select() }, (movie) => (
      <MovieDetails movie={movie} />
    ))
    .otherwise(() => null);
};

export const Movies: React.FC = () => {
  const [state, setState] = useState<State>(defaultState);
  const [dataPromise, setDataPromise] = useState<CancelablePromise>();

  console.log(state);

  const setRoute = (route: Route) => setState((state) => ({ ...state, route }));

  const onSearch = (query: string) => {
    if (dataPromise) {
      dataPromise.cancel();
    }

    setRoute({ name: "loading" });

    const promise = cancelable(
      fetchMoviesByQuery(query).then(asyncWorkerGroupMovies),
    );

    setDataPromise(promise);

    promise
      .then((data: GroupedMovies) => {
        setRoute({ name: "search", query, data });
      })
      .catch(function (err) {
        const errorString = onError(err as Error);
        setRoute({ name: "error", error: errorString });
      });
  };

  const onSelectMovieId = (id: string) => {
    if (dataPromise) {
      dataPromise.cancel();
    }

    setRoute({ name: "loading" });

    const promise = cancelable(fetchMovieById(id));

    promise
      .then((data: MovieDetailsData) => {
        setRoute({ name: "details", id, data });
      })
      .catch(function (err) {
        const errorString = onError(err as Error);
        setRoute({ name: "error", error: errorString });
      });
  };

  return (
    <div className="flex flex-col items-center">
      <Header onSearch={(query) => onSearch(query)} />
      <div className="flex w-full max-w-screen-lg p-5">
        <MainRoute route={state.route} onSelectMovieId={onSelectMovieId} />
      </div>
    </div>
  );
};
