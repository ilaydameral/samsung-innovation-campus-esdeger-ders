import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { requestBackend, ENDPOINT } from '../src/lib/backendClient.ts'
import { GenerationError } from '../src/lib/errors.ts'
import type { ActivityRequest } from '../src/types.ts'

const input = JSON.parse(readFileSync(new URL('../src/data/request.example.json', import.meta.url),'utf8')) as ActivityRequest
const fixture = () => JSON.parse(readFileSync(new URL('../../backend/tests/fixtures/response.json', import.meta.url),'utf8'))
const signal = () => new AbortController().signal
const reply = (value: unknown, status = 200) => (async () => new Response(JSON.stringify(value),{status,headers:{'Content-Type':'application/json'}})) as typeof fetch
const failsWith = (code: string) => (error: unknown) => error instanceof GenerationError && error.code === code

test('live client posts reduced conditions to the agreed endpoint and maps the full response',async () => {
  const reduced = {...input,available_materials:['1 kâğıt','1 kalem']}
  let sent: Record<string,unknown> = {}
  const transport = (async (url,init) => {
    assert.equal(url, 'http://test.invalid'+ENDPOINT)
    assert.equal(init?.method,'POST')
    assert.equal(new Headers(init?.headers).get('Content-Type'),'application/json')
    assert.equal(new Headers(init?.headers).has('Authorization'),false)
    sent = JSON.parse(String(init?.body))
    return new Response(JSON.stringify(fixture()),{status:200})
  }) as typeof fetch
  const result = await requestBackend(reduced,'http://test.invalid',signal(),transport)
  assert.deepEqual(sent.malzemeler,['1 kâğıt','1 kalem'])
  assert.equal(sent.sure_dakika,10)
  assert.equal(result.activities.length,3)
  assert.ok(result.common_assessment.expected_answer.length)
})
test('network failure cannot silently return a sample success',async () => {
  const transport = (async () => { throw new TypeError('SECRET_NETWORK_DETAILS') }) as typeof fetch
  await assert.rejects(requestBackend(input,'http://test.invalid',signal(),transport), error => {
    assert.ok(failsWith('NETWORK_ERROR')(error))
    assert.equal((error as Error).message.includes('SECRET'),false)
    return true
  })
})
test('non JSON and schema-invalid successes are distinct failures',async () => {
  const html = (async () => new Response('<html>Server error</html>',{status:502})) as typeof fetch
  await assert.rejects(requestBackend(input,'http://test.invalid',signal(),html),failsWith('INVALID_JSON'))
  await assert.rejects(requestBackend(input,'http://test.invalid',signal(),reply({})),failsWith('MODEL_OUTPUT_INVALID'))
})
test('validation errors preserve only well formed field entries',async () => {
  const response={error:{code:'VALIDATION_ERROR',field_errors:[{field:'student_age',message:'Geçerli yaş girin.'},{field:9,message:null}]}}
  await assert.rejects(requestBackend(input,'http://test.invalid',signal(),reply(response,422)),error => {
    assert.ok(error instanceof GenerationError)
    assert.deepEqual(error.fields,[{field:'student_age',message:'Geçerli yaş girin.'}])
    return true
  })
})
test('quota, missing key, timeout and auth errors stay actionable without raw provider details',async () => {
  for(const code of ['MODEL_RATE_LIMITED','MODEL_NOT_CONFIGURED','MODEL_TIMEOUT','MODEL_AUTH_ERROR']) {
    await assert.rejects(requestBackend(input,'http://test.invalid',signal(),reply({error:{code,message:'SECRET_PROVIDER_DETAILS'}},503)),error => {
      assert.ok(failsWith(code)(error))
      assert.equal((error as Error).message.includes('SECRET'),false)
      return true
    })
  }
})
test('unknown server errors use a local generic message',async () => {
  await assert.rejects(requestBackend(input,'http://test.invalid',signal(),reply({detail:'SECRET_STACK'},500)),error => {
    assert.ok(failsWith('HTTP_500')(error))
    assert.equal((error as Error).message.includes('SECRET'),false)
    return true
  })
})
test('already aborted requests do not reach the network',async () => {
  const controller=new AbortController(); controller.abort()
  let calls=0
  const transport=(async () => {calls++;return new Response('{}')}) as typeof fetch
  await assert.rejects(requestBackend(input,'http://test.invalid',controller.signal,transport),{name:'AbortError'})
  assert.equal(calls,0)
})
test('abort during response body reading stays cancellation rather than invalid JSON',async () => {
  const controller=new AbortController()
  const transport=(async () => ({ok:true,json:async () => {controller.abort();throw new DOMException('Canceled','AbortError')}})) as typeof fetch
  await assert.rejects(requestBackend(input,'http://test.invalid',controller.signal,transport),{name:'AbortError'})
})
