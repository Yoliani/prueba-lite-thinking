# Lite Thinking Technical Test

A full-stack application for managing companies and their product inventories with role-based access control.

## Project Overview

This application consists of three main components:

1. **Frontend**: React application with a modern UI for managing companies and products
2. **Backend**: FastAPI Python application providing RESTful API endpoints
3. **Database**: PostgreSQL database for data persistence

## Features

- Company management (CRUD operations)
- Product inventory tracking
- Role-based access control (Admin and External users)
- PDF report generation for inventory
- Email functionality for sending reports

## Architecture

The application follows a clean architecture approach with:

- **Frontend**: React with optimized components and state management
- **Backend**: FastAPI with repositories, services, and routes for each entity
- **Database**: PostgreSQL with proper relations between entities

## Models

- **Company**: nit (primary key), name, address, phone
- **Product**: id, code, name, characteristics, prices (JSON), company_nit (foreign key)
- **InventoryItem**: id, quantity, product_id (foreign key)
- **User**: id, email, hashed_password, role (ADMIN or EXTERNAL)

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Git

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd prueba-lite-thinking
   ```

2. Create a `.env` file in the root directory with the following variables (adjust as needed):

   ```env
   DATABASE_URL=postgresql://postgres:postgres@db:5432/postgres
   SECRET_KEY=your_secret_key
   SMTP_USER=your_email@example.com
   SMTP_PASSWORD=your_email_password
   SMTP_SERVER=smtp.example.com
   SMTP_PORT=587
   ```

3. Start the application using Docker Compose:

   ```bash
   docker-compose up -d
   ```

4. Access the application:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:8000](http://localhost:8000)
   - API Documentation: [http://localhost:8000/docs](http://localhost:8000/docs)

## Development

The project is set up for easy development with volume mounts for both frontend and backend, allowing for live code changes without rebuilding containers.

### Backend Development

The backend directory contains a README with specific instructions for running the backend independently.

### Frontend Development

The frontend directory contains a README with specific instructions for running the frontend independently.

## Performance Optimization

The frontend has been optimized to address performance issues:

- Code splitting and lazy loading for faster initial load
- Optimized image loading
- Memoized components and calculations
- Virtualization for large data sets
- Optimized CSS and reduced re-renders
- Production builds with proper bundling and minification

## License

[Add your license information here]
