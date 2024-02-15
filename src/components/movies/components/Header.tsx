import React from "react";

import { Logo } from "./Shared";
import { Search } from "./Search";

interface HeaderProps {
  onSearch: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  return (
    <div className="flex w-full justify-center bg-slate-900">
      <nav className="flex w-full max-w-screen-lg flex-wrap items-center justify-center gap-5 p-5 sm:justify-between">
        <Logo />
        <Search onSubmit={onSearch} />
      </nav>
    </div>
  );
};
