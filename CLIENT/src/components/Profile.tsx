// ProfilePage.tsx

import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import MovieCard from "./MovieCard";
import { Movie } from "./MovieCard";

interface UserData {
  name: string;
  email: string;
  password: string;
}

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated } = useAuth0();
  const [userData, setUserData] = useState<UserData>({
    name: "",
    email: "",
    password: "",
  });
  const [userWatchlist, setUserWatchlist] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (isAuthenticated && user) {
          // Fetch user data from the backend
          const userDataResponse = await fetch(`http://localhost:4000/users/${user.email}`);
          if (userDataResponse.ok) {
            const userData = await userDataResponse.json();
            setUserData(userData);
          } else {
            console.error(`Failed to fetch user data: ${userDataResponse.statusText}`);
          }

          // Fetch user watchlist from the backend
          const watchlistResponse = await fetch(`http://localhost:4000/users/${user.email}/watchlist`);
          if (watchlistResponse.ok) {
            const watchlistData = await watchlistResponse.json();

            // Fetch movie details based on the movie IDs
            const movieDetailsPromises = watchlistData.map(async (movieId: string) => {
              const movieResponse = await fetch(`http://localhost:4000/movies/${movieId}`);
              if (movieResponse.ok) {
                return movieResponse.json();
              } else {
                console.error(`Failed to fetch movie details: ${movieResponse.statusText}`);
                return null;
              }
            });

            // Wait for all movie details to be fetched
            const movieDetails = await Promise.all(movieDetailsPromises);

            // Filter out null values (in case any movie details fetch failed)
            const validMovieDetails = movieDetails.filter((movie) => movie !== null);

            setUserWatchlist(validMovieDetails);
            console.log(validMovieDetails);
          } else {
            console.error(`Failed to fetch user watchlist: ${watchlistResponse.statusText}`);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [isAuthenticated, user]);

 const onToggleWatchlist = async (movieId: string) => {
    try {
      if (isAuthenticated && user) {
        // Update user watchlist on the frontend
        setUserWatchlist((prevWatchlist) => {
          if (prevWatchlist.some((movie) => movie.id === movieId)) {
            return prevWatchlist.filter((movie) => movie.id !== movieId);
          } else {
            return [...prevWatchlist, { id: movieId, name: "", score: 0, poster: "", genreId: ""  }];
          }
        });

        // Update user watchlist on the backend
        const updateWatchlistResponse = await fetch(`http://localhost:4000/users/${user.email}/watchlist`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ movieId, action: "toggle" }), // Include the movieId and action
        });

        if (!updateWatchlistResponse.ok) {
          console.error(`Failed to update user watchlist: ${updateWatchlistResponse.statusText}`);
        }
      }
    } catch (error) {
      console.error("Error toggling watchlist:", error);
    }
  };

  const isInWatchlist = (movieId: string) => {
    return userWatchlist.some((movie) => movie.id === movieId);
  };

  const handleUpdateUser = async () => {
    try {
      if (isAuthenticated && user) {
        // Update user data on the backend
        const updateUserResponse = await fetch(`http://localhost:4000/users/${user.email}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });

        if (updateUserResponse.ok) {
          console.log("User updated successfully");
        } else {
          console.error(`Failed to update user: ${updateUserResponse.statusText}`);
        }
      }
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  if (!isAuthenticated) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div className="container mx-auto mt-4">
      <h1 className="text-3xl font-semibold mb-4">User Profile</h1>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
        <input
          type="text"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Name"
          value={userData.name}
          onChange={(e) => setUserData({ ...userData, name: e.target.value })}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
        <input
          type="password"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Password"
          value={userData.password}
          onChange={(e) => setUserData({ ...userData, password: e.target.value })}
        />
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-300"
        onClick={handleUpdateUser}
      >
        Update Profile
      </button>
      {userWatchlist.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mt-8 mb-4">Watchlist</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {userWatchlist.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onToggleWatchlist={onToggleWatchlist}
                isInWatchlist={isInWatchlist(movie.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
