import React from "react";
import { IconMovie } from "@tabler/icons-react";

import { Search } from "./Search";

interface HeaderProps {
  onSearch: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  return (
    <div className="flex w-full justify-center bg-slate-900">
      <nav className="flex w-full max-w-screen-lg flex-wrap items-center justify-center gap-5 p-5 sm:justify-between">
        <h1 className="primary flex items-center justify-center space-x-3 font-medium">
          <IconMovie />
          <span>MovieDB</span>
        </h1>
        <Search onSubmit={onSearch} />
      </nav>
    </div>
  );
};
