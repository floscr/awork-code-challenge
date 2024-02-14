import { IconMovie } from "@tabler/icons-react";
import { match } from "ts-pattern";

import { Search } from "./Search";
import { useState } from "react";
import { fetchMoviesByQuery } from "./lib";
import { MovieQueryData } from "./types/MovieQueryData";
import { MovieDetailsData } from "./types/MovieDetailsData";

type Route =
  | { name: "home" }
  | { name: "loading" }
  | { name: "search"; query?: string; data: MovieQueryData }
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

export const Movies: React.FC = () => {
  const [state, setState] = useState<State>(defaultState);

  const onSearch = async function (query: string) {
    setState({
      ...state,
      route: { name: "loading" },
    });

    const result = await fetchMoviesByQuery(query);

    match(result)
      .with({ kind: "Ok" }, ({ data }: { data: MovieQueryData }) => {
        setState((state) => ({
          ...state,
          route: { name: "search", query, data },
        }));
      })
      .with({ kind: "Error" }, ({ error }: { error: string }) => {
        setState((state) => ({
          ...state,
          route: { name: "error", error },
        }));
      });
  };

  return (
    <div className="flex flex-col items-center">
      <Header
        onSearch={(query) => {
          void onSearch(query);
        }}
      />
      <div className="flex w-full max-w-screen-lg p-5">
        <MainRoute state={state} />
      </div>
    </div>
  );
};
