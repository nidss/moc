import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type Lang = 'th' | 'en'
export type LText = { th: string; en: string }

type I18nValue = {
  lang: Lang
  setLang: (lang: Lang) => void
  toggleLang: () => void
  /** แปลข้อความแบบ inline: tr('ภาษาไทย', 'English') */
  tr: (th: string, en: string) => string
  /** เลือกภาษาจากข้อมูลที่มีทั้งสองภาษา */
  L: (text: LText) => string
  fmtNumber: (n: number) => string
  fmtMoney: (n: number, compact?: boolean) => string
  fmtDate: (iso: string, opts?: Intl.DateTimeFormatOptions) => string
}

const I18nContext = createContext<I18nValue | null>(null)
const STORAGE_KEY = 'moc-demo-lang'

function readLang(): Lang {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === 'th' || v === 'en') return v
  } catch {
    // ไม่มี localStorage ก็ใช้ค่าเริ่มต้น
  }
  return 'th'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readLang)

  useEffect(() => {
    document.documentElement.lang = lang
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // ignore
    }
  }, [lang])

  const setLang = useCallback((l: Lang) => setLangState(l), [])
  const toggleLang = useCallback(() => setLangState((l) => (l === 'th' ? 'en' : 'th')), [])

  const value = useMemo<I18nValue>(() => {
    const locale = lang === 'th' ? 'th-TH' : 'en-US'
    const nf = new Intl.NumberFormat(locale)
    return {
      lang,
      setLang,
      toggleLang,
      tr: (th, en) => (lang === 'th' ? th : en),
      L: (text) => text[lang],
      fmtNumber: (n) => nf.format(n),
      fmtMoney: (n, compact) => {
        if (compact) {
          if (Math.abs(n) >= 1_000_000) return `฿${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
          if (Math.abs(n) >= 1_000) return `฿${(n / 1_000).toFixed(0)}K`
        }
        return `฿${nf.format(Math.round(n))}`
      },
      fmtDate: (iso, opts) =>
        new Intl.DateTimeFormat(locale, opts ?? { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso)),
    }
  }, [lang, setLang, toggleLang])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider')
  return ctx
}
