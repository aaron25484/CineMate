import { useAuth0 } from "@auth0/auth0-react";
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";

interface Movie {
  id: string;
  name: string;
  score: number;
  poster: string;
  genreId: string
}

interface MovieContextProps {
  children: ReactNode;
}

interface MovieContextValue {
  movies: Movie[];
  watchlist: Movie[];
  updateMovies: (newMovies: Movie[]) => void;
  addToWatchlist: (movieId: string) => void;
  removeFromWatchlist: (movieId: string) => void;
}

const MovieContext = createContext<MovieContextValue | undefined>(undefined);

export const MovieProvider: React.FC<MovieContextProps> = ({ children }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [watchlist, setWatchlist] = useState<Movie[]>([]);

  const { user } = useAuth0();

  useEffect(() => {
    // Fetch movies and watchlist data from the server
    // Update the state accordingly
    const fetchData = async () => {
      try {
        const [moviesResponse, watchlistResponse] = await Promise.all([
          fetch("http://localhost:4000/movies"),
          fetch("http://localhost:4000/user/watchlist"), // Adjust the endpoint based on your API
        ]);

        if (moviesResponse.ok) {
          const updatedMovies = await moviesResponse.json();
          setMovies(updatedMovies);
        } else {
          console.error(`Failed to fetch movies: ${moviesResponse.statusText}`);
        }

        if (watchlistResponse.ok) {
          const watchlistData = await watchlistResponse.json();
          setWatchlist(watchlistData);
        } else {
          console.error(`Failed to fetch watchlist: ${watchlistResponse.statusText}`);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);


  const updateMovies = (newMovies: Movie[]) => {
    // Combine the existing movies with the new ones
    setMovies((prevMovies) => [...prevMovies, ...newMovies]);
  };
  const addToWatchlist = async (movieId: string) => {
    try {
      if (user) {
        const response = await fetch(
          `http://localhost:4000/users/${user.email}/watchlist`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ movieId }),
          }
        );
        console.log(response);

        if (response.ok) {
          console.log(`Movie with ID ${movieId} added to watchlist`);
          setWatchlist((prevWatchlist) => [...prevWatchlist, { id: movieId }]);
        } else {
          console.error(
            `Failed to add movie to watchlist: ${response.statusText}`
          );
        }
      } else {
        console.warn("User not authenticated. Cannot add to watchlist.");
      }
    } catch (error) {
      console.error("Error adding movie to watchlist:", error);
    }
  };

  const removeFromWatchlist = async (movieId: string) => {
    try {
      if (user) {
        const response = await fetch(
          `http://localhost:4000/users/${user.email}/watchlist`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ movieId }),
          }
        );

        if (response.ok) {
          console.log(`Movie with ID ${movieId} removed from watchlist`);

          setWatchlist((prevWatchlist) =>
            prevWatchlist.filter((movie) => movie.id !== movieId)
          );
        } else {
          console.error(
            `Failed to remove movie from watchlist: ${response.statusText}`
          );
        }
      } else {
        console.warn("User not authenticated. Cannot remove from watchlist.");
      }
    } catch (error) {
      console.error("Error removing movie from watchlist:", error);
    }
  };

  const value = {
    movies,
    watchlist,
    updateMovies,
    addToWatchlist,
    removeFromWatchlist,
  };

  return (
    <MovieContext.Provider value={value}>{children}</MovieContext.Provider>
  );
};

export const useMovieContext = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error("useMovieContext must be used within a MovieProvider");
  }
  return context;
};
