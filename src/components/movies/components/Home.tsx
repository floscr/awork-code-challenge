import { Logo } from "./Shared";

export const Home = () => {
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
      <Logo />
    </div>
  );
};
