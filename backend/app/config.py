import os

from sqlalchemy.engine import make_url


def _database_config():
    """Split a bare `?ssl=true` flag out of DATABASE_URL into engine connect_args.

    PyMySQL expects `ssl` to be a dict/SSLContext, not the string a URL query
    value would otherwise pass through as, so managed hosts (e.g. Aiven) that
    require TLS need the flag translated rather than left in the URL.
    """
    raw_url = os.environ.get("DATABASE_URL", "sqlite:///dev.db")
    url = make_url(raw_url)
    query = dict(url.query)
    ssl_flag = query.pop("ssl", None)
    engine_options = {}
    if ssl_flag and str(ssl_flag).lower() in ("1", "true", "yes"):
        engine_options["connect_args"] = {"ssl": {}}
    if url.get_backend_name() != "sqlite":
        engine_options.update({
            # Prefer the most recently used connection. This matters for a
            # remote TLS database because opening a fresh connection is far
            # more expensive than reusing a warm one.
            "pool_use_lifo": True,
            "pool_recycle": 1800,
            "pool_size": 5,
            "max_overflow": 5,
            "pool_timeout": 10,
        })
    return url.set(query=query).render_as_string(hide_password=False), engine_options


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "change-me")
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "change-me-too")
    SQLALCHEMY_DATABASE_URI, SQLALCHEMY_ENGINE_OPTIONS = _database_config()
    SQLALCHEMY_TRACK_MODIFICATIONS = False
