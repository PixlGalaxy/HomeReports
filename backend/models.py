from pydantic import BaseModel, Field
from typing import List
from datetime import datetime

RESIDENTS = [
    "Fabrizio Gamboa",
    "Billy Sherrit",
    "Fabricio Martinez"
]

class ReportIn(BaseModel):
    reporter: str = Field(..., description="Who filed the report")
    subject: str = Field(..., min_length=3)
    details: str = Field(..., min_length=10)

class Report(BaseModel):
    id: str
    reporter: str
    subject: str
    details_raw: str
    details_formal: str
    images: List[str] = []
    created_at: datetime
