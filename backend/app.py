from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.websockets import WebSocket, WebSocketDisconnect
from uuid import uuid4
from datetime import datetime
import os
from typing import List

from .config import settings
from .models import Report, RESIDENTS
from .storage import list_reports, add_report, get_report
from .ollama_client import formalize

app = FastAPI(title="House Reports API")

# --- CORS ---
origins = [o.strip() for o in settings.ALLOWED_ORIGINS.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ConnectionManager:
    def __init__(self):
        self.active: List[WebSocket] = []

    async def connect(self, ws: WebSocket):
        await ws.accept()
        self.active.append(ws)

    def disconnect(self, ws: WebSocket):
        if ws in self.active:
            self.active.remove(ws)

    async def broadcast(self, message: dict):
        for ws in list(self.active):
            try:
                await ws.send_json(message)
            except Exception:
                self.disconnect(ws)

manager = ConnectionManager()

# --- Routes ---
@app.get("/api/residents")
async def residents():
    return {"residents": RESIDENTS}

@app.get("/api/reports")
async def api_list_reports():
    return {"reports": [r.model_dump() for r in list_reports()]}

@app.get("/api/reports/{report_id}")
async def api_get_report(report_id: str):
    r = get_report(report_id)
    if not r:
        raise HTTPException(404, "Report not found")
    return r.model_dump()

@app.post("/api/reports")
async def create_report(
    reporter: str = Form(...),
    subject: str = Form(...),
    details: str = Form(...),
    images: List[UploadFile] | None = None
):
    if reporter not in RESIDENTS:
        raise HTTPException(400, "Unknown resident")

    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    img_paths = []

    for file in images or []:
        ext = os.path.splitext(file.filename or "")[1]
        fname = f"{uuid4().hex}{ext}"
        dest = os.path.join(settings.UPLOAD_DIR, fname)
        with open(dest, "wb") as out:
            out.write(await file.read())
        img_paths.append(f"/api/uploads/{fname}")

    formal = await formalize(details)

    report = Report(
        id=uuid4().hex,
        reporter=reporter,
        subject=subject,
        details_raw=details,
        details_formal=formal.strip(),
        images=img_paths,
        created_at=datetime.utcnow()
    )

    add_report(report)
    await manager.broadcast({"type": "new_report", "report": report.model_dump()})
    return {"ok": True, "report": report.model_dump()}

@app.get("/api/uploads/{fname}")
async def serve_upload(fname: str):
    path = os.path.join(settings.UPLOAD_DIR, fname)
    if not os.path.exists(path):
        raise HTTPException(404, "File not found")
    return FileResponse(path)

@app.websocket("/ws")
async def ws_reports(ws: WebSocket):
    await manager.connect(ws)
    try:
        while True:
            await ws.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(ws)
