import os, yaml
from typing import List, Dict
from .config import settings
from .models import Report

os.makedirs(os.path.dirname(settings.DATA_FILE), exist_ok=True)

if not os.path.exists(settings.DATA_FILE):
    with open(settings.DATA_FILE, "w", encoding="utf-8") as f:
        yaml.safe_dump({"reports": []}, f)

def _read_all() -> Dict:
    with open(settings.DATA_FILE, "r", encoding="utf-8") as f:
        return yaml.safe_load(f) or {"reports": []}

def _write_all(obj: Dict) -> None:
    with open(settings.DATA_FILE, "w", encoding="utf-8") as f:
        yaml.safe_dump(obj, f, allow_unicode=True, sort_keys=False)

def list_reports() -> List[Report]:
    data = _read_all()
    return [Report(**r) for r in data.get("reports", [])]

def get_report(report_id: str) -> Report | None:
    for r in list_reports():
        if r.id == report_id:
            return r
    return None

def add_report(report: Report) -> None:
    data = _read_all()
    data.setdefault("reports", []).insert(0, report.model_dump())
    _write_all(data)
