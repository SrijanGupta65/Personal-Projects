"""
Database connection helper.

All other code gets its Postgres connection from here, so there is ONE place
that decides which database to talk to. That choice comes from the DATABASE_URL
environment variable:

    * Local Docker (development):
        postgresql://nurseassist:nurseassist@localhost:5432/nurseassist
    * AWS RDS (later):
        postgresql://<user>:<password>@<rds-endpoint>:5432/<dbname>

Switching from local to RDS is just changing DATABASE_URL -- no code changes.
The value is read from a .env file (see .env.example) or the real environment.

All data is synthetic and for educational use only. Not medical advice.
"""

import os

import psycopg2
from dotenv import load_dotenv
from pgvector.psycopg2 import register_vector

# Load variables from a local .env file if one exists (no error if it doesn't).
load_dotenv()

# Sensible default points at the local Docker database from docker-compose.yml.
DEFAULT_LOCAL_URL = "postgresql://nurseassist:nurseassist@localhost:5432/nurseassist"


def get_database_url() -> str:
    """Return the DATABASE_URL, falling back to the local Docker database."""
    return os.environ.get("DATABASE_URL", DEFAULT_LOCAL_URL)


def get_connection():
    """
    Open a new Postgres connection with pgvector support enabled.

    The caller is responsible for closing it (use `with get_connection() as conn`).
    register_vector() teaches psycopg2 how to send/receive vector() columns.
    """
    conn = psycopg2.connect(get_database_url())
    register_vector(conn)
    return conn


def check_connection() -> bool:
    """
    Quick health check: connect and confirm the pgvector extension is installed.

    Returns True on success; raises with a readable message on failure.
    """
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT extname FROM pg_extension WHERE extname = 'vector';")
            if cur.fetchone() is None:
                raise RuntimeError(
                    "Connected, but the 'vector' extension is missing. "
                    "Did db/schema.sql run? Try: docker compose down -v && docker compose up -d"
                )
    return True


if __name__ == "__main__":
    # Run `python -m src.db` to verify the database is reachable and set up.
    print(f"Using DATABASE_URL: {get_database_url()}")
    check_connection()
    print("OK: connected and pgvector is installed.")
