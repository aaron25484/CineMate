import { useState, useEffect } from "react";
import MovieModal from "./MovieModal";
import { useAuth0 } from "@auth0/auth0-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createUser } from "../services/user.service";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userName, setUserName] = useState<string>();
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } =
    useAuth0();
  const {VITE_API_URL} = import.meta.env

  const openModal = () => {
    if (!isAuthenticated) {
      notify("You need to log in to create a movie");
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
          const response = await fetch(
            `${VITE_API_URL}users/${user?.email}`
          );
          if (response.ok) {
            const userData = await response.json();

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
        } catch (error) {
          console.error("Error creating user:", error);
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
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastStyle={{
          background: "#3d405b",
          color: "#edf2f4",
        }}
      />
      <nav id="barrita" className="glass-navbar p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            {!isAuthenticated && (
              <img
                src="./src/assets/img/logo.png"
                alt="Clapperboard"
                className=" w-40 h-40"
              />
            )}
            {isAuthenticated && userName && (
              <div className="flex items-center">
                <Link to="/user/profile" className="text-white mr-4">
                  Welcome, {userName}
                </Link>
                <img
                  src={user?.picture}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full"
                />
              </div>
            )}
          </div>
          <Link to="/" className=" text-sky-300 text-4xl font-semibold">
            CineMate
          </Link>

          <div className="flex items-center justify-end space-x-4">
            <button
              onClick={openModal}
              className="glass-button bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-300"
            >
              Create Movie
            </button>
            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                }}
                className="glass-button bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition duration-300"
              >
                Logout
              </button>
            ) : (
              <button
                className="glass-button bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition duration-300"
                onClick={() => {
                  loginWithRedirect();
                }}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>
      <MovieModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        onClose={closeModal}
      />
    </>
  );
};

export default Navbar;
