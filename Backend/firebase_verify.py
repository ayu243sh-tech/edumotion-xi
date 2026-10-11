# firebase_verify.py
# Checks the Firebase login token sent by the frontend, so the server knows who is asking.
import os
from typing import Optional

from fastapi import Header, HTTPException
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token

_request = google_requests.Request()


def get_current_user(authorization: Optional[str] = Header(None)):
    project_id = os.environ.get("FIREBASE_PROJECT_ID", "")
    if not project_id:
        raise HTTPException(status_code=500, detail="Server login check is not configured")
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Please log in first")

    token = authorization.split(" ", 1)[1]
    try:
        claims = id_token.verify_firebase_token(token, _request, audience=project_id)
    except Exception:
        claims = None
    if not claims:
        raise HTTPException(status_code=401, detail="Your login expired. Please log in again.")

    return {"uid": claims.get("user_id") or claims.get("sub"), "email": claims.get("email")}
