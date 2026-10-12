import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "https://iuqgbbqyycpsamlpagnj.supabase.co")
    SUPABASE_ANON_KEY: str = os.getenv(
        "SUPABASE_ANON_KEY",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1cWdiYnF5eWNwc2FtbHBhZ25qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE3MjY0MjUsImV4cCI6MjEwNzMwMjQyNX0.xNRc6ZA5B9IR3WqADsbFPV098mVhlvnXaHHqHfDL_kA"
    )
    CORS_ORIGINS: str = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173")
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
