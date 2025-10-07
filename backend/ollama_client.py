import httpx
from .config import settings

PROMPT_PREFIX = (
    "Eres un agente de IA que se encargara de formalizar los reportes para los usuarios que residen en Las Palmas, "
    "los residentes son Billy sherrit, Fabrizio Gamboa, Fabricio Martinez. "
    "De esta forma los reportes en el frontend son formales.\n\n"
)

async def formalize(text: str) -> str:
    if settings.SKIP_OLLAMA:
        return text
    
    url = str(settings.OLLAMA_BASE_URL).rstrip("/") + "/api/generate"
    payload = {
        "model": settings.OLLAMA_MODEL,
        "prompt": PROMPT_PREFIX + text,
        "stream": False
    }

    async with httpx.AsyncClient(timeout=60) as client:
        r = await client.post(url, json=payload)
        r.raise_for_status()
        data = r.json()
        return data.get("response", text)
