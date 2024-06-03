# Recipe Book

Recipe Book is a web application built with Next.js and React that allows users to register, log in, post recipes, and manage their favorite recipes. The app also includes a blog section powered by DatoCMS. The frontend is styled using Tailwind CSS, and the backend is integrated with MongoDB for data storage. The app features robust authentication using Next-auth and handles file uploads to AWS S3.

## Features

- User authentication (register, login, logout)
- Post, edit, delete recipes
- Upload photos for recipes
- Add recipes to favorites
- Browse recipes by category
- Blog section with categories
- Responsive design with Tailwind CSS
- Google Analytics integration
- Compliance with web accessibility standards

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- MongoDB Atlas account
- AWS account for S3
- DatoCMS account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/recipe-book.git
   ```

2. Navigate to the project directory:
   ```bash
   cd recipe-book
   ```

3. Install dependencies:
   ```bash
   npm install
# or
yarn install
```

4. Set up environment variables:

Create a `.env.local` file in the root of the project and add the following:
```bash
NEXTAUTH_URL=http://localhost:3000
MONGODB_URI=your-mongodb-uri
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_REGION=your-aws-region
S3_BUCKET_NAME=your-s3-bucket-name
DATOCMS_API_TOKEN=your-datocms-api-token
```

### Running the Development Server

Start the development server:
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

Build the application for production:
```bash
npm run build
# or
yarn build
```

Start the production server:
```bash
npm run start
# or
yarn start
```

### API Routes

API routes can be accessed on [http://localhost:3000/api](http://localhost:3000/api). These endpoints include user authentication, recipe management, and photo uploads.

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
