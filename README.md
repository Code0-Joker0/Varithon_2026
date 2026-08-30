# 🚩 Varithon — वारकरी सेवा पोर्टल

> A voice + text AI assistant for Varkari pilgrims on the Pandharpur Vari (Palkhi pilgrimage).  
> Built for **Varithon 2026** hackathon.

---

## What is this?

Varithon is a **24×7 multilingual assistance portal** for pilgrims undertaking the Pandharpur Vari — one of Maharashtra's largest annual pilgrimages (hundreds of thousands of Varkaris walking from Alandi/Dehu to Pandharpur).

Pilgrims (many of whom are elderly and unfamiliar with smartphones) can:
- Ask questions in **Marathi by voice or text**
- Get instant answers about palkhi routes, halt locations, and dates
- Access emergency contacts (108 ambulance, police) and health centers
- Find first-aid and health guidelines
- Get live weather alerts for the route

---

## Features

| Feature | Description |
|---|---|
| 🎙️ **Voice Input (STT)** | Marathi speech recognition via Web Speech API (`lang="mr-IN"`) |
| 🔊 **Voice Output (TTS)** | Answers spoken aloud — Marathi voice preferred, Hindi fallback |
| 🤖 **AI Assistant** | Open-ended Marathi queries answered by a local LLM (`vari-assistant`) |
| 📋 **Keyword Routing** | Instant static responses for emergency / hospital / vari route queries |
| ☎️ **Emergency Contacts** | 108 ambulance, police helplines, mobile hospitals |
| 🏥 **Location Directory** | Health centers & police stations along the palkhi route |
| 🗓️ **Palkhi Timeline** | Interactive halt-by-halt timeline for Dnyaneshwar & Tukaram palkhi |
| 🌤️ **Weather Alerts** | Heat/storm warnings for each halt on the route |
| 🌐 **Multilingual** | Full-page translation (Marathi / Hindi / English) via Google Translate |
| 🚨 **SOS Siren** | Crowd-distress audio siren with one tap |
| 📱 **QR Code Generator** | Share the portal URL instantly |

---

## Architecture

```
┌─────────────────────────────────────────┐
│         React + Vite Frontend           │
│  (src/components, src/hooks, src/data)  │
└────────────────┬────────────────────────┘
                 │ POST /query {"text": "..."}
                 ▼
┌─────────────────────────────────────────┐
│         FastAPI Backend                 │
│       varithon-backend/main.py          │
│                                         │
│  1. Keyword Router (pure Python)        │
│     → emergency / hospital / vari_facts │
│       → return {category, source:static}│
│                                         │
│  2. LLM Fallback (open-ended queries)   │
│     → POST to Ollama endpoint           │
│       → return {category:llm, message}  │
└────────────────┬────────────────────────┘
                 │ POST /api/generate
                 ▼
┌─────────────────────────────────────────┐
│    Ollama (remote, over Tailscale VPN)  │
│    Model: vari-assistant                │
│    (Marathi-system-prompted Gemma2:9b)  │
│    http://100.102.220.16:11434          │
└─────────────────────────────────────────┘
```

### Response contract

```json
// Static category (no LLM call):
{ "category": "emergency" | "hospital" | "vari_facts", "source": "static", "message": "..." }

// LLM answer:
{ "category": "llm", "source": "ollama", "message": "<marathi answer text>" }

// Error:
{ "category": "error", "source": "network" | "error", "message": "<error description>" }
```

---

## Tech Stack

### Frontend
| | |
|---|---|
| Framework | React 19 + Vite 8 |
| Styling | Tailwind CSS v4 |
| Icons | lucide-react |
| Voice I/O | Web Speech API (SpeechRecognition + SpeechSynthesis) |
| Translation | Google Translate Widget |
| HTTP | Native `fetch` (no axios) |

### Backend
| | |
|---|---|
| Framework | FastAPI |
| Server | Uvicorn |
| Python | 3.11 (managed via `uv`) |
| HTTP client | `requests` |
| LLM | Ollama — `vari-assistant` (Gemma2:9b, Marathi system prompt) |

---

## Project Structure

