# Awork Code Challenge

This is the code demo for awork, you can find the live example here:

https://awork-code-challenge.vercel.app/

[![image](https://github.com/floscr/awork-code-challenge/assets/1898374/cd70ed93-4f86-4081-a100-4dc3e7257468)](https://awork-code-challenge.vercel.app/)

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

## Documentation

### Api Key

The api key is stored in the [env](./env) file as `VITE_OMDBAPI_KEY`, in a production enviroment this would not be commited, to prevent leaking of any API keys.

### Styling

I've opted for tailwind class names for the styling, as it's the quickest way to bootstrap such an application.

### API library

I've used <a href="https://zod.dev/" rel="noopener">Zod</a> library in this repository for the data schema validation, which was not a requirement but it's almost for free code wise and makes your types much easier to reason about.

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

## Notes

Things I would improve:

- Use a routing library, but as routing wasn't required I've opted not to use it for the sake of simplicity
- Use fetching library instead of doing a custom rolled solution using the cancellable Promise
- Add tests
- More user-friendly errors
