# Prueba Lite Thinking Backend

This is the backend service for the Lite Thinking technical test, built with FastAPI and PostgreSQL.

## Features

- Role-based access control (Admin and External users)
- Company and product management
- Inventory tracking
- PDF report generation
- Email functionality

## Prerequisites

- Python 3.12+
- PostgreSQL database
- uv package manager

## Installation

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies with uv:

```bash
uv sync
```

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/postgres
JWT_SECRET=your_secret_key
API_KEY=your_api_key
RESEND_KEY=your_resend_key
DEBUG=True
```

## Running the Application

To run the application in development mode:

```bash
uv run fastapi dev api/main.py
```

Or with uvicorn directly:

```bash
uv run uvicorn api.main:app --reload
```

The API will be available at `http://localhost:8000`

## Creating a Superadmin User

To create a superadmin user, run:

```bash
python -m scripts.create_admin --email edrayoca@gmail.com --password password
```

## Docker Deployment

The application can be run using Docker Compose:

```bash
docker-compose up -d
```

## API Documentation


API documentation is available at:

- Swagger UI: `http://localhost:8000/swagger`
- OpenAPI JSON: `http://localhost:8000/openapi.json`