from pydantic_settings import BaseSettings, SettingsConfigDict
import os


class Settings(BaseSettings):
    """Application settings."""

    PROJECT_NAME: str = "Prueba Lite Thinking"
    DATABASE_URL: str
    DATABASE_URL_SYNC: str = ""
    DEBUG: bool = False

    # JWT Settings
    JWT_SECRET: str  # Change in production
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION: int = 30  # minutes

    # DeepSeek Settings
    API_KEY: str = ""

    RESEND_KEY: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
    )


settings = Settings()
