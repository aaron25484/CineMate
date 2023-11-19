import { useState } from "react";
import MovieModal from "./MovieModal";
import "./navbar.css"
import { useAuth0 } from "@auth0/auth0-react";

const Navbar: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {loginWithRedirect, logout, user, isAuthenticated, isLoading} = useAuth0()

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  

  if (isLoading) {
    return <div>Loading ...</div>;
  }
console.log("user", user)
  return (
    <>
      <nav id="barrita" className="bg-opacity-90 bg-blur-md backdrop-filter backdrop-blur-md bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">

          <div className="flex items-center">
            <span className="text-white text-lg font-semibold">CineMate</span>
            {isAuthenticated && user && (
              <>
                <span className="text-white ml-4">Welcome, {user.name}!</span>
                <img
                  src={user.picture}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full ml-2"
                /> 
              </>
            )}
          </div>

          <div className="flex items-center space-x-4">
          <button
                  onClick={openModal}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-300"
                >
                  Create Movie
                </button>
            {isAuthenticated ? (

              <button
                onClick={()=>{logout()}}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition duration-300"
              >
                Logout
              </button>
            ) : (
              <>
                
                <button
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition duration-300"
                  onClick={() => {
                    loginWithRedirect();
                  }}
                >
                  Login
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
      <MovieModal isOpen={isModalOpen} closeModal={closeModal} onClose={closeModal} />
    </>
  );
};

export default Navbar;
