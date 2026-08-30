"""
Varithon backend — keyword-based intent router + Ollama LLM fallback.
No external model downloads required (NER dropped due to unreliable network).

PUBLIC EXPOSURE NOTE:
  This backend is temporarily exposed via Tailscale Funnel for hackathon
  judging. Rate limiting (10 req/min per IP on /query) is active.
  To revert: sudo tailscale funnel --https=443 off
"""
import logging
import os

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import requests

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(message)s",
    datefmt="%H:%M:%S",
)

# ---- Rate limiter ----
limiter = Limiter(key_func=get_remote_address)

app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ---- CORS ----
# During the Funnel window: allow the GitHub Pages origin and localhost for dev.
# Change this back to allow_origins=["*"] after reverting, or tighten further.
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)

# ---- Ollama config (desktop, internal Tailscale — NOT exposed publicly) ----
OLLAMA_URL = "http://100.102.220.16:11434/api/generate"
OLLAMA_MODEL = "vari-assistant"

# ---- Keyword router ----
EMERGENCY_KEYWORDS = ["आपत्कालीन", "मदत", "अपघात", "इजा", "वाचवा"]
HOSPITAL_KEYWORDS = ["रुग्णालय", "दवाखाना", "इस्पितळ", "डॉक्टर", "उपचार"]
VARI_FACT_KEYWORDS = ["वारी", "सुरू", "पालखी", "मार्ग", "थांबा", "तारीख", "कधी"]


def route_query(text: str) -> str:
    if any(kw in text for kw in EMERGENCY_KEYWORDS):
        return "emergency"
    if any(kw in text for kw in HOSPITAL_KEYWORDS):
        return "hospital"
    if any(kw in text for kw in VARI_FACT_KEYWORDS):
        return "vari_facts"
    return "llm"


class QueryIn(BaseModel):
    text: str


@app.post("/query")
@limiter.limit("10/minute")  # Modest abuse protection during public Funnel window
def handle_query(request: Request, payload: QueryIn):
    category = route_query(payload.text)

    if category in ("emergency", "hospital", "vari_facts"):
        # Frontend already has the static data (emergencyContacts.js,
        # locationDirectory.js, palkhiRoutes.js) — just tell it which
        # component/category to show. No LLM call, fully deterministic.
        return {
            "category": category,
            "source": "static",
            "message": "Routing to static data — see category field.",
        }

    # Genuinely open-ended question — ask the LLM
    ollama_payload = {"model": OLLAMA_MODEL, "prompt": payload.text, "stream": False}
    logging.info("→ Ollama request  | model=%s | prompt=%r", OLLAMA_MODEL, payload.text[:120])

    try:
        resp = requests.post(
            OLLAMA_URL,
            json=ollama_payload,
            timeout=30,
        )
        resp.raise_for_status()
        raw = resp.json()
        answer = raw.get("response", "")
        logging.info(
            "← Ollama response | model=%s | eval_count=%s | response=%r",
            raw.get("model", "?"),      # Ollama echoes back the actual model name used
            raw.get("eval_count", "?"), # token count — useful sanity check
            answer[:120],
        )
    except requests.RequestException as e:
        logging.error("✗ Ollama call FAILED: %s", e)
        return {
            "category": "llm",
            "source": "error",
            "message": f"Could not reach LLM backend: {e}",
        }

    return {"category": "llm", "source": "ollama", "message": answer}


@app.get("/health")
def health():
    return {"status": "ok"}
