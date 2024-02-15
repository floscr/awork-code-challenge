import React from "react";

import { Search } from "./Search";
import { Logo } from "./Shared";

interface HomeProps {
  onSearch: (query: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onSearch }) => {
  return (
    <div
      className="flex grow items-center justify-center"
      style={{
        minHeight: "300px",
        background:
          "radial-gradient(farthest-corner at 90% 90%, #192d44 0%, rgba(255,255,255,0) 80%)",
        fontSize: "30px",
      }}
    >
      <div className="space-y-5">
        <Logo />
        <Search onSubmit={onSearch} />
      </div>
    </div>
  );
};
