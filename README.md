# Boilerplate

## Installation

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
