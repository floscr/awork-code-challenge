import { IconMovie } from "@tabler/icons-react";
import { cancelable, CancelablePromise } from "cancelable-promise";

import GroupMoviesWorker from "./groupingWorker.ts?worker";

import { Search } from "./Search";
import { useState } from "react";
import { fetchMoviesByQuery, onError } from "./lib";
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
  /* queryResults: MovieQueryData;
   * detailsResults: MovieDetailsData; */
}

interface HeaderProps {
  onSearch: (query: string) => void;
}

const defaultState: State = {
  route: { name: "home" },
  /* queryResults: new Map(),
   * detailsResults: new Map(), */
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

interface MovieProps {
  movie: MovieQueryData;
  onSelectMovieId: (query: string) => void;
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
  onSelectMovieId: (query: string) => void;
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
  state: State;
}

const MainRoute: React.FC<MainRouteProps> = function ({ state }) {
  return match(state.route)
    .with({ name: "home" }, () => <div>{"Hello"}</div>)
    .with({ name: "search", data: P.select() }, (movies) => (
      <MovieList movies={movies} onSelectMovieId={console.log} />
    ))
    .with({ name: "details" }, () => <div>{"Details"}</div>)
    .otherwise(() => null);
};

const asyncWorkerGroupMovies = function (
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

  return (
    <div className="flex flex-col items-center">
      <Header onSearch={(query) => onSearch(query)} />
      <div className="flex w-full max-w-screen-lg p-5">
        <MainRoute state={state} />
      </div>
    </div>
  );
};
