import React from "react";
import { IconMovie } from "@tabler/icons-react";

import { Search } from "./Search";

interface HeaderProps {
  onSearch: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearch }) => {
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
