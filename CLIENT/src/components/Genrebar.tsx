
import React from "react";

export interface Genre {
  id: string;
  name: string;
}
interface GenreBarProps {
  genres:  { id: string; name: string }[];
  onGenreFilter: (genreId: string | null) => void;
}

const GenreBar: React.FC<GenreBarProps> = ({ genres, onGenreFilter }) => {
  return (
    <div className="flex justify-center space-x-4 my-4">
      <button
        className="text-white"
        onClick={() => onGenreFilter(null)}
      >
        All
      </button>
      {genres.map((genre) => (
        <button
          key={genre.id}
          className="text-white"
          onClick={() => {console.log("Clicked genre button with id:", genre.id);
          onGenreFilter(String(genre.id));}}
        >
          {genre.name}
        </button>
      ))}
    </div>
  );
};

export default GenreBar;
