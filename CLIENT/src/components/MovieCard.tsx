// MovieCard.tsx

import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useMovieContext } from "../context/movieContext";

export interface Movie {
  id: string;
  name: string;
  score: number;
  poster: string;
  genreId: string;
}

interface MovieCardProps {
  movie: Movie;
  onToggleWatchlist: (movieId: string) => void;
  isInWatchlist: boolean;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onToggleWatchlist, isInWatchlist }) => {
  const { name, score, poster, id } = movie;
  const [isHovered, setIsHovered] = useState(false);
  const { isAuthenticated } = useAuth0();

  

  const handleToggleWatchlist = () => {
    if (isAuthenticated) {
      onToggleWatchlist(id);
    }
  };

  return (
    <div
      className="bg-opacity-80 bg-yellow-800 p-4 rounded-md shadow-md mb-4 transition-transform transform hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={poster}
        alt="movie poster"
        className="w-full h-64 object-contain rounded-md mb-4"
      />
      <div>
        <h2 className="text-xl font-semibold mb-2 text-yellow-400">{name}</h2>
        <p className="text-gray-600">Rating: {score}</p>

        {/* Add to Wishlist button */}
        {isHovered && isAuthenticated && (
          <button
            onClick={handleToggleWatchlist}
            className={`${
              isInWatchlist ? "bg-red-500" : "bg-blue-500"
            } hover:bg-blue-600 text-white px-4 py-2 rounded-md mt-2 transition duration-300`}
          >
            {isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
          </button>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
