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
import { Home } from "./components/Home";
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

const ContentWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="flex w-full max-w-screen-lg flex-col p-5">{children}</div>
);

interface MainRouteProps {
  route: Route;
  onSelectMovieId: (id: string) => void;
  onSearch: (query: string) => void;
  onHomeNavigate: () => void;
}

const MainRoute: React.FC<MainRouteProps> = function ({
  route,
  onSelectMovieId,
  onSearch,
}) {
  return match(route)
    .with({ name: "home" }, () => <Home onSearch={onSearch} />)
    .with({ name: "search", data: P.select() }, (movies) => (
      <ContentWrapper>
        <MovieList movies={movies} onSelectMovieId={onSelectMovieId} />
      </ContentWrapper>
    ))
    .with({ name: "details", data: P.select() }, (movie) => (
      <ContentWrapper>
        <MovieDetails movie={movie} />
      </ContentWrapper>
    ))
    .with({ name: "loading" }, () => (
      <div className="flex grow items-center justify-center">
        <Spinner />
      </div>
    ))
    .with({ name: "error", error: P.select() }, (error) => (
      <ContentWrapper>
        <div>{error}</div>
      </ContentWrapper>
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

  const onHomeNavigate = () => {
    if (dataPromise) {
      dataPromise.cancel();
    }

    setRoute({ name: "home" });
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
      <Header onSearch={onSearch} onHomeNavigate={onHomeNavigate} />
      <div className="flex w-full grow grow justify-center overflow-y-auto">
        <MainRoute
          route={state.route}
          onSelectMovieId={onSelectMovieId}
          onSearch={onSearch}
          onHomeNavigate={onHomeNavigate}
        />
      </div>
    </div>
  );
};
