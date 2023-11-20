# CineMate - Your MovieHub

CineMate is a powerful MovieHub application developed as a backend project for Assembler Institute. The technology stack includes React, Typescript, Express, Prisma, MongoDB, Mongoose, Tailwind CSS, Auth0 for authentication, and Cloudinary for handling image uploads.

## Features

### CRUD Operations
CineMate offers comprehensive CRUD (Create, Read, Update, Delete) operations for effective movie management.

### Watchlist Functionality
Users can effortlessly add movies to their watchlist, aiding them in keeping track of the films they plan to watch.

### Auth0 Integration
Auth0 is used for secure authentication. Follow the steps below to integrate Auth0:

1. **Install Auth0 Dependencies**

```bash
pnpm install auth0
Configure Environment Variables
Update your .env file to include Auth0 variables:

env
Copy code
PORT=3000
DATABASE_URL=your_mongodb_connection_string
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
AUTH0_DOMAIN=your_auth0_domain
AUTH0_CLIENT_ID=your_auth0_client_id
AUTH0_CLIENT_SECRET=your_auth0_client_secret
Implement Auth0 in Your Code
Integrate Auth0 into your authentication flow. Use Auth0 variables from process.env in your authentication logic.

Monorepo
CineMate is structured as a monorepo, meaning that both the frontend and backend are housed within the same repository. This approach offers several benefits, including centralized version control, shared dependencies, and simplified project management.

CORS and Backend Configuration
Ensure that CORS (Cross-Origin Resource Sharing) is properly configured for your Express backend. Install the CORS middleware by running:

bash
Copy code
pnpm install cors
Update your backend code to include CORS:

typescript
Copy code
// Import CORS
import cors from 'cors';

// Use CORS middleware
app.use(cors());
Getting Started
Clone the Repository
bash
Copy code
git clone https://github.com/your-username/CineMate.git
Install Dependencies
Ensure you have pnpm installed, and then run:

bash
Copy code
pnpm install
This command will install all the necessary dependencies for both the frontend and backend.

Configure Environment Variables
Create a .env file in the root directory and set the required environment variables, including Auth0, Cloudinary, and CORS configurations.

Example .env file:

env
Copy code
PORT=3000
DATABASE_URL=your_mongodb_connection_string
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
AUTH0_DOMAIN=your_auth0_domain
AUTH0_CLIENT_ID=your_auth0_client_id
AUTH0_CLIENT_SECRET=your_auth0_client_secret
Run the Application
Open two separate terminal windows:

Frontend:
bash
Copy code
cd frontend
pnpm start
Backend:
bash
Copy code
cd backend
pnpm start
Your CineMate MovieHub will be accessible at http://localhost:3000.