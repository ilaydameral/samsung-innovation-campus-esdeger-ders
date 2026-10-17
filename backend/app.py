import asyncio
import os
from pathlib import Path
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from google import genai
from google.genai import types
from google.genai.errors import APIError
from pydantic import ValidationError
from .schemas import EsdegerDersRequest, EsdegerDersResponse
from .prompts import V1_BASELINE_SYSTEM, V1_USER_PROMPT, V2_SYSTEM_INSTRUCTION, V2_PROMPT_TEMPLATE, OUTPUT_CONTRACT

load_dotenv(Path(__file__).resolve().parent.parent / '.env')
MODEL_NAME = os.getenv('GEMINI_MODEL', 'gemini-3.8-flash')
MODEL_TIMEOUT_SECONDS = 45

@asynccontextmanager
async def lifespan(app: FastAPI):
    key = os.getenv('GEMINI_API_KEY', '').strip()
    app.state.client = genai.Client(api_key=key, http_options=types.HttpOptions(timeout=45000)) if key else None
    try:
        yield
    finally:
        if app.state.client is not None:
            await app.state.client.aio.aclose()
            app.state.client.close()

app = FastAPI(title='EşdeğerDers Backend API', version='1.1.0', lifespan=lifespan)
origins = os.getenv('CORS_ORIGINS', 'http://127.0.0.1:5173,http://localhost:5173').split(',')
app.add_middleware(CORSMiddleware, allow_origins=[item.strip() for item in origins if item.strip()],
                   allow_credentials=False, allow_methods=['GET', 'POST'], allow_headers=['Content-Type'])

def problem(status: int, code: str):
    return HTTPException(status_code=status, detail={'code': code})

@app.exception_handler(HTTPException)
async def http_error(request: Request, exc: HTTPException):
    code = exc.detail.get('code', 'HTTP_ERROR') if isinstance(exc.detail, dict) else 'HTTP_ERROR'
    return JSONResponse(status_code=exc.status_code, content={'error': {'code': code, 'field_errors': []}})

@app.exception_handler(RequestValidationError)
async def validation_error(request: Request, exc: RequestValidationError):
    names = {'kazanim': 'learning_objective', 'yas_seviye': 'student_age', 'malzemeler': 'available_materials', 'sure_dakika': 'duration_minutes_per_activity'}
    fields = [{'field': names[error['loc'][1]], 'message': 'Bu alanı geçerli bir değerle doldurun.'}
              for error in exc.errors() if len(error['loc']) > 1 and error['loc'][1] in names]
    return JSONResponse(status_code=422, content={'error': {'code': 'VALIDATION_ERROR', 'field_errors': fields}})

@app.get('/health')
async def health_check(request: Request):
    return {'status': 'ok', 'model': MODEL_NAME, 'model_configured': request.app.state.client is not None}

def get_model_client(request: Request):
    client = request.app.state.client
    if client is None:
        raise problem(503, 'MODEL_NOT_CONFIGURED')
    return client

@app.post('/api/esdeger-ders/generate', response_model=EsdegerDersResponse)
async def generate_activities(req: EsdegerDersRequest, client=Depends(get_model_client)):
    system = V1_BASELINE_SYSTEM if req.prompt_version == 'v1' else V2_SYSTEM_INSTRUCTION
    template = V1_USER_PROMPT if req.prompt_version == 'v1' else V2_PROMPT_TEMPLATE
    content = template.format(kazanim=req.kazanim, yas_seviye=req.yas_seviye,
                              malzemeler=', '.join(req.malzemeler) or 'Malzeme yok',
                              sure_dakika=req.sure_dakika, erisim_kosullari=req.erisim_kosullari)
    try:
        response = await asyncio.wait_for(client.aio.models.generate_content(
            model=MODEL_NAME, contents=content,
            config=types.GenerateContentConfig(temperature=0.4, system_instruction=system + OUTPUT_CONTRACT,
                response_mime_type='application/json', response_schema=EsdegerDersResponse)),
            timeout=MODEL_TIMEOUT_SECONDS)
        if response.parsed is None:
            raise problem(502, 'MODEL_OUTPUT_INVALID')
        raw = response.parsed.model_dump() if hasattr(response.parsed, 'model_dump') else response.parsed
        result = EsdegerDersResponse.model_validate(raw)
        if any(activity.hedef_kazanim != req.kazanim or activity.tahmini_sure_dakika > req.sure_dakika for activity in result.etkinlikler):
            raise problem(502, 'MODEL_OUTPUT_INVALID')
        result.prompt_version_used = req.prompt_version
        return result
    except HTTPException:
        raise
    except (asyncio.TimeoutError, TimeoutError):
        raise problem(504, 'MODEL_TIMEOUT')
    except ValidationError:
        raise problem(502, 'MODEL_OUTPUT_INVALID')
    except APIError as error:
        code = getattr(error, 'code', None)
        if code in (401, 403): raise problem(503, 'MODEL_AUTH_ERROR')
        if code == 429: raise problem(429, 'MODEL_RATE_LIMITED')
        raise problem(503, 'MODEL_UNAVAILABLE')
    except Exception:
        # Do not send raw provider errors, keys or tracebacks to the browser.
        raise problem(503, 'MODEL_UNAVAILABLE')
