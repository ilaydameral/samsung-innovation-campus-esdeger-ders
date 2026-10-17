import { useState } from 'react'
import { ArrowRight, Columns2 } from 'lucide-react'
import type { Activity, ActivityRequest, ActivityResponse, Method, Mode } from '../types.ts'
import { comparePlans } from '../lib/comparison.ts'

const methods = { reading: 'Kısa metin', hands_on: 'Somut malzeme', oral: 'Sözlü etkileşim' }
const source = (mode: Mode) => mode === 'mock' ? 'Kayıtlı örnek veri · Canlı model üretimi değil' : 'Canlı API yanıtı · Öğretmen incelemesi gerekir'

function ComparedActivity({ activity }: { activity: Activity }) {
  return <><h4>{activity.title}</h4><p><strong>Süre:</strong> {activity.duration_minutes} dakika</p><p><strong>Bildirilen malzemeler:</strong> {activity.materials_used.join(', ') || 'Ek malzeme bildirilmemiş'}</p><h5>Uygulama adımları</h5><ol>{activity.steps.map((step, i) => <li key={i}>{step}</li>)}</ol><p><strong>Gözlemlenecek davranış:</strong> {activity.expected_student_behavior}</p></>
}

export default function PlanComparison({ beforeInput, before, beforeMode, afterInput, after, afterMode }: {
  beforeInput: ActivityRequest; before: ActivityResponse; beforeMode: Mode; afterInput: ActivityRequest; after: ActivityResponse | null; afterMode: Mode
}) {
  const [method, setMethod] = useState<Method>('hands_on')
  const comparison = comparePlans(beforeInput, before, afterInput, after)
  const pair = comparison.methods.find(item => item.method === method)!
  return <details className="plan-comparison" open>
    <summary><Columns2 size={19} />Önce / sonra karşılaştırması</summary>
    <div className="comparison-body"><p className="comparison-intro">{comparison.objectiveTextPreserved ? 'Hedef kazanımın metni korundu.' : 'Hedef kazanımın metni değişti.'} Bu karşılaştırma metin ve koşul değişimini gösterir; eşit öğrenme etkisini doğrulamaz.</p>
      <div className="comparison-goal"><strong>HEDEF KAZANIM</strong><p>{afterInput.learning_objective}</p>{!comparison.objectiveTextPreserved && <p>Önceki: {beforeInput.learning_objective}</p>}</div>
      <div className="comparison-tabs" role="group" aria-label="Karşılaştırılacak yöntem">{(['reading', 'hands_on', 'oral'] as const).map(value => <button type="button" key={value} aria-pressed={method === value} onClick={() => setMethod(value)}>{methods[value]}</button>)}</div>
      <p className="comparison-change" role="status">{pair.stepsTextChanged === null ? 'Yeni yanıt henüz yok; önceki planı inceleyebilirsiniz.' : pair.stepsTextChanged ? 'Bu yöntemin adım metni değişti. Yeni adımları uygulanabilirlik açısından inceleyin.' : 'Bu yöntemin adım metni aynı kaldı. Çıkarılan malzemeye hâlâ ihtiyaç olup olmadığını inceleyin.'}</p>
      <div className="comparison-columns"><section className="comparison-column" aria-label="Önceki plan"><div className="comparison-column-title"><span>ÖNCE</span><ArrowRight size={16} /></div><p className="comparison-source">{source(beforeMode)}</p><p className="comparison-materials"><strong>Sınıfta mevcut:</strong> {beforeInput.available_materials.join(', ') || 'Malzeme yok'}</p><ComparedActivity activity={pair.previous} /></section>
      <section className="comparison-column after" aria-label="Yeni plan"><div className="comparison-column-title"><span>SONRA</span></div><p className="comparison-source">{after ? source(afterMode) : 'Yeni yanıt alınmadı'}</p><p className="comparison-materials"><strong>Sınıfta mevcut:</strong> {afterInput.available_materials.join(', ') || 'Malzeme yok'}</p>{pair.current ? <ComparedActivity activity={pair.current} /> : <div className="comparison-pending"><h4>Bu koşullar için yeni plan bekleniyor</h4><p>Önceki etkinlik yeni plan olarak gösterilmez. Canlı üretim tamamlandığında bu alan doldurulur.</p></div>}</section></div>
      {after && <details className="comparison-assessment"><summary>Ortak sorudaki değişimi incele · {comparison.questionTextChanged ? 'Metin değişti' : 'Metin aynı'}</summary><div className="comparison-columns"><div><h4>Önceki soru</h4><p>{before.common_assessment.question}</p></div><div><h4>Yeni soru</h4><p>{after.common_assessment.question}</p></div></div></details>}
      <p className="comparison-note">Malzeme listesinin veya adımların değişmesi tek başına uygunluk kanıtı değildir. Yeni planın kaynak taramasını ve öğretmen kontrollerini tamamlayın.</p>
    </div>
  </details>
}
