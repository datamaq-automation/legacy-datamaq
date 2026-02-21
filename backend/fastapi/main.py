from __future__ import annotations

import os
from datetime import datetime, timezone

from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware


def parse_allowed_origins(raw_value: str | None) -> list[str]:
    if not raw_value:
        return []
    return [origin.strip() for origin in raw_value.split(",") if origin.strip()]


app = FastAPI(title="DataMaq API", version="1.0.0")

allowed_origins = parse_allowed_origins(os.getenv("ALLOWED_ORIGINS"))
if allowed_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_credentials=True,
        allow_methods=["GET", "OPTIONS"],
        allow_headers=["*"],
    )


def build_pricing_payload() -> dict[str, int | str]:
    visita_diagnostico = int(os.getenv("VISITA_DIAGNOSTICO_HASTA_2H_ARS", "275000"))
    updated_at = os.getenv("PRICING_UPDATED_AT", "2026-02-21T00:00:00Z")
    return {
        "visita_diagnostico_hasta_2h_ars": visita_diagnostico,
        "updated_at": updated_at,
    }


@app.get("/v1/public/pricing")
def get_public_pricing(response: Response) -> dict[str, int | str]:
    response.headers["Cache-Control"] = "max-age=60"
    return build_pricing_payload()

@app.get("/v1/health")
def get_health(response: Response) -> dict[str, str]:
    response.headers["Cache-Control"] = "no-store"
    return {
        "status": "ok",
        "service": "datamaq-api",
        "version": "v1",
        "timestamp": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
    }
