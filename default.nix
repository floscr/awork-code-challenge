{ yarn2nix, mkYarnPackage, ... }:

{
  build = mkYarnPackage {
    name = "boilerplate";
    src = ./.;
    packageJSON = ./package.json;
    yarnLock = ./yarn.lock;
  };
}
