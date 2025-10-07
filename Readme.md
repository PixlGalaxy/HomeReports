# 🏠 House Reports

A full-stack web application that allows residents to submit and review house incident reports in real time.  
Each report includes text and optional images, which are formalized by an **Ollama AI model** hosted externally.

The app runs in a single Docker container using **FastAPI + Nginx + React**.

---

## 🚀 How It Works

- **Frontend (React + Tailwind)** — Users submit and view reports.
- **Backend (FastAPI)** — Handles uploads, saves data to YAML, and connects to the Ollama API to formalize text.
- **Nginx** — Serves the compiled React app and proxies requests to the backend.
- **Ollama (external container)** — Processes text and returns the formal version.