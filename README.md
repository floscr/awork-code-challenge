# Boilerplate

## Installation

This repository uses [Bun](https://bun.sh/) for installation & running, but npm/yarn should work as well

``` shell
bun install
bun run dev
```

or

``` shell
npm install
npm run dev
```

If the system uses [Nix](https://nixos.org/) the setup can be automatically installed via the `nix repl`

``` shell
nix develop
# or if direnv is installed
direnv allow
```

This will automatically install packages like `bun`, `typescript-lsp`, etc.

### Testing the API

You can test the API via a `REPL` without having to interact with the ui like this:

``` shell
bun repl
```

In this repl insert the following lines:

``` js
import { fetchMoviesByQuery, fetchMovieById } from './src/components/movies/lib.ts';
```

To search movies:

``` js
fetchMoviesByQuery("Blues Brothers").then(console.log)
```

To show movie details:

``` js
fetchMovieById('tt0482521').then(console.log)
```

## Documentation

### Styling

I've opted for tailwind class names for the styling, as it's the quickest way to bootstrap such an application.

### API library

I've used <a href="https://zod.dev/" rel="noopener">Zod</a> library in this repository for the data schema validation, which was not a requirement but it's almost for free code wise and makes your types much easier to reason about.

It would be possible to not use the library as per request, but that would make the code convoluted, so I've made an exception here, I hope that's ok :)
