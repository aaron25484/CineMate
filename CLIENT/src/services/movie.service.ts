
const {VITE_API_URL} = import.meta.env


interface MovieData {
  name: string;
  score: number;
  genre: string;
  poster: string;
}

export const createMovie = async (
  movieData: MovieData,
  token: string
): Promise<{ message?: string; error?: string }> => {
  try {
    const response = await fetch(`${VITE_API_URL}movies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`
      },
      body: JSON.stringify(movieData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create movie');
    }

    const responseData = await response.json();
    return { message: responseData.message };
  } catch (error) {
    console.error('Error creating movie:', error);
    return { error: 'Failed to create movie' };
  }
};

export const getMovies = async (movieId: string) => {
  try {
    const response = await fetch(`${VITE_API_URL}movies/${movieId}`);

    if (response.ok) {
      const movies = await response.json();
      return movies;
    } else {
      const errorData = await response.json(); // Parse error response
      console.error(`Failed to fetch movie details for ID ${movieId}:`, errorData);
      throw new Error(`Failed to fetch movie details for ID ${movieId}`);
    }
  } catch (error) {
    console.error('Error fetching movies:', error);
    return null;
  }
};

