# Prueba Lite Thinking Frontend

This is the frontend application for the Lite Thinking technical test, built with React, React Router, and TailwindCSS.

## Features

- 🚀 Modern React application with React Router
- ⚡️ Hot Module Replacement (HMR) for rapid development
- 📦 Asset bundling and optimization with Vite
- 🔄 API integration with the backend service
- 🔒 TypeScript for type safety
- 🎉 TailwindCSS for responsive styling
- 📱 Responsive design for all device sizes

## Prerequisites

- Node.js 18+
- npm or yarn
- Backend service running

## Installation

1. Clone the repository
2. Navigate to the frontend directory
3. Install dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file in the frontend directory with the following variables:

```env
VITE_API_URL=http://localhost:8000
```

## Running the Application

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:3000`.

## Building for Production

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Docker Deployment

The application can be run using Docker Compose:

```bash
docker-compose up -d
```

## Connecting to the Backend

The frontend is configured to connect to the backend API at the URL specified in the `VITE_API_URL` environment variable. Make sure the backend is running before using the frontend application.

## Authentication

Use the admin credentials created with the backend's create_admin script to log in:

```text
Email: edrayoca@gmail.com
Password: password
```docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
