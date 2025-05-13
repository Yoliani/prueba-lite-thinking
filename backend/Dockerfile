FROM python:3.12-slim

# Install uv.
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Copy the application into the container.
COPY . /app

# Install the application dependencies.
WORKDIR /app
RUN uv sync --frozen --no-cache

RUN apt-get update && apt-get install --no-install-recommends -y \
    libglib2.0-0 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libcairo2


ENV DATABASE_URL=${DATABASE_URL}
ENV JWT_SECRET=${JWT_SECRET}
ENV API_KEY=${API_KEY}
ENV RESEND_KEY=${RESEND_KEY}
ENV DEBUG=${DEBUG}

EXPOSE 8000

CMD ["uv", "run", "fastapi", "api/main.py", "--port", "8000", "--host", "0.0.0.0"]
