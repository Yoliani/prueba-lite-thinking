from fastapi import FastAPI

from api.core.config import settings
from api.core.logging import get_logger, setup_logging
from api.src.companies.routes import router as companies_router
from api.src.inventory.routes import router as inventory_router
from api.src.products.routes import router as products_router
from api.src.users.routes import router as auth_router
from api.src.chat.routes import router as chat_router
from api.utils.migrations import run_migrations
from fastapi.middleware.cors import CORSMiddleware

origins = [
    "*"
]
# Set up logging configuration
setup_logging()

# Optional: Run migrations on startup
run_migrations()

# Set up logger for this module
logger = get_logger(__name__)

app = FastAPI(
    title=settings.PROJECT_NAME,
    debug=settings.DEBUG,
    version="0.1.0",
    docs_url="/swagger",
    redoc_url=None,
    openapi_url="/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include routers
app.include_router(auth_router)
app.include_router(companies_router)
app.include_router(products_router)
app.include_router(inventory_router)
app.include_router(chat_router)


@app.get("/health")
async def health_check():
    return {"status": "ok"}


@app.get("/")
async def root():
    """Root endpoint."""
    logger.debug("Root endpoint called")
    return {"message": "Welcome to Hero API!"}
