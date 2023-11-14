

const Navbar = () => {
  return (
    <nav className="bg-opacity-90 bg-blur-md backdrop-filter backdrop-blur-md bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left Section */}
        <div className="flex items-center">
          <span className="text-white text-lg font-semibold">CineMate</span>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-300">
            Create Movie
          </button>
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition duration-300">
            Login
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


