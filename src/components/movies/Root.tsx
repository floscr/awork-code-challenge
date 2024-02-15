import { useState } from "react";
import { match, P } from "ts-pattern";
import { cancelable, CancelablePromise } from "cancelable-promise";

import {
  fetchMovieById,
  fetchMoviesByQuery,
  asyncWorkerGroupMovies,
  onError,
} from "./lib";
import { MovieDetailsData } from "./types/MovieDetailsData";
import { GroupedMovies } from "./types/GroupedMovies";
import { Header } from "./components/Header";
import { MovieDetails } from "./components/MovieDetails";
import { MovieList } from "./components/MovieList";
import { Spinner } from "./components/Spinner";

type Route =
  | { name: "home" }
  | { name: "loading" }
  | { name: "search"; query?: string; data: GroupedMovies }
  | { name: "details"; id: string; data: MovieDetailsData }
  | { name: "error"; error: string };

interface State {
  route: Route;
}

const defaultState: State = {
  route: { name: "home" },
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
    .with({ name: "loading" }, () => (
      <div className="flex grow items-center justify-center">
        <Spinner />
      </div>
    ))
    .otherwise(() => null);
};

export const MoviesRoot: React.FC = () => {
  const [state, setState] = useState<State>(defaultState);
  const [dataPromise, setDataPromise] = useState<CancelablePromise>();

  const setRoute = (route: Route) => setState((state) => ({ ...state, route }));

  // Cancel the current request & load a new request
  // (to prevent race condition, where a previous request would override the state with old data)
  const addRequest = function <T>(request: Promise<T>): CancelablePromise<T> {
    // Cancel the previous request
    if (dataPromise) {
      dataPromise.cancel();
    }

    // Create a new cancelable request
    const cancellableRequest = cancelable(request);
    setDataPromise(cancellableRequest);

    return cancellableRequest;
  };

  const onSearch = (query: string) => {
    if (query === "") {
      setRoute({ name: "home" });
      return;
    }

    setRoute({ name: "loading" });

    const request = fetchMoviesByQuery(query).then(asyncWorkerGroupMovies);
    const requestPromise = addRequest(request);

    requestPromise
      .then((data: GroupedMovies) => {
        setRoute({ name: "search", query, data });
      })
      .catch(function (err) {
        const errorString = onError(err as Error);
        setRoute({ name: "error", error: errorString });
      });
  };

  const onSelectMovieId = (id: string) => {
    setRoute({ name: "loading" });

    const request = fetchMovieById(id);
    const requestPromise = addRequest(request);

    requestPromise
      .then((data: MovieDetailsData) => {
        setRoute({ name: "details", id, data });
      })
      .catch(function (err) {
        const errorString = onError(err as Error);
        setRoute({ name: "error", error: errorString });
      });
  };

  return (
    <div className="flex grow flex-col items-center">
      <Header onSearch={onSearch} />
      <div className="flex w-full grow overflow-y-auto">
        <div className="mx-auto max-w-screen-lg p-5">
          <MainRoute route={state.route} onSelectMovieId={onSelectMovieId} />
        </div>
      </div>
    </div>
  );
};