```
Varithon_2026/
├── index.html                      # Entry point — Google Translate widget injected here
├── src/
│   ├── App.jsx                     # Root — tab-based navigation, all views
│   ├── components/
│   │   ├── AssistantPanel.jsx      # AI query input + STT mic + TTS output + result router
│   │   ├── EmergencyContacts.jsx   # Emergency contacts directory
│   │   ├── LocationDirectory.jsx   # Health centers & police stations
│   │   ├── PalkhiTimeline.jsx      # Halt-by-halt palkhi route timeline
│   │   ├── HealthGuidelines.jsx    # First aid & dietary tips
│   │   ├── WeatherAlerts.jsx       # Route weather warnings
│   │   ├── Navbar.jsx              # Sticky header + Google Translate
│   │   ├── Footer.jsx              # Footer with quick links
│   │   ├── SirenModal.jsx          # SOS crowd-distress siren
│   │   └── QRGeneratorModal.jsx    # QR code share modal
│   ├── hooks/
│   │   └── useVarithonQuery.js     # Custom hook: POST /query, loading/result state
│   └── data/
│       ├── emergencyContacts.js    # Static emergency contacts data
│       ├── locationDirectory.js    # Health centers & police station data
│       ├── palkhiRoutes.js         # Palkhi halt data (km, dates, weather, warnings)
│       └── healthGuide.js          # First aid & nutrition guide data
└── varithon-backend/
    ├── main.py                     # FastAPI app — router + Ollama integration
    └── .venv/                      # Python 3.11 venv (managed by uv)
```

---

## Getting Started

