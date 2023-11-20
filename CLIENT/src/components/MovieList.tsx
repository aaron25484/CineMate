// MovieList.tsx

import React, { useState, useEffect } from "react";
import { useMovieContext } from "../context/movieContext";
import GenreBar from "./Genrebar";
import MovieCard from "./MovieCard";
import { useAuth0 } from "@auth0/auth0-react";

const MovieList: React.FC = () => {
  const { movies: allMovies, updateMovies, watchlist, addToWatchlist, removeFromWatchlist } = useMovieContext();
  const [filteredMovies, setFilteredMovies] = useState(allMovies);
  const [genres, setGenres] = useState<string[]>([]);
  const {user} = useAuth0()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moviesResponse, genresResponse, watchlistResponse] = await Promise.all([
          fetch("http://localhost:4000/movies"),
          fetch("http://localhost:4000/genres"),
          fetch(`http://localhost:4000/users/${user?.email}/watchlist`), // Add this line
        ]);

        if (moviesResponse.ok) {
          const updatedMovies = await moviesResponse.json();
          setFilteredMovies(updatedMovies);
        } else {
          console.error(`Failed to fetch movies: ${moviesResponse.statusText}`);
        }

        if (genresResponse.ok) {
          const genresData = await genresResponse.json();
          setGenres(genresData);
        } else {
          console.error(`Failed to fetch genres: ${genresResponse.statusText}`);
        }

        if (watchlistResponse.ok) {
          const watchlistData = await watchlistResponse.json();
          updateWatchlist(watchlistData); // Assuming there's a function to update watchlist in the movie context
        } else {
          console.error(`Failed to fetch watchlist: ${watchlistResponse.statusText}`);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [updateMovies]);

  const handleGenreFilter = (genreId: string | null) => {
    if (genreId) {
      const filteredMovies = allMovies.filter((movie) => movie.genreId === genreId);
      setFilteredMovies(filteredMovies);
    } else {
      setFilteredMovies(allMovies);
    }
  };

  const handleToggleWatchlist = async (movieId: string) => {
    // Toggle the movie in the user's watchlist
    if (watchlist.some((watchlistMovie) => watchlistMovie.id === movieId)) {
      removeFromWatchlist(movieId);
    } else {
      addToWatchlist(movieId);
    }
  };

  const isInWatchlist = (movieId: string) => {
    return watchlist.some((watchlistMovie) => watchlistMovie.id === movieId);
  };

  return (
    <div className="container mx-auto mt-4">
      <h1 className="text-3xl font-semibold mb-4">Movie List</h1>
      <GenreBar genres={genres} onGenreFilter={handleGenreFilter} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
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
