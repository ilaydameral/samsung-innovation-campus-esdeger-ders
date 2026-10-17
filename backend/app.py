import os
from pathlib import Path
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from google import genai
from google.genai import types
from google.genai.errors import APIError

from .schemas import EsdegerDersRequest, EsdegerDersResponse
from .prompts import (
    V1_BASELINE_SYSTEM,
    V1_USER_PROMPT,
    V2_SYSTEM_INSTRUCTION,
    V2_PROMPT_TEMPLATE
)

# .env yükleme
root_dir = Path(__file__).resolve().parent.parent
load_dotenv(dotenv_path=root_dir / ".env")

API_KEY = os.getenv("GEMINI_API_KEY")
MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-3.8-flash")

if not API_KEY:
    raise RuntimeError("GEMINI_API_KEY bulunamadı!")

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.client = genai.Client(api_key=API_KEY)
    yield

app = FastAPI(
    title="EşdeğerDers Backend API",
    description="Samsung Innovation Campus SDG 4.5 Eğitim Etkinlik Üreticisi",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "ok", "model": MODEL_NAME}

@app.post("/api/esdeger-ders/generate", response_model=EsdegerDersResponse)
async def generate_activities(req: EsdegerDersRequest):
    client: genai.Client = app.state.client
    
    # Sürüm seçimi (v1 baseline vs v2 gelismis prompt)
    if req.prompt_version == "v1":
        sys_instruction = V1_BASELINE_SYSTEM
        user_content = V1_USER_PROMPT.format(
            kazanim=req.kazanim,
            yas_seviye=req.yas_seviye,
            malzemeler=", ".join(req.malzemeler),
            sure_dakika=req.sure_dakika,
            erisim_kosullari=req.erisim_kosullari
        )
    else:
        sys_instruction = V2_SYSTEM_INSTRUCTION
        user_content = V2_PROMPT_TEMPLATE.format(
            kazanim=req.kazanim,
            yas_seviye=req.yas_seviye,
            malzemeler=", ".join(req.malzemeler),
            sure_dakika=req.sure_dakika,
            erisim_kosullari=req.erisim_kosullari
        )

    try:
        # Structured Output ile katı JSON şeması zorlama
        config = types.GenerateContentConfig(
            temperature=0.4,  # Halüsinasyonu ve sapmayı düşürmek için düşük sıcaklık
            system_instruction=sys_instruction,
            response_mime_type="application/json",
            response_schema=EsdegerDersResponse
        )

        response = await client.aio.models.generate_content(
            model=MODEL_NAME,
            contents=user_content,
            config=config
        )
        
        # SDK response.parsed ile şemaya otomatik parse eder
        if response.parsed:
            result: EsdegerDersResponse = response.parsed
            result.prompt_version_used = req.prompt_version or "v2"
            return result
        else:
            raise HTTPException(status_code=500, detail="Modelden beklenen şemada veri üretilemedi.")

    except APIError as e:
        raise HTTPException(status_code=e.code or 500, detail=str(e.message))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"İşleme hatası: {str(e)}")