### Prerequisites
- Node.js + npm (for the frontend)
- Python 3.11 + [`uv`](https://github.com/astral-sh/uv) (for the backend)
- Ollama running with the `vari-assistant` model (remote or local)
- Internet connection (for Google Translate & Google Fonts)

---

### 1. Frontend

```bash
cd ~/Coding/Varithon_2026

# Install dependencies (first time only)
npm install

# Start dev server
npm run dev
```

Opens at **http://localhost:5173**

---

### 2. Backend

```bash
cd ~/Coding/Varithon_2026/varithon-backend

# Create venv (first time only)
uv venv --python 3.11 .venv
source .venv/bin/activate
uv pip install fastapi uvicorn requests pydantic

# Run the server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Runs at **http://localhost:8000**

---

### 3. Ollama (LLM)

The `vari-assistant` model must be available on your Ollama instance.  
The backend points to: `http://100.102.220.16:11434/api/generate` (Tailscale VPN address).

To use a different Ollama host, update these two constants in [`varithon-backend/main.py`](varithon-backend/main.py):

```python
OLLAMA_URL   = "http://<your-host>:11434/api/generate"
OLLAMA_MODEL = "vari-assistant"
```

---

## API Reference

### `POST /query`

```bash
curl -X POST http://localhost:8000/query \
  -H "Content-Type: application/json" \
  -d '{"text": "जवळचा दवाखाना कुठे आहे?"}'
```

**Request body:**
```json
{ "text": "<marathi query string>" }
```

**Response examples:**

```json
// Keyword match → static
{ "category": "hospital", "source": "static", "message": "Routing to static data — see category field." }

// Open-ended → LLM
{ "category": "llm", "source": "ollama", "message": "विठ्ठल दर्शनासाठी..." }

// LLM unreachable
{ "category": "llm", "source": "error", "message": "Could not reach LLM backend: ..." }
```

### `GET /health`

```bash
curl http://localhost:8000/health
# → {"status": "ok"}
```

---

## Keyword Router

The backend routes queries **instantly without any LLM call** when Marathi keywords match:

| Category | Keywords |
|---|---|
| `emergency` | आपत्कालीन, मदत, अपघात, इजा, वाचवा |
| `hospital` | रुग्णालय, दवाखाना, इस्पितळ, डॉक्टर, उपचार |
| `vari_facts` | वारी, सुरू, पालखी, मार्ग, थांबा, तारीख, कधी |

All other queries fall through to the Ollama LLM.

---

## Voice Features

### Speech-to-Text (Input)
- Uses `window.SpeechRecognition` / `window.webkitSpeechRecognition`
- Language: `mr-IN` (Marathi)
- Transcribed text is populated into the input field — user confirms before submitting
- Gracefully hidden if the browser doesn't support the API
- Inline message shown if microphone permission is denied (no blocking `alert()`)

### Text-to-Speech (Output)
- Uses `window.speechSynthesis`
- Voice selection: prefers `mr-*` → falls back to `hi-*` → any available voice
- **Auto-speaks** LLM answers when received
- **Manual replay** button on LLM results
- **Stop button** to silence mid-playback
- Short fixed Marathi phrase spoken for static categories (not full component content)

> **Note for Linux users:** Chrome on Linux requires `speech-dispatcher` + `espeak-ng` for TTS.  
> Install with: `sudo pacman -S speech-dispatcher espeak-ng` then restart Chrome.

---

## Environment Notes

- Developed on **Arch Linux** with **Hyprland** (Wayland), **Google Chrome**
- Backend Python environment managed with [`uv`](https://github.com/astral-sh/uv)
- No ML models downloaded locally — all LLM inference is remote via Ollama over Tailscale VPN
- No `transformers`, `sentence-transformers`, or HuggingFace packages used

---

## Deployment

### Live site

The frontend is deployed to **GitHub Pages** and automatically rebuilt on every push to `main` via the [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) workflow:

```
https://code0-joker0.github.io/Varithon_2026/
```

### What works on the live site

| Feature | Works on GitHub Pages? |
|---|---|
| Emergency contacts | ✅ Fully static |
| Location directory | ✅ Fully static |
| Palkhi timeline | ✅ Fully static |
| Health guidelines | ✅ Fully static |
| Weather alerts | ✅ Fully static |
| SOS siren | ✅ Fully static |
| QR code generator | ✅ Fully static |
| Google Translate | ✅ Client-side (requires internet) |
| **AI assistant** | ⚠️ Requires backend (see below) |

### Why the AI assistant doesn't work for everyone

GitHub Pages can only serve **static files** — it cannot run a Python server. The AI assistant requires the FastAPI backend (`varithon-backend/main.py`) to be running, which in turn calls an Ollama LLM instance hosted on a private desktop machine reachable only via a **Tailscale VPN** (`http://100.102.220.16:11434`).

This means:
- The AI assistant **works** for devices that are (a) connected to the same Tailscale network as the backend desktop, and (b) have the backend running (`uvicorn main:app --host 0.0.0.0 --port 8000`)
- For all other visitors (e.g. hackathon judges not on the Tailscale network), the panel shows a clear **"AI सहाय्यक सध्या उपलब्ध नाही"** notice and the rest of the site functions normally

This was a **deliberate decision**: the Ollama instance runs locally for cost, privacy, and latency reasons. Making it publicly reachable would require a separate hardening step (authentication, rate limiting, HTTPS reverse proxy) that is out of scope for this hackathon.

> **Future work**: To make the AI assistant publicly accessible, the backend would need to be deployed to a public server (e.g. a VPS or cloud function) behind HTTPS, with the Ollama model either hosted there or proxied securely. Update `VITE_BACKEND_URL` in a GitHub Actions secret to point the deployed frontend at it.

### Configuring the backend URL

The frontend reads `VITE_BACKEND_URL` from environment at build time:

```bash
# .env.local (not committed — gitignored)
VITE_BACKEND_URL=http://100.102.220.16:8000   # your Tailscale backend address
```

See [`.env.example`](.env.example) for the full template.

---

## Hackathon Context

Built for **Varithon 2026** — a hackathon focused on building tech solutions for Varkari pilgrims.  
Time-constrained build: prioritized **working over complete**, **reliability over ML complexity**.

Key design decisions:
- **Keyword router over NER/ML** — zero network calls for classification, works offline
- **Static data in frontend** — emergency contacts, locations, routes load instantly
- **LLM only for open-ended queries** — reduces latency for the most common use cases
- **Large fonts & Marathi-first UI** — designed for elderly pilgrims on mobile

---

*॥ जाता पंढरीसी सुख वाटे जीवा ॥*
