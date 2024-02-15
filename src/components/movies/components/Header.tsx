import React from "react";

import { Logo } from "./Shared";
import { Search } from "./Search";

interface HeaderProps {
  onSearch: (query: string) => void;
  onHomeNavigate: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearch, onHomeNavigate }) => {
  return (
    <div className="flex w-full justify-center bg-slate-900">
      <nav className="flex w-full max-w-screen-lg flex-wrap items-center justify-center gap-5 p-5 sm:justify-between">
        <div className="cursor-pointer" onClick={() => onHomeNavigate()}>
          <Logo />
        </div>
        <Search onSubmit={onSearch} />
      </nav>
    </div>
  );
};
