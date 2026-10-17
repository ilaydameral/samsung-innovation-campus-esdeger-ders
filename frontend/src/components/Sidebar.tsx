import { useEffect, useState } from 'react'
import { ArrowUpRight, BookOpen, ChevronRight, CircleHelp, ClipboardCheck, FlaskConical, GraduationCap, LayoutDashboard, Leaf, Settings2, Sparkles, X } from 'lucide-react'

export type Section = 'overview' | 'workshop' | 'assessment'
interface Props {
  activeSection: Section
  hasResult: boolean
  mobileOpen: boolean
  onClose: () => void
  onNavigate: (section: Section) => void
  onExample: () => void
  onHelp: () => void
  onSettings: () => void
}

export default function Sidebar(props: Props) {
  const [isCompact, setIsCompact] = useState(() => window.matchMedia('(max-width: 920px)').matches)
  useEffect(() => {
    const query = window.matchMedia('(max-width: 920px)')
    const update = () => setIsCompact(query.matches)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  return <aside id="workspace-sidebar" className={`workspace-sidebar ${props.mobileOpen ? 'is-open' : ''}`} role={props.mobileOpen ? 'dialog' : undefined} aria-modal={props.mobileOpen || undefined} aria-label="Çalışma alanı menüsü" inert={isCompact && !props.mobileOpen} aria-hidden={isCompact && !props.mobileOpen ? true : undefined}>
    <div className="sidebar-brand-row"><a className="brand" href="#overview" onClick={event => { event.preventDefault(); props.onNavigate('overview') }} aria-label="EşdeğerDers ana sayfa"><span className="brand-symbol"><span /><span /><span /></span><span>Eşdeğer<span className="brand-light">Ders</span><small>HER SINIF İÇİN BİR YOL</small></span></a>{props.mobileOpen && <button autoFocus type="button" className="sidebar-close" onClick={props.onClose} aria-label="Gezinme menüsünü kapat"><X size={19} /></button>}</div>
    <div className="sidebar-intro"><span className="sidebar-kicker">ÖĞRETMEN ATÖLYESİ</span><p>Olanaklar farklı.<br /><strong>Öğrenme hedefi ortak.</strong></p></div>
    <span className="sidebar-section-label">ÇALIŞMA ALANI</span>
    <nav className="sidebar-nav" aria-label="Çalışma alanında gezinme">
      <button type="button" className={props.activeSection === 'overview' ? 'active' : ''} aria-current={props.activeSection === 'overview' ? 'location' : undefined} onClick={() => props.onNavigate('overview')}><LayoutDashboard size={18} /><span>Genel bakış</span></button>
      <button type="button" className={props.activeSection === 'workshop' ? 'active' : ''} aria-current={props.activeSection === 'workshop' ? 'location' : undefined} onClick={() => props.onNavigate('workshop')}><Sparkles size={18} /><span>Etkinlik atölyesi</span><ChevronRight className="nav-chevron" size={14} /></button>
      <button type="button" className={props.activeSection === 'assessment' ? 'active' : ''} aria-current={props.activeSection === 'assessment' ? 'location' : undefined} onClick={() => props.onNavigate('assessment')} disabled={!props.hasResult} title={!props.hasResult ? 'Etkinlikler hazır olduğunda açılır.' : 'Ortak değerlendirmeye git'}><ClipboardCheck size={18} /><span>Ortak değerlendirme</span></button>
    </nav>
    <span className="sidebar-section-label resources-label">KEŞFET VE HAZIRLAN</span>
    <nav className="sidebar-nav" aria-label="Atölye yardımcıları">
      <button type="button" onClick={props.onExample}><FlaskConical size={18} /><span>Örnek senaryo</span><span className="sidebar-example-tag">3/4</span></button>
      <button type="button" onClick={props.onHelp}><BookOpen size={18} /><span>Yöntem rehberi</span></button>
      <button type="button" onClick={props.onSettings}><Settings2 size={18} /><span>Bağlantı ayarları</span></button>
    </nav>
    <div className="sidebar-bottom"><div className="sidebar-sdg"><span className="sdg-number">04</span><div><strong>Nitelikli eğitim</strong><p>Her sınıfın olanaklarına<br />uygun öğrenme yolları.</p></div><Leaf size={18} /></div><button className="sidebar-guide" type="button" onClick={props.onHelp}><CircleHelp size={16} />Nereden başlamalıyım?<ArrowUpRight size={14} /></button><div className="guest-workspace"><span className="guest-avatar"><GraduationCap size={20} /></span><div><strong>Öğretmen çalışma alanı</strong><span>Üyeliksiz kullanım</span></div></div></div>
  </aside>
}
