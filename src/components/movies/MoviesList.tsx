/* export const MovieList = ({ groupedMovies: movies, onSelectMovieId }) => {
 *   return (
 *     <div className="container mx-auto px-4">
 *       {Object.keys(movies)
 *         .sort()
 *         .reverse()
 *         .map((year) => (
 *           <div key={year} className="mb-8">
 *             <h2 className="mb-4 text-xl font-bold">{year}</h2>
 *             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
 *               {movies[year].map((movie) => (
 *                 <div
 *                   key={movie.imdbID}
 *                   className="overflow-hidden rounded-lg border border-slate-700 bg-slate-800 shadow-lg"
 *                   onClick={() => onSelectMovieId(movie.imdbID)}
 *                 >
 *                   <div
 *                     className="h-56 bg-cover bg-center"
 *                     style={{ backgroundImage: `url(${movie.Poster})` }}
 *                   >
 *                     {movie.Poster === "N/A" && (
 *                       <div className="flex h-56 items-center justify-center bg-slate-600 opacity-50">
 *                         No Image Available
 *                       </div>
 *                     )}
 *                   </div>
 *                   <div className="p-4">
 *                     <h3 className="text-lg font-bold">{movie.Title}</h3>
 *                     <p className="text-sm">
 *                       {movie.Type}, {movie.Year}
 *                     </p>
 *                     <a
 *                       href={`https://www.imdb.com/title/${movie.imdbID}`}
 *                       target="_blank"
 *                       rel="noopener noreferrer"
 *                       className="mt-4 inline-block text-blue-500 hover:text-blue-600"
 *                     >
 *                       View on IMDB
 *                     </a>
 *                   </div>
 *                 </div>
 *               ))}
 *             </div>
 *           </div>
 *         ))}
 *     </div>
 *   );
 * }; */
