import React, { useState, useEffect } from 'react';

interface Movie {
  _id: string;
  name: string;
  score: number;
  poster: string;
}

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const {name, score, poster} = movie
  return (
    <div className="bg-white p-4 rounded-md shadow-md mb-4">
      <h2 className="text-xl font-semibold">{name}</h2>
      <img src={poster} alt="" />
      <p className="text-gray-600">{score}</p>
    </div>
  );
};

const MovieCards: React.FC =  () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    fetch('http://localhost:4000/movies')
      .then(response => response.json())
      .then(data => setMovies(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-semibold mb-4">Movie List</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {movies.map(movie => (
          <MovieCard key={movie._id} movie={movie} />
          
        ))}
        
      </div>
    </div>
  );
};

export default MovieCards