# portal_auth.py
import os
from typing import Optional

from fastapi import Depends, Header, HTTPException

from firebase_verify import get_current_user


def is_admin_uid(uid):
    ids = {x.strip() for x in os.environ.get("ADMIN_UIDS", "").split(",") if x.strip()}
    return uid in ids


def require_admin(user=Depends(get_current_user)):
    if not is_admin_uid(user["uid"]):
        raise HTTPException(status_code=403, detail="Admin access only")
    return user


def optional_user(authorization: Optional[str] = Header(None)):
    if not authorization:
        return None
    try:
        return get_current_user(authorization)
    except HTTPException:
        return None
