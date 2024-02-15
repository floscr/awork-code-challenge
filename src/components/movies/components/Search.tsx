import React, { useState, FormEvent, ChangeEvent } from "react";

import { IconSearch } from "@tabler/icons-react";

interface SearchProps {
  onSubmit: (query: string) => void;
}

export const Search: React.FC<SearchProps> = ({ onSubmit }) => {
  const [query, setQuery] = useState<string>("");

  const onQueryChange = (e: ChangeEvent<HTMLInputElement>) =>
    setQuery(e.target.value);

  const onFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(query);
  };

  return (
    <form className="m-0 flex grow gap-3 sm:max-w-sm" onSubmit={onFormSubmit}>
      <input
        className="h-10 w-full rounded-lg border border-slate-700 bg-slate-800 px-5 text-sm focus:border-blue-500 focus:outline-none"
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={onQueryChange}
      />
      <button
        type="submit"
        className="flex h-10 items-center justify-center space-x-10 rounded-lg border border-slate-600 bg-slate-700 px-3 text-sm font-medium hover:border-slate-500 hover:bg-slate-600 focus:border-blue-500 focus:outline-none"
      >
        <IconSearch className="mr-2 opacity-60" size={18} />
        Search
      </button>
    </form>
  );
};
