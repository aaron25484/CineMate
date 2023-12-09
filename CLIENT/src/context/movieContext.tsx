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
  genreId: string;
  isInWatchlist?: boolean;

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
  const {VITE_API_URL} = import.meta.env

  const { user } = useAuth0();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const moviesResponse = await fetch(`${VITE_API_URL}movies`);
        
        if (moviesResponse.ok) {
          const updatedMovies = await moviesResponse.json();
          setMovies(updatedMovies);
        } else {
          console.error(`Failed to fetch movies: ${moviesResponse.statusText}`);
        }
  
        if (user) {
          const watchlistResponse = await fetch(`${VITE_API_URL}users/${user.email}/watchlist`);
  
          if (watchlistResponse.ok) {
            const watchlistData = await watchlistResponse.json();
            setWatchlist(watchlistData);
          } else {
            console.error(`Failed to fetch watchlist: ${watchlistResponse.statusText}`);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [user]);

  const updateMovies = (newMovies: Movie[]) => {
    setMovies((prevMovies) => [...prevMovies, ...newMovies]);
  };

  const addToWatchlist = async (movieId: string) => {
    try {
      if (user) {
        const response = await fetch(
          `${VITE_API_URL}users/${user?.email}/watchlist`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ movieId }),
          }
        );

        if (response.ok) {
          setWatchlist((prevWatchlist) => [
            ...prevWatchlist,
            { id: movieId, name: "", score: 0, poster: "", genreId: "" },
          ]);
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
          `${VITE_API_URL}users/${user?.email}/watchlist`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ movieId }),
          }
        );

        if (response.ok) {

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
