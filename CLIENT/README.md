CineMate - Your MovieHub
CineMate is a feature-rich MovieHub application developed as a backend project for Assembler Institute. It utilizes a stack comprising React, Typescript, Express, Prisma, MongoDB, Mongoose, and Tailwind CSS. Additionally, image uploads are seamlessly handled through Cloudinary.

Features
CRUD Operations: CineMate provides comprehensive CRUD (Create, Read, Update, Delete) operations for managing movies.

Watchlist Functionality: Users can easily add movies to their watchlist, helping them keep track of the films they plan to watch.

Getting Started
To get started with CineMate, follow these steps:

Clone the Repository:

bash
Copy code
git clone https://github.com/your-username/CineMate.git
Install Dependencies:
Ensure you have pnpm installed, and then run:

bash
Copy code
pnpm install
This command will install all the necessary dependencies for the project.

Configure Environment Variables:
Create a .env file in the root directory and set the required environment variables, including your Cloudinary credentials.

Example .env file:

env
Copy code
PORT=3000
DATABASE_URL=your_mongodb_connection_string
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
Run the Application:

bash
Copy code
pnpm start
This will start the server, and your CineMate MovieHub will be accessible at http://localhost:3000.

Contributing
Feel free to contribute to the development of CineMate by submitting issues or pull requests. Your contributions are highly appreciated!

License
This project is licensed under the MIT License.