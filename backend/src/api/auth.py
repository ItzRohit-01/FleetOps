from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from src.supabase_client import db

router = APIRouter(prefix="/auth", tags=["Authentication"])


class LoginRequest(BaseModel):
    # Primary form: { username_or_email, password }
    username_or_email: Optional[str] = None
    # Alt form: { identifier, password } (used by existing frontend api.ts)
    identifier: Optional[str] = None
    password: str


# Documented demo credentials — never bypass auth, just map known demo identifiers
DEMO_PASSWORDS = {
    "manager": "demo1234",
    "dispatcher": "demo1234",
    "safety": "demo1234",
    "analyst": "demo1234",
    "manager@fleetops.ai": "demo1234",
    "dispatcher@fleetops.ai": "demo1234",
    "safety@fleetops.ai": "demo1234",
    "analyst@fleetops.ai": "demo1234",
}


def _resolve_and_authenticate(identifier: str, password: str) -> dict:
    """Core auth logic: validate password then resolve profile from DB."""
    identifier = identifier.strip().lower()

    # Validate against documented demo credentials
    expected_password = DEMO_PASSWORDS.get(identifier, "demo1234")
    if password != expected_password:
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password. Demo password is 'demo1234'."
        )

    # Resolve profile from Supabase Postgres database
    try:
        if "@" in identifier:
            res = db.table("profiles").select("*").eq("email", identifier).execute()
        else:
            res = db.table("profiles").select("*").eq("username", identifier).execute()

        profiles = res.data
        if not profiles:
            # Fallback: try matching by role name (e.g., "manager" -> role='manager')
            res = db.table("profiles").select("*").eq("role", identifier).execute()
            profiles = res.data

        if not profiles:
            raise HTTPException(
                status_code=404,
                detail=f"No account found for '{identifier}'. Ensure the demo seed has been applied."
            )

        return profiles[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database authentication error: {str(e)}")


def _build_response(p: dict) -> dict:
    """Build a unified login response matching the frontend api.ts expectations."""
    token = f"fleetops-session-{p['id']}-{p['role']}"
    return {
        # Fields expected by frontend api.ts login()
        "access_token": token,
        "token_type": "bearer",
        "role": p["role"],
        "name": p["display_name"],
        "organization": "FleetOps India Pvt. Ltd.",
        # Full user object
        "user": {
            "id": str(p["id"]),
            "username": p["username"],
            "display_name": p["display_name"],
            "email": p["email"],
            "role": p["role"],
            "account_status": p.get("account_status", "active"),
        },
        "message": "Authenticated successfully"
    }


@router.post("/login")
def login(req: LoginRequest):
    """
    Login endpoint. Accepts:
      - { username_or_email, password }  — primary form
      - { identifier, password }         — alternate form used by frontend api.ts
    """
    ident = req.username_or_email or req.identifier
    if not ident:
        raise HTTPException(status_code=400, detail="username_or_email or identifier is required")
    p = _resolve_and_authenticate(ident, req.password)
    return _build_response(p)


@router.get("/demo-accounts")
def get_demo_accounts():
    """Returns available demo accounts for instant workspace evaluation."""
    try:
        res = db.table("profiles").select("id, username, display_name, email, role").execute()
        accounts = [
            {
                "username": p["username"],
                "email": p["email"],
                "role": p["role"],
                "display_name": p["display_name"],
                "password": "demo1234",
            }
            for p in (res.data or [])
        ]
        return {"accounts": accounts, "demo_accounts": accounts}
    except Exception as e:
        return {"error": str(e), "accounts": [], "demo_accounts": []}
