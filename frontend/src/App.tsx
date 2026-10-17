import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowDown, ArrowRight, BookOpen, Check, CheckCheck, ChevronDown, ChevronRight, CircleHelp, Clock3, FlaskConical, GraduationCap, Leaf, LoaderCircle, MessageCircle, Monitor, Plus, Printer, RefreshCw, Settings2, ShieldCheck, Sparkles, Target, TriangleAlert, Wifi, X, Blocks, PlugZap } from 'lucide-react'
import type { Activity, ActivityRequest, ActivityResponse, FieldError, Method, Mode } from './types.ts'
import { API_BASE_URL, ENDPOINT, GenerationError, generateActivities } from './lib/api.ts'
import { validateRequest } from './lib/validation.ts'
import sampleRequest from './data/request.example.json'

const methodInfo: Record<Method, { name: string; eyebrow: string; icon: typeof BookOpen; color: string }> = {
  reading: { name: 'Oku ve keşfet', eyebrow: 'Kısa metin', icon: BookOpen, color: 'sage' },
  hands_on: { name: 'Dokun ve deneyimle', eyebrow: 'Somut malzeme', icon: Blocks, color: 'peach' },
  oral: { name: 'Konuş ve paylaş', eyebrow: 'Sözlü etkileşim', icon: MessageCircle, color: 'lavender' },
}
const initialRequest = (): ActivityRequest => ({
  learning_objective: '', student_age: 9, duration_minutes_per_activity: 10,
  available_materials: [], access: { internet: false, screen: false, printer: false },
})

function JourneyArt() {
  return <div className="journey-art" aria-hidden="true">
    <div className="art-grid" />
    <div className="art-label"><span className="tiny-dot" /> Bir kazanım, üç öğrenme yolu</div>
    <svg viewBox="0 0 400 165" className="paths"><path d="M42 82 C145 82 125 25 228 25H340" /><path d="M42 82H340" /><path d="M42 82C145 82 125 140 228 140H340" /></svg>
    <div className="art-start"><Target size={25} /></div>
    <div className="art-node node-reading"><BookOpen size={23} /><span>Oku</span></div>
    <div className="art-node node-hands"><Blocks size={23} /><span>Dene</span></div>
    <div className="art-node node-oral"><MessageCircle size={23} /><span>Anlat</span></div>
    <span className="art-spark spark-one">✳</span><span className="art-spark spark-two">+</span>
  </div>
}

function ActivityCard({ activity, index }: { activity: Activity; index: number }) {
  const info = methodInfo[activity.method]
  const Icon = info.icon
  return <article className={`activity-card ${info.color}`}>
    <div className="card-top"><span className="method-tag"><Icon size={15} />{info.eyebrow}</span><span className="card-number">0{index + 1}</span></div>
    <h3>{activity.title}</h3>
    <span className="duration"><Clock3 size={14} />Yaklaşık {activity.duration_minutes} dakika</span>
    <div className="material-list"><strong>Gerekenler</strong><p>{activity.materials_used.length ? activity.materials_used.join(' · ') : 'Ek malzeme gerekmiyor'}</p></div>
    <ol className="activity-steps">{activity.steps.map((step, i) => <li key={i}><span>{i + 1}</span><p>{step}</p></li>)}</ol>
    <div className="expected"><Target size={17} /><div><strong>Gözlemleyeceğiniz davranış</strong><p>{activity.expected_student_behavior}</p></div></div>
  </article>
}

