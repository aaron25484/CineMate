import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMovieContext } from '../context/movieContext';
import { useAuth0 } from '@auth0/auth0-react';

interface MovieModalProps {
  isOpen: boolean;
  onClose: () => void;
  closeModal: () => void;
}

interface Genre {
  id: string,
  name: string
}

// const genres = ['Action', 'Drama', 'Comedy'];

interface FormData {
  name: string;
  score: number;
  genre: string;
  poster: FileList;
}

const MovieModal: React.FC<MovieModalProps> = ({ isOpen, onClose }) => {
  const { register, handleSubmit, setValue } = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const {updateMovies} = useMovieContext()
  const {getAccessTokenSilently} = useAuth0()
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch('http://localhost:4000/genres', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const genresData = await response.json();
          setGenres(genresData);
        } else {
          console.error(`Failed to fetch genres: ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, [getAccessTokenSilently]);

  const onSubmit = async (data: FormData) => {
      setLoading(true)

      const poster = data.poster[0]

      const formData = new FormData();
      formData.append('file', poster);
      formData.append("upload_preset", "posterPreset" )
  
      try {

        const accessToken = await getAccessTokenSilently()
        console.log('accessToken:', accessToken)
        
      const uploadResponse = await fetch('https://api.cloudinary.com/v1_1/dy6oz4gvn/image/upload',
          {
            method: 'POST',
            body: formData,
            mode: 'cors',
          }
        )
        if (!uploadResponse.ok) {
          throw new Error("Image upload failed");
        }
        const imageData = await uploadResponse.json();
        const posterUrl = imageData.secure_url;

      
        const movieData = {
          name: data.name,
          score: data.score,
          genre: data.genre,
          poster: posterUrl,
        }
        console.log('movie data:', movieData)
      
      const url = 'http://localhost:4000'

      const response = await fetch(`${url}/movies`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(movieData),
      });

      if (!response.ok) {
        console.error('Failed to submit movie. Server response:', response)
        throw new Error('Failed to submit movie');
      }
      console.log('Movie submitted successfully', movieData);
      const updatedMovies = await fetch(`${url}/movies`).then((res) => res.json());
      updateMovies(updatedMovies);
      setLoading(false);
      onClose();
    } catch (error) {
      console.error('Error submitting movie:', error);
      setLoading(false);
    }
  };

  const handleGenreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setValue('genre', event.target.value);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none" onClick={handleOverlayClick}>
          <div className="relative w-auto max-w-3xl mx-auto my-6">

            <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">

              <div className="flex items-start justify-between p-5 border-b border-solid rounded-t border-blueGray-200">
                <h3 className="text-3xl font-semibold">Add Movie</h3>
                <button
                  className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                  onClick={onClose}
                >
                  <span className="text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                    ×
                  </span>
                </button>
              </div>

              <div className="relative p-6 flex-auto">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Name:
                    </label>
                    <input
                      type="text"
                      className="border rounded w-full py-2 px-3"
                      {...register('name')}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Score:
                    </label>
                    <select
                      className="border rounded w-full py-2 px-3"
                      {...register('score')}
                    >
                      {Array.from({ length: 11 }, (_, i) => (
                        <option key={i} value={i}>
                          {i}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Genre:
                    </label>
                    <select
                      className="border rounded w-full py-2 px-3"
                      {...register('genre')}
                      onChange={handleGenreChange}
                    >
                      <option value="" disabled>
                        Select a genre
                      </option>
                      {genres.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Poster:
                    </label>
                    <input
                      type="file"
                      accept=".jpg, .jpeg, .webp"
                      {...register('poster')}
                    />
                  </div> 
                  {loading ? (
                    <p>Loading...</p>
                  ):(

                    <button
                    type="submit"
                    className="bg-blue-500 text-white active:bg-blue-800 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                  >
                    Save
                  </button>
                )}
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MovieModal;
