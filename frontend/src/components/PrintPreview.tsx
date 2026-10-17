import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Printer, X, GraduationCap, BookOpen } from 'lucide-react'
import type { ActivityRequest, ActivityResponse, Mode } from '../types.ts'
import { createPrintPlan } from '../lib/print.ts'
import type { PrintAudience } from '../lib/print.ts'

const names = { reading: 'Kısa metin', hands_on: 'Somut malzeme', oral: 'Sözlü etkileşim' }

export default function PrintPreview({ request, response, mode, onClose }: {
  request: ActivityRequest; response: ActivityResponse; mode: Mode; onClose: () => void
}) {
  const [audience, setAudience] = useState<PrintAudience>('student')
  const closeRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null
    const appRoot = document.getElementById('root')
    const wasInert = appRoot?.inert ?? false
    if (appRoot) appRoot.inert = true
    closeRef.current?.focus()
    return () => { if (appRoot) appRoot.inert = wasInert; previousFocus?.focus() }
  }, [])
  const plan = createPrintPlan(request, response, mode, audience)
  return createPortal(<div className="print-root" role="dialog" aria-modal="true" aria-labelledby="print-title">
    <div className="print-toolbar">
      <div className="print-toolbar-heading"><div><span className="eyebrow">SINIFA GÖTÜR</span><h2 id="print-title">Yazdırma önizlemesi</h2></div><button ref={closeRef} type="button" className="print-close" onClick={onClose} aria-label="Yazdırma önizlemesini kapat"><X size={22} /></button></div>
      <div className="print-options" role="group" aria-label="Çıktı türü">
        <button type="button" aria-pressed={audience === 'student'} onClick={() => setAudience('student')}><GraduationCap size={18} /><span>Öğrenci soru kâğıdı<small>Ortak soru ve cevap alanı</small></span></button>
        <button type="button" aria-pressed={audience === 'teacher'} onClick={() => setAudience('teacher')}><BookOpen size={18} /><span>Öğretmen planı<small>3 etkinlik, cevap anahtarı ve notlar</small></span></button>
      </div>
      <div className="print-actions"><p>{audience === 'student' ? 'Cevap anahtarı ve çözüm içerebilen etkinlik adımları bu çıktıya eklenmez.' : 'Bu çıktı cevapları içerir; öğretmenin kullanımı içindir. Ekrandaki yöntem filtresinden bağımsız olarak üç etkinliği de kapsar.'} Tarayıcı menüsünden yazdırabilir veya varsa PDF olarak kaydedebilirsiniz.</p><button type="button" className="generate-button" onClick={() => window.print()}><Printer size={17} />Yazdır / PDF</button></div>
    </div>
    <article className="print-paper" aria-label={audience === 'student' ? 'Öğrenci çıktısı önizlemesi' : 'Öğretmen çıktısı önizlemesi'}>
      <header className="print-paper-header"><strong>EşdeğerDers</strong><span>{audience === 'student' ? 'ÖĞRENCİ SORU KÂĞIDI' : 'ÖĞRETMEN PLANI · CEVAP ANAHTARI İÇERİR'}</span></header>
      <p className="print-source">{plan.source}</p>
      <h1>{audience === 'student' ? 'Öğrendiklerimi gösteriyorum' : 'Bir kazanım, üç öğrenme yolu'}</h1>
      {plan.teacher && <div className="print-objective"><strong>Hedef kazanım</strong><p>{plan.teacher.objective}</p><span>Öğrenci yaşı: {plan.age}</span></div>}
      {plan.teacher && <><p className="print-context">Sınıftaki olanaklar: İnternet {plan.teacher.access.internet ? 'var' : 'yok'} · Ekran {plan.teacher.access.screen ? 'var' : 'yok'} · Yazıcı {plan.teacher.access.printer ? 'var' : 'yok'}</p><p>Üç alternatif aynı hedefe yönelir. Sınıfınıza uygun yöntemi seçin; süreler her etkinlik içindir. Kullanımdan önce içeriği kontrol edin.</p>{(['reading', 'hands_on', 'oral'] as const).map(method => {
        const activity = plan.teacher!.activities.find(item => item.method === method)!
        return <section className="print-activity" key={activity.id}><div className="print-section-label">{names[method]} · {activity.duration_minutes} dakika</div><h2>{activity.title}</h2><p><strong>Malzemeler:</strong> {activity.materials_used.join(', ') || 'Ek malzeme gerekmiyor'}</p><ol>{activity.steps.map((step, index) => <li key={index}>{step}</li>)}</ol><p><strong>Gözlemlenecek davranış:</strong> {activity.expected_student_behavior}</p></section>
      })}</>}
      <section className="print-question"><h2>Ortak değerlendirme</h2><p>{plan.question}</p>{!plan.teacher && <><p className="print-instruction">Yanıtını aşağıya yaz veya öğretmenine sözlü olarak açıkla.</p><div className="response-lines" aria-label="Yazılı cevap alanı">{Array.from({ length: 7 }, (_, i) => <div key={i} />)}</div></>}</section>
      {plan.teacher && <><section className="print-answer"><h2>Öğretmen için cevap anahtarı</h2><p>{plan.teacher.answer}</p><h3>Değerlendirme ölçütleri</h3><ul>{plan.teacher.criteria.map((item, i) => <li key={i}>{item}</li>)}</ul></section><section className="print-notes"><h2>Öğretmen notları</h2><ul>{plan.teacher.notes.map((item, i) => <li key={i}>{item}</li>)}</ul></section></>}
      <footer className="print-paper-footer">Samsung Innovation Campus · EşdeğerDers · Nitelikli eğitim (SDG 4)</footer>
    </article>
  </div>, document.body)
}
