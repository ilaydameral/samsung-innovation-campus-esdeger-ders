import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import type { ActivityRequest, Mode } from '../types.ts'

export default function MaterialAdaptation({ request, mode, onAdapt }: {
  request: ActivityRequest; mode: Mode; onAdapt: (removed: string[]) => void
}) {
  const [removed, setRemoved] = useState<string[]>([])
  if (!request.available_materials.length) return null
  return <section className="material-adaptation" aria-labelledby="adapt-title">
    <div className="adapt-heading"><RefreshCw size={21} /><div><span className="eyebrow">OLANAKLAR DEĞİŞİR, HEDEF KALIR</span><h3 id="adapt-title">Bu malzeme de yok</h3></div></div>
    <p>Bulamadığınız malzemeleri seçin. Kazanım, yaş, süre ve diğer olanaklar korunarak kalan malzemelerle yeni bir plan istenecek.</p>
    <fieldset><legend>Artık kullanamayacağınız malzemeler</legend><div className="adapt-materials">{request.available_materials.map(item => <label key={item} className={removed.includes(item) ? 'selected' : ''}><input type="checkbox" checked={removed.includes(item)} onChange={event => setRemoved(previous => event.target.checked ? [...previous, item] : previous.filter(value => value !== item))} />{item}</label>)}</div></fieldset>
    <div className="adapt-action"><button type="button" disabled={!removed.length} onClick={() => onAdapt(removed)}><RefreshCw size={16} />{mode === 'mock' ? 'Yeni koşulları hazırla' : 'Kalan malzemelerle yeni plan iste'}</button><span>{mode === 'mock' ? 'Örnek veri değiştirilemez. Bu adım yalnız yeni girdiyi hazırlar; AI çağrısı yapmaz.' : 'Yeni bir model isteği gönderilir. Kazanım metni korunur; içerik yeniden öğretmen incelemesi gerektirir.'}</span></div>
  </section>
}
