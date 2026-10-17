import { useState } from 'react'
import { ClipboardCheck, TriangleAlert } from 'lucide-react'
import type { ActivityRequest, ActivityResponse, Method } from '../types.ts'
import { isReviewComplete, reviewChecks, reviewClassroom } from '../lib/classroomReview.ts'

const methodNames = { reading: 'Kısa metin', hands_on: 'Somut malzeme', oral: 'Sözlü etkileşim' }

export default function ClassroomReview({ request, response, onChooseMethod }: { request: ActivityRequest; response: ActivityResponse; onChooseMethod: (method: Method) => void }) {
  const [method, setMethod] = useState<Method | ''>('')
  const [checks, setChecks] = useState<boolean[]>([false, false, false])
  const findings = reviewClassroom(request, response)
  const complete = isReviewComplete(method, checks)
  return <section className="classroom-review" aria-labelledby="classroom-review-title">
    <div className="review-heading"><ClipboardCheck size={22} /><div><span className="eyebrow">ÜRETİMDEN UYGULAMAYA</span><h3 id="classroom-review-title">Sınıfta uygulanabilir mi?</h3></div></div>
    <p className="review-intro">Önce kaynak taramasını inceleyin, sonra uygulayacağınız yöntemi seçin. Üç yöntem alternatiftir; hepsini arka arkaya yapmanız gerekmez.</p>
    <details className="resource-review"><summary>Kaynak taraması · {findings.some(item => item.unlistedMaterials.length || item.resourceMentions.length) ? 'Gözden geçirilecek ifadeler var' : 'Listelerde eşleşmeyen kaynak bulunmadı'}</summary>
      <p className="review-limits">Malzemeler, yazımları ve miktarları korunarak listeyle karşılaştırılır. Eş anlamlılar ve adımlarda gizli kaynak ihtiyaçları otomatik doğrulanmaz. Kapalı olanaklara ait sözcükler olumsuz cümlede de işaretlenebilir; bunlar kesin ihlal değildir.</p>
      {findings.map(item => <div className="resource-finding" key={item.id}><strong>{methodNames[item.method]} · {item.title}</strong>
        {item.unlistedMaterials.length > 0 ? <p><TriangleAlert size={14} />Malzeme listenizle birebir eşleşmeyenler: {item.unlistedMaterials.join(', ')}. Adlandırmayı, miktarı veya alternatifini kontrol edin.</p> : <p>Malzeme listesi: {response.activities.find(activity => activity.id === item.id)!.materials_used.length ? 'Bildirilen malzemeler girdi listenizle eşleşiyor.' : 'Ek malzeme bildirilmemiş.'} Adımları da inceleyin.</p>}
        {item.resourceMentions.map(mention => <p key={mention.resource}><TriangleAlert size={14} />{mention.resource} sınıfta yok; şu ifadenin bu olanağı gerektirip gerektirmediğini kontrol edin: “{mention.excerpt}”</p>)}
      </div>)}
    </details>
    <fieldset className="review-method"><legend>Sınıfımda uygulamak için inceleyeceğim yöntem</legend><div>{(['reading', 'hands_on', 'oral'] as const).map(value => <label key={value} className={method === value ? 'selected' : ''}><input type="radio" name="review-method" value={value} checked={method === value} onChange={() => { setMethod(value); setChecks([false, false, false]); onChooseMethod(value) }} />{methodNames[value]}</label>)}</div></fieldset>
    <fieldset className="teacher-checks" disabled={!method}><legend>Öğretmen olarak kontrol ettim</legend>{reviewChecks.map((label, i) => <label key={label}><input type="checkbox" checked={checks[i]} onChange={event => setChecks(previous => previous.map((value, index) => index === i ? event.target.checked : value))} /><span>{label}</span></label>)}</fieldset>
    <p className={`review-progress ${complete ? 'complete' : ''}`} role="status">{complete ? `${methodNames[method as Method]} için 3 öğretmen kontrolünü işaretlediniz.` : method ? `${checks.filter(Boolean).length}/3 öğretmen kontrolü işaretlendi.` : 'Kontrole başlamak için bir yöntem seçin.'}</p>
    <p className="review-footnote">Bu işaretler sizin incelemenizi belirtir; sistem onayı veya öğrenme eşdeğerliği kanıtı değildir. Bu oturum içindir; yöntem veya sonuç değişince sıfırlanır, kaydedilmez.</p>
  </section>
}
