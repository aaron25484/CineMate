import { useState, useEffect } from "react";
import MovieModal from "./MovieModal";
import "./navbar.css"
import { useAuth0 } from "@auth0/auth0-react";
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import { createUser } from "../utils/utils";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userName, setUserName] = useState<string>();
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();

  const openModal = () => {
    if (!isAuthenticated) {
      notify('You need to log in to create a movie');
      return;
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const notify = (message: string) => toast.error(message);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        if (isAuthenticated && user) {
          const response = await fetch(`http://localhost:4000/users/${user?.email}`);
          if (response.ok) {
            const userData = await response.json();
            console.log("Fetched user data:", userData);

            setUserName(userData.name || user?.name);
          } else {
            console.error(`Failed to fetch user data: ${response.statusText}`);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserName();
  }, [isAuthenticated, user]);

  useEffect(() => {
    const registerUserInMongoDB = async () => {
      if (isAuthenticated && user) {
        const newUser = {
          name: user.name,
          email: user.email,
          password: user.email,
        };

        try {
          const userData = await createUser(newUser);
          console.log('User created:', userData);
        } catch (error) {
          console.error('Error creating user:', error);
        }
      }
    };

    registerUserInMongoDB();
  }, [isAuthenticated, user]);

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    <>
      <ToastContainer />
      <nav id="barrita" className="bg-opacity-90 bg-blur-md backdrop-filter backdrop-blur-md bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">

          <div className="flex items-center">
          <Link to="/" className="text-white text-lg font-semibold">CineMate</Link>
            {isAuthenticated && userName && (
              <>
              <div className="flex items-center ml-4">
                <Link to="/user/profile" className="text-white ml-4">
                  Welcome, {userName}
                  </Link>
                <img
                  src={user?.picture}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full ml-2"
                />
                                

                </div>
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
                onClick={() => { logout() }}
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
