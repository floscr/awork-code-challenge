import { IconMovie } from "@tabler/icons-react";

import GroupMoviesWorker from "./groupingWorker.ts?worker";

import { Search } from "./Search";
import { useState } from "react";
import { fetchMoviesByQuery, onError } from "./lib";
import { MovieQueryData } from "./types/MovieQueryData";
import { MovieDetailsData } from "./types/MovieDetailsData";
import { GroupedMovies } from "./types/GroupedMovies";

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

const MainRoute = function ({ state }: { state: State }) {
  switch (state.route.name) {
    case "home":
      return <div>{"Hello"}</div>;
    case "search":
      return <div>{"Search"}</div>;
    case "details":
      return <div>{"details"}</div>;
  }
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

  const setRoute = (route: Route) => setState((state) => ({ ...state, route }));

  const onSearch = function (query: string) {
    setRoute({ name: "loading" });

    fetchMoviesByQuery(query)
      .then(asyncWorkerGroupMovies)
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
