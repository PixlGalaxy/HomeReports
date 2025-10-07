from pydantic_settings import BaseSettings
from pydantic import AnyHttpUrl

class Settings(BaseSettings):
    BACKEND_PORT: int = 8000
    BACKEND_HOST: str = "0.0.0.0"
    ALLOWED_ORIGINS: str = "http://localhost:5173"
    DATA_FILE: str = "./data/reports.yml"
    UPLOAD_DIR: str = "./uploads"
    OLLAMA_BASE_URL: AnyHttpUrl | str = "http://ollama:11434"
    OLLAMA_MODEL: str = "llama3.1"
    SKIP_OLLAMA: bool = False

    class Config:
        env_file = ".env"

settings = Settings()
