import { Languages } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider'

export function LangToggle({ light = false }: { light?: boolean }) {
  const { lang, setLang } = useI18n()
  return (
    <div className={`inline-flex items-center rounded-full border p-0.5 text-xs font-semibold ${light ? 'border-white/25 bg-white/10' : 'border-line bg-surface'}`} role="group" aria-label="Language">
      <Languages size={14} className={`mx-1.5 ${light ? 'text-white/70' : 'text-muted'}`} aria-hidden />
      {(['th', 'en'] as const).map((l) => (
        <button key={l} onClick={() => setLang(l)} aria-pressed={lang === l}
          className={`rounded-full px-2.5 py-1 uppercase transition-colors ${lang === l ? (light ? 'bg-white text-[#0b2a5b]' : 'bg-brand text-white dark:text-[#0a1120]') : light ? 'text-white/80 hover:text-white' : 'text-muted hover:text-fg'}`}>
          {l}
        </button>
      ))}
    </div>
  )
}