export default function App() {
  const [input, setInput] = useState<ActivityRequest>(initialRequest)
  const [mode, setMode] = useState<Mode>('mock')
  const [material, setMaterial] = useState('')
  const [fields, setFields] = useState<FieldError[]>([])
  const [result, setResult] = useState<ActivityResponse | null>(null)
  const [error, setError] = useState<GenerationError | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [settings, setSettings] = useState(false)
  const [help, setHelp] = useState(false)
  const [answerOpen, setAnswerOpen] = useState(false)
  const [edited, setEdited] = useState(false)
  const [canceled, setCanceled] = useState(false)
  const controller = useRef<AbortController | null>(null)
  const requestId = useRef(0)
  const resultsRef = useRef<HTMLElement>(null)
  const goalRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => () => controller.current?.abort(), [])
  useEffect(() => {
    if (!help && !settings) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setHelp(false); setSettings(false) }
      if (event.key === 'Tab') {
        const focusable = document.querySelector('[role="dialog"]')?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled), textarea:not(:disabled)')
        if (!focusable?.length) return
        const first = focusable[0], last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
      }
    }
    window.addEventListener('keydown', close)
    return () => { window.removeEventListener('keydown', close); document.body.style.overflow = previousOverflow }
  }, [help, settings])

  function invalidate() {
    requestId.current += 1
    controller.current?.abort()
    setEdited(result !== null || edited)
    setResult(null); setError(null); setFields([]); setStatus('idle'); setAnswerOpen(false); setCanceled(false)
  }
  function update(next: ActivityRequest) { invalidate(); setInput(next) }
  function chooseMode(next: Mode) { if (next !== mode) { invalidate(); setMode(next) } }
  function loadExample() {
    invalidate(); setInput(structuredClone(sampleRequest)); setMaterial(''); setEdited(false)
    goalRef.current?.focus()
  }
  function addMaterial() {
    const additions = material.split(/[,\n]/).map(x => x.trim()).filter(Boolean)
    if (!additions.length) return
    update({ ...input, available_materials: [...new Set([...input.available_materials, ...additions])] })
    setMaterial('')
  }
  function cancel() {
    requestId.current += 1; controller.current?.abort(); setStatus('idle'); setCanceled(true)
  }
  async function submit(event: FormEvent) {
    event.preventDefault()
    if (material.trim()) {
      setFields([{ field: 'available_materials', message: 'Yazdığınız malzemeyi + düğmesiyle listeye ekleyin veya alanı temizleyin.' }]); return
    }
    const errors = validateRequest(input)
    setFields(errors)
    if (errors.length) {
      const ids: Record<string, string> = { learning_objective: 'objective', student_age: 'age', duration_minutes_per_activity: 'duration', available_materials: 'materials' }
      document.getElementById(ids[errors[0].field] || 'objective')?.focus()
      return
    }
    controller.current?.abort()
    const abort = new AbortController(); controller.current = abort
    const id = ++requestId.current
    setStatus('loading'); setResult(null); setError(null); setEdited(false); setCanceled(false); setAnswerOpen(false)
    let timedOut = false
    const timer = window.setTimeout(() => { timedOut = true; abort.abort() }, 60000)
    try {
      const response = await generateActivities(structuredClone(input), mode, abort.signal)
      if (id !== requestId.current) return
      setResult(response); setStatus('success')
      window.setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60)
    } catch (err) {
      if (id !== requestId.current) return
      if (abort.signal.aborted && !timedOut) { setStatus('idle'); return }
      const failure = timedOut ? new GenerationError('İşlem 60 saniye içinde tamamlanamadı. Yeniden deneyebilirsiniz.', 'TIMEOUT') : err instanceof GenerationError ? err : new GenerationError('Beklenmeyen bir sorun oluştu. Yeniden deneyin.')
      setError(failure); setFields(failure.fields); setStatus('error')
    } finally { window.clearTimeout(timer) }
  }
  const fieldError = (name: string) => fields.find(field => field.field === name)?.message

  return <>
    <a className="skip-link" href="#workshop">Atölyeye geç</a>
    <header className="site-header">
      <a className="brand" href="#" aria-label="EşdeğerDers ana sayfa"><span className="brand-symbol"><span /><span /><span /></span><span>Eşdeğer<span className="brand-light">Ders</span><small>HER SINIF İÇİN BİR YOL</small></span></a>
      <nav aria-label="Ana gezinme"><a className="nav-active" href="#workshop">Etkinlik atölyesi</a><button type="button" onClick={() => setHelp(true)}>Nasıl çalışır?</button></nav>
      <button className={`connection-badge ${mode === 'api' ? 'api-mode' : ''}`} onClick={() => setSettings(true)} type="button"><span className="tiny-dot" />{mode === 'mock' ? 'Örnek veri modu' : 'Canlı API modu'}<Settings2 size={14} /></button>
    </header>

    <main>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-copy"><div className="eyebrow"><span />ÖĞRETMENİN YANINDA, SINIFIN İÇİNDE</div><h1 id="hero-heading">Tek kazanım.<br /><em>Birden çok yol.</em></h1><p>Sınıfınızın olanaklarından yola çıkın. Aynı kazanımı<br className="desktop-break" /> koruyan üç farklı etkinliğe birlikte yer açalım.</p><a href="#workshop" className="hero-link">Kendi sınıfınızdan başlayın <ArrowDown size={16} /></a></div>
        <JourneyArt />
      </section>

      <div className="process-strip" aria-label="Üç adımda etkinlik hazırlama"><span><b>01</b>Sınıfınızı tanımlayın</span><ChevronRight size={15}/><span><b>02</b>Üç farklı yolu keşfedin</span><ChevronRight size={15}/><span><b>03</b>Aynı kazanımı değerlendirin</span><span className="sdg"><Leaf size={16} />Nitelikli eğitim · SDG 4</span></div>

      <div className="workshop" id="workshop">
        <aside className="form-panel" aria-labelledby="form-heading">
          <div className="panel-title"><span className="icon-circle"><Settings2 size={19} /></span><div><h2 id="form-heading">Sınıfınızın koşulları</h2><p>İyi bir etkinlik, sınıfını tanır.</p></div></div>
          <form onSubmit={submit} noValidate>
            <fieldset disabled={status === 'loading'} className="form-fields">
              <label htmlFor="objective">Hedef kazanım <span aria-hidden="true">*</span></label><textarea ref={goalRef} id="objective" placeholder="Örn. Dört eş parçadan üçünü 3/4 olarak temsil eder." rows={3} value={input.learning_objective} onChange={e => update({ ...input, learning_objective: e.target.value })} aria-invalid={!!fieldError('learning_objective')} aria-describedby={fieldError('learning_objective') ? 'objective-error' : 'objective-hint'} />
              {fieldError('learning_objective') ? <p className="field-error" id="objective-error">{fieldError('learning_objective')}</p> : <p className="field-hint" id="objective-hint">Öğrenci etkinlik sonunda ne yapabilsin?</p>}
              <div className="field-pair"><div><label htmlFor="age">Öğrenci yaşı <span aria-hidden="true">*</span></label><div className="input-with-unit"><input id="age" type="number" min="1" step="1" value={Number.isNaN(input.student_age) ? '' : input.student_age} onChange={e => update({ ...input, student_age: e.target.valueAsNumber })} aria-invalid={!!fieldError('student_age')} aria-describedby={fieldError('student_age') ? 'age-error' : undefined} /><span>yaş</span></div>{fieldError('student_age') && <p className="field-error" id="age-error">{fieldError('student_age')}</p>}</div><div><label htmlFor="duration">Etkinlik başına <span aria-hidden="true">*</span></label><div className="input-with-unit"><input id="duration" type="number" min="1" step="1" value={Number.isNaN(input.duration_minutes_per_activity) ? '' : input.duration_minutes_per_activity} onChange={e => update({ ...input, duration_minutes_per_activity: e.target.valueAsNumber })} aria-invalid={!!fieldError('duration_minutes_per_activity')} aria-describedby={fieldError('duration_minutes_per_activity') ? 'duration-error' : 'duration-hint'} /><span>dk</span></div>{fieldError('duration_minutes_per_activity') && <p className="field-error" id="duration-error">{fieldError('duration_minutes_per_activity')}</p>}</div></div>
              <p className="field-hint" id="duration-hint">Süre, her bir etkinlik için üst sınırdır.</p>
              <label htmlFor="materials">Elinizdeki malzemeler <span className="optional">İsteğe bağlı</span></label><div className="material-input"><input id="materials" value={material} placeholder="Kâğıt, kalem, taş…" onChange={e => setMaterial(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addMaterial() } }} aria-invalid={!!fieldError('available_materials')} aria-describedby="material-hint" /><button type="button" aria-label="Malzemeyi ekle" onClick={addMaterial} disabled={!material.trim()}><Plus size={19} /></button></div>
              <div className="chips" aria-label="Eklenen malzemeler">{input.available_materials.map(item => <span className="chip" key={item}>{item}<button type="button" onClick={() => update({ ...input, available_materials: input.available_materials.filter(x => x !== item) })} aria-label={`${item} malzemesini kaldır`}><X size={12} /></button></span>)}</div>
              {fieldError('available_materials') ? <p className="field-error">{fieldError('available_materials')}</p> : <p className="field-hint" id="material-hint">Enter veya + ile ekleyin. Malzeme yoksa boş bırakın.</p>}
              <label className="access-label">Sınıfta hangi olanaklar var?</label><div className="access-options">{([{ key: 'internet', label: 'İnternet', Icon: Wifi }, { key: 'screen', label: 'Ekran', Icon: Monitor }, { key: 'printer', label: 'Yazıcı', Icon: Printer }] as const).map(({ key, label, Icon }) => <label className={`access-option ${input.access[key] ? 'checked' : ''}`} key={key}><input type="checkbox" checked={input.access[key]} onChange={e => update({ ...input, access: { ...input.access, [key]: e.target.checked } })} /><Icon size={18} /><span>{label}</span><span className="check-indicator">{input.access[key] && <Check size={11} />}</span></label>)}</div><p className="field-hint">Yalnızca öğrencilerin kullanabildiği olanakları seçin.</p>
            </fieldset>
            <button className="generate-button" type="submit" disabled={status === 'loading'}>{status === 'loading' ? <><LoaderCircle className="spin" size={18} />{mode === 'mock' ? 'Örnek hazırlanıyor…' : 'Etkinlikler hazırlanıyor…'}</> : <><Sparkles size={18} />{mode === 'mock' ? 'Örnek etkinlikleri göster' : 'Etkinlikleri oluştur'}<ArrowRight size={17} /></>}</button>
            {status === 'loading' && <button className="cancel-button" type="button" onClick={cancel}>İşlemi iptal et</button>}
            <p className="form-bottom-note">{mode === 'mock' ? <><FlaskConical size={13} />Kayıtlı örnek veri · AI çağrısı yapılmaz</> : <><PlugZap size={13} />Sonuçlar bağlı model tarafından üretilir</>}</p>
            <button className="sample-button" type="button" onClick={loadExample} disabled={status === 'loading'}><BookOpen size={15} />Örnek senaryoyu yükle <ArrowRight size={14} /></button>
          </form>
        </aside>

        <section className="results-panel" ref={resultsRef} aria-labelledby="results-heading" aria-busy={status === 'loading'}>
          <div className="results-heading"><div><div className="eyebrow section-eyebrow">AYNI HEDEF, FARKLI DENEYİMLER</div><h2 id="results-heading">Etkinlik atölyeniz</h2></div><span className="result-count">3 yöntem <span /> 1 kazanım</span></div>
          <div role="status" aria-live="polite" className="sr-only">{status === 'loading' ? 'Etkinlikler hazırlanıyor.' : status === 'success' ? 'Üç etkinlik ve ortak değerlendirme hazır.' : canceled ? 'İşlem iptal edildi.' : edited ? 'Girdi değiştiği için önceki sonuç kaldırıldı.' : ''}</div>
          {error && <div className="error-panel" role="alert"><TriangleAlert size={21} /><div><h3>Bu kez tamamlayamadık</h3><p>{error.message}</p>{mode === 'api' && <small>Backend bağlantı ayarlarını sağ üstteki menüden görebilirsiniz.</small>}</div></div>}
          {edited && !result && <p className="inline-note"><RefreshCw size={15} />Koşullar değişti; önceki sonuç kaldırıldı. Yeni koşullarla yeniden hazırlayın.</p>}
          {canceled && <p className="inline-note">İşlem iptal edildi. Girdilerinizi koruduk; hazır olduğunuzda yeniden deneyebilirsiniz.</p>}
          {status === 'loading' ? <div className="loading-state"><div className="loading-mark"><Sparkles size={28} /></div><h3>{mode === 'mock' ? 'Örnek atölye açılıyor' : 'Sınıfınıza uygun yollar hazırlanıyor'}</h3><p>{mode === 'mock' ? 'Kayıtlı senaryo ve etkinlikler yükleniyor.' : 'Üç etkinlik ve ortak değerlendirme için model yanıtı bekleniyor.'}</p><div className="skeleton-grid">{[1, 2, 3].map(n => <div className="skeleton" key={n}><i /><i /><i /><i /></div>)}</div></div> : result ? <>
            <div className="result-banner"><CheckCheck size={19} /><div><strong>{mode === 'mock' ? 'Kayıtlı örnek senaryo' : 'Etkinlikler hazır'}</strong><p>{mode === 'mock' ? 'Bu içerik temsili veridir; canlı model üretimi değildir.' : 'Uygulamadan önce içerikleri öğretmen olarak gözden geçirin.'}</p></div></div>
            <div className="objective-summary"><Target size={18} /><div><span>ORTAK KAZANIM</span><p>{result.learning_objective}</p></div></div>
            <div className="activity-grid">{(['reading', 'hands_on', 'oral'] as Method[]).map((method, index) => <ActivityCard key={method} activity={result.activities.find(a => a.method === method)!} index={index} />)}</div>
            <section className="assessment" aria-labelledby="assessment-heading"><div className="assessment-icon"><GraduationCap size={25} /></div><div className="assessment-content"><div className="eyebrow section-eyebrow">ÜÇ YOLUN ORTAK NOKTASI</div><h3 id="assessment-heading">Aynı kazanımı birlikte değerlendirin</h3><p className="assessment-question">{result.common_assessment.question}</p><button type="button" className="answer-toggle" onClick={() => setAnswerOpen(!answerOpen)} aria-expanded={answerOpen} aria-controls="answer-content"><ShieldCheck size={16} />Öğretmen için cevap anahtarı<ChevronDown size={16} className={answerOpen ? 'rotate' : ''} /></button>{answerOpen && <div id="answer-content" className="answer-content"><h4>Beklenen cevap</h4><p>{result.common_assessment.expected_answer}</p><h4>Değerlendirme ölçütleri</h4><ul>{result.common_assessment.evaluation_criteria.map((item, i) => <li key={i}><Check size={15} />{item}</li>)}</ul></div>}</div></section>
            <div className="teacher-notes"><ShieldCheck size={19} /><div><h3>Son söz öğretmende</h3><ul>{result.teacher_notes.map((note, i) => <li key={i}>{note}</li>)}</ul><p>Biçim ve süre kontrolü, pedagojik doğruluk veya öğrenme etkisi garantisi değildir.</p></div></div>
          </> : status !== 'error' && <div className="empty-state"><span className="empty-icon"><BookOpen size={31} /><span><Sparkles size={14} /></span></span><h3>Her sınıfın olanakları farklı.<br />Öğrenme hedefi ortak.</h3><p>Soldaki alanları doldurun; kısa metin, somut malzeme<br className="desktop-break" /> ve sözlü etkileşimle üç farklı yolu keşfedin.</p><div className="method-previews">{Object.entries(methodInfo).map(([key, info]) => <div key={key} className={`method-preview ${info.color}`}><info.icon size={22} /><strong>{info.name}</strong><span>{info.eyebrow}</span></div>)}</div><button className="empty-example" type="button" onClick={loadExample}>Nereden başlayacağınızı bilmiyor musunuz?<span>3/4 örneğini yükleyin <ArrowRight size={15} /></span></button><div className="empty-note"><ShieldCheck size={17} /><p>Etkinlikleri siz değerlendirirsiniz.<br />EşdeğerDers, öğretmenin kararını destekler.</p></div></div>}
        </section>
      </div>
    </main>
    <footer className="site-footer"><span><span className="footer-mark">≋</span>EşdeğerDers</span><p>Farklı olanaklar. Ortak öğrenme hedefleri.</p><span>Samsung Innovation Campus · 2026</span></footer>

    {settings && <div className="modal-backdrop" onClick={() => setSettings(false)}><section className="dialog" role="dialog" aria-modal="true" aria-labelledby="settings-title" onClick={e => e.stopPropagation()}><div className="dialog-heading"><h2 id="settings-title">Bağlantı ayarları</h2><button autoFocus type="button" aria-label="Ayarları kapat" onClick={() => setSettings(false)}><X size={20} /></button></div><p className="dialog-intro">Arayüzü kayıtlı örnekle deneyin veya backend hazır olduğunda gerçek üretime geçin.</p><div className="mode-choices"><button type="button" className={mode === 'mock' ? 'selected' : ''} onClick={() => chooseMode('mock')} aria-pressed={mode === 'mock'}><FlaskConical size={22} /><strong>Örnek veri</strong><span>Yalnız kayıtlı 3/4 senaryosu. Model çağrısı yok.</span></button><button type="button" className={mode === 'api' ? 'selected' : ''} onClick={() => chooseMode('api')} aria-pressed={mode === 'api'}><PlugZap size={22} /><strong>Canlı API</strong><span>FastAPI sunucusuna gerçek istek gönderir.</span></button></div><div className="endpoint-info"><span>Bağlanılacak adres</span><code>{API_BASE_URL}{ENDPOINT}</code><p>Adres, frontend’in VITE_API_BASE_URL ayarıyla değişir. API anahtarı bu arayüze girilmez. Canlı API modunu seçmek sunucunun bağlı olduğunu doğrulamaz.</p></div><button className="generate-button" type="button" onClick={() => setSettings(false)}>Atölyeye dön<ArrowRight size={16} /></button></section></div>}
    {help && <div className="modal-backdrop" onClick={() => setHelp(false)}><section className="dialog help-dialog" role="dialog" aria-modal="true" aria-labelledby="help-title" onClick={e => e.stopPropagation()}><div className="dialog-heading"><h2 id="help-title">Sınıfınızdan başlayan bir atölye</h2><button autoFocus type="button" aria-label="Açıklamayı kapat" onClick={() => setHelp(false)}><X size={20} /></button></div>{[{ n: '01', title: 'Kazanımı ve koşulları paylaşın', text: 'Hedefi, öğrenci yaşını, her etkinlik için süreyi ve gerçekten erişebildiğiniz malzemeleri belirtin.' }, { n: '02', title: 'Üç farklı yöntemi inceleyin', text: 'Kısa metin, somut malzeme ve sözlü etkileşimle aynı hedefe yönelen etkinlikleri karşılaştırın.' }, { n: '03', title: 'Ortak soruyla kontrol edin', text: 'Cevap anahtarı ve ölçütlerle kazanımı değerlendirin. İçerikleri sınıfınızda kullanmadan önce doğrulayın.' }].map(item => <div className="help-step" key={item.n}><b>{item.n}</b><div><h3>{item.title}</h3><p>{item.text}</p></div></div>)}<p className="help-note"><CircleHelp size={18} />Öğrenci adı, tanısı veya özel belgesi gerekmez. Üretilen içerik öğretmen incelemesi gerektirir.</p></section></div>}
  </>
}
