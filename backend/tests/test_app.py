import asyncio
import importlib
import json
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import AsyncMock
import pytest
from fastapi.testclient import TestClient
from google.genai.errors import APIError

module = importlib.import_module('backend.app')
fixture = json.loads((Path(__file__).parent / 'fixtures/response.json').read_text())
payload = {'kazanim': fixture['etkinlikler'][0]['hedef_kazanim'], 'yas_seviye': '9 yaş',
           'malzemeler': ['1 kâğıt', '1 kalem', '8 aynı boy taş'], 'sure_dakika': 10,
           'erisim_kosullari': 'İnternet yok, ekran yok, yazıcı yok.', 'prompt_version': 'v2'}

@pytest.fixture
def client(monkeypatch):
    monkeypatch.delenv('GEMINI_API_KEY', raising=False)
    module.app.dependency_overrides.clear()
    with TestClient(module.app) as connection:
        yield connection
    module.app.dependency_overrides.clear()

def fake_provider(data=None, error=None):
    generate = AsyncMock(return_value=SimpleNamespace(parsed=data), side_effect=error)
    fake = SimpleNamespace(aio=SimpleNamespace(models=SimpleNamespace(generate_content=generate)))
    module.app.dependency_overrides[module.get_model_client] = lambda: fake
    return generate

def test_health_without_key_and_explicit_generation_error(client):
    assert client.get('/health').json()['model_configured'] is False
    result = client.post('/api/esdeger-ders/generate', json=payload)
    assert result.status_code == 503
    assert result.json()['error']['code'] == 'MODEL_NOT_CONFIGURED'

def test_success_matches_frontend_contract_and_sends_new_materials(client):
    generate = fake_provider(fixture)
    request = {**payload, 'malzemeler': ['1 kâğıt', '1 kalem']}
    result = client.post('/api/esdeger-ders/generate', json=request)
    assert result.status_code == 200
    assert len(result.json()['etkinlikler']) == 3
    assert result.json()['prompt_version_used'] == 'v2'
    args = generate.call_args.kwargs
    assert '8 aynı boy taş' not in args['contents']
    assert 'HER BİR ALTERNATİF ETKİNLİK' in args['contents']
    assert 'reading, hands_on, oral' in args['config'].system_instruction

@pytest.mark.parametrize('change', ['duplicate_method', 'duration', 'objective', 'missing_answer'])
def test_invalid_model_output_is_rejected(client, change):
    data = json.loads(json.dumps(fixture))
    if change == 'duplicate_method': data['etkinlikler'][1]['yontem'] = 'reading'
    if change == 'duration': data['etkinlikler'][0]['tahmini_sure_dakika'] = 11
    if change == 'objective': data['etkinlikler'][0]['hedef_kazanim'] = 'Başka kazanım'
    if change == 'missing_answer': data['degerlendirme']['dogru_cevap'] = ''
    fake_provider(data)
    result = client.post('/api/esdeger-ders/generate', json=payload)
    assert result.status_code == 502
    assert result.json()['error']['code'] == 'MODEL_OUTPUT_INVALID'

@pytest.mark.parametrize('change', [{'sure_dakika': 0}, {'kazanim': ' '}, {'prompt_version': 'v9'}, {'sure_dakika': 1.2}])
def test_invalid_requests_are_rejected_without_model_call(client, change):
    generate = fake_provider(fixture)
    result = client.post('/api/esdeger-ders/generate', json={**payload, **change})
    assert result.status_code == 422
    assert result.json()['error']['code'] == 'VALIDATION_ERROR'
    generate.assert_not_called()

@pytest.mark.parametrize('error,code,status', [(asyncio.TimeoutError(), 'MODEL_TIMEOUT', 504),
    (APIError(429, {'message': 'SECRET_PROVIDER_DETAILS'}), 'MODEL_RATE_LIMITED', 429),
    (APIError(403, {'message': 'SECRET_PROVIDER_DETAILS'}), 'MODEL_AUTH_ERROR', 503),
    (RuntimeError('SECRET_PROVIDER_DETAILS'), 'MODEL_UNAVAILABLE', 503)])
def test_provider_errors_are_safe_and_distinct(client, error, code, status):
    fake_provider(error=error)
    result = client.post('/api/esdeger-ders/generate', json=payload)
    assert result.status_code == status
    assert result.json()['error']['code'] == code
    assert 'SECRET_PROVIDER_DETAILS' not in result.text

def test_cors_only_permits_configured_frontend(client):
    headers = {'Origin': 'http://127.0.0.1:5173', 'Access-Control-Request-Method': 'POST', 'Access-Control-Request-Headers': 'content-type'}
    response = client.options('/api/esdeger-ders/generate', headers=headers)
    assert response.headers['access-control-allow-origin'] == headers['Origin']
    other = client.options('/api/esdeger-ders/generate', headers={**headers, 'Origin':'https://unknown.invalid'})
    assert 'access-control-allow-origin' not in other.headers

def test_baseline_prompt_remains_available(client):
    generate = fake_provider(fixture)
    result = client.post('/api/esdeger-ders/generate', json={**payload,'prompt_version':'v1'})
    assert result.status_code == 200
    assert result.json()['prompt_version_used'] == 'v1'
    assert 'Sen bir öğretmen asistanısın' in generate.call_args.kwargs['config'].system_instruction
