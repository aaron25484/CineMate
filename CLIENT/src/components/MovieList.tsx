import React, { useState, useEffect } from "react";
import { useMovieContext } from "../context/movieContext";
import GenreBar from "./Genrebar";
import MovieCard from "./MovieCard";
import { useAuth0 } from "@auth0/auth0-react";

const MovieList: React.FC = () => {
  const {
    movies: allMovies,
    updateMovies,
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
  } = useMovieContext();
  const [filteredMovies, setFilteredMovies] = useState(allMovies);
  const [genres, setGenres] = useState<string[]>([]);
  const { user } = useAuth0();
  const {VITE_API_URL} = import.meta.env

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moviesResponse, genresResponse] = await Promise.all([
          fetch(`${VITE_API_URL}movies`),
          fetch(`${VITE_API_URL}genres`),
        ]);

        if (!moviesResponse.ok) {
          console.error(`Failed to fetch movies: ${moviesResponse.statusText}`);
          return;
        }

        const updatedMovies = await moviesResponse.json();

        if (user) {
          try {
            const watchlistResponse = await fetch(
              `${VITE_API_URL}users/${user.email}/watchlist`
            );

            if (watchlistResponse.ok) {
              const watchlistData = await watchlistResponse.json();

              const updatedFilteredMovies = updatedMovies.map((movie) => ({
                ...movie,
                isInWatchlist: watchlistData.some(
                  (watchlistMovie) => watchlistMovie.id === movie.id
                ),
              }));

              setFilteredMovies(updatedFilteredMovies);
            } else {
              console.error(
                `Failed to fetch watchlist: ${watchlistResponse.statusText}`
              );
            }
          } catch (error) {
            console.error("Error fetching watchlist:", error);
          }
        } else {
          setFilteredMovies(updatedMovies);
        }

        if (genresResponse.ok) {
          const genresData = await genresResponse.json();
          setGenres(genresData);
        } else {
          console.error(`Failed to fetch genres: ${genresResponse.statusText}`);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [updateMovies, user]);

  const handleGenreFilter = (genreId: string | null) => {
    if (genreId) {
      const filteredMovies = allMovies.filter(
        (movie) => movie.genreId === genreId
      );
      setFilteredMovies(filteredMovies);
    } else {
      setFilteredMovies(allMovies);
    }
  };

  const isInWatchlist = (movieId: string) => {
    return watchlist.some((watchlistMovie) => watchlistMovie.id === movieId);
  };

  const handleToggleWatchlist = async (movieId: string) => {
    if (isInWatchlist(movieId)) {
      removeFromWatchlist(movieId);
    } else {
      addToWatchlist(movieId);
    }
  };

  return (
    <div className="container mx-auto mt-4">
      <GenreBar genres={genres} onGenreFilter={handleGenreFilter} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
        {filteredMovies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onToggleWatchlist={handleToggleWatchlist}
            isInWatchlist={isInWatchlist(movie.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default MovieList;
