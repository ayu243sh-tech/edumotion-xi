# resources_auth_routes.py
import secrets
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from resources_approved import APPROVED_EMAILS

router = APIRouter(prefix="/resources-auth", tags=["resources-auth"])

_valid_sessions = {}  # token -> email

GOOGLE_CLIENT_ID = "301904325729-32r1k1kv1j8smpufnaac6r4t942gl5nn.apps.googleusercontent.com"


class GoogleLoginBody(BaseModel):
    credential: str  # the token Google sends after sign-in


@router.post("/google-login")
async def google_login(body: GoogleLoginBody):
    try:
        idinfo = id_token.verify_oauth2_token(
            body.credential, google_requests.Request(), GOOGLE_CLIENT_ID
        )
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid Google token")

    email = idinfo.get("email", "").lower()
    if email not in APPROVED_EMAILS:
        raise HTTPException(status_code=403, detail="This account is not approved for access")

    token = secrets.token_hex(16)
    _valid_sessions[token] = email
    return {"granted": True, "token": token, "name": idinfo.get("name"), "email": email}


@router.get("/check")
async def check_session(token: str):
    return {"valid": token in _valid_sessions}
