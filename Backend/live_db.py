# live_db.py
import os

import asyncpg

_pool = None


async def get_pool():
    global _pool
    if _pool is None:
        _pool = await asyncpg.create_pool(
            dsn=os.environ["SUPABASE_DB_URL"],
            min_size=1,
            max_size=3,
            statement_cache_size=0,  # required when connecting through Supabase's pooler
        )
    return _pool
