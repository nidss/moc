import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Mic, Send, Sparkles } from 'lucide-react'
import { useI18n } from '../../i18n/I18nProvider'
import { STAGES } from '../../data/event'
import { answer, type AiAnswer } from '../../lib/aiConcept'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { OrgAvatar } from '../../components/Brand'

type Msg = { role: 'user' | 'ai'; text: string; data?: AiAnswer }

function Avatar({ talking }: { talking: boolean }) {
  return (
    <svg viewBox="0 0 200 200" className="mx-auto w-40 sm:w-52" aria-hidden>
      <defs>
        <linearGradient id="av-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f5a300" />
          <stop offset="1" stopColor="#ff7a45" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="92" fill="url(#av-bg)" opacity="0.18" className={talking ? 'animate-ping' : ''} style={{ transformOrigin: 'center', animationDuration: '1.6s' }} />
      <circle cx="100" cy="100" r="78" fill="#ffffff" />
      <circle cx="100" cy="100" r="78" fill="url(#av-bg)" opacity="0.15" />
      <rect x="52" y="62" width="96" height="70" rx="30" fill="#0b2a5b" />
      <circle cx="80" cy="96" r="9" fill="#5ee0ff" />
      <circle cx="120" cy="96" r="9" fill="#5ee0ff" />
      <rect x="86" y={talking ? 112 : 116} width="28" height={talking ? 10 : 4} rx="4" fill="#f5a300">
        {talking && <animate attributeName="height" values="4;10;4" dur="0.4s" repeatCount="indefinite" />}
      </rect>
      <rect x="96" y="40" width="8" height="22" rx="4" fill="#0b2a5b" />
      <circle cx="100" cy="38" r="8" fill="#f5a300" />
      <rect x="60" y="140" width="80" height="26" rx="13" fill="#0b2a5b" />
      <text x="100" y="158" textAnchor="middle" fontSize="13" fontWeight="700" fill="#fff">MOC AI</text>
    </svg>
  )
}

export default function AskAiPage() {
  const { tr, L, lang } = useI18n()
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const end = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMsgs([{ role: 'ai', text: tr('สวัสดีครับ ผม MOC AI ผู้ช่วยประจำงาน MOC Expo 2026 ถามเรื่องร้านค้า สินค้า Buyer หรือกิจกรรมได้เลยครับ', "Hi, I'm MOC AI, your MOC Expo 2026 assistant. Ask me about shops, products, buyers or activities.") }])
  }, [tr])

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [msgs, typing])

  const ask = (text: string) => {
    if (!text.trim() || typing) return
    setMsgs((m) => [...m, { role: 'user', text }])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      const a = answer(text, lang)
      setMsgs((m) => [...m, { role: 'ai', text: a.text, data: a }])
      setTyping(false)
    }, 900)
  }

  const suggestions = [
    tr('มีสินค้าอาหารสุขภาพอะไรบ้าง', 'What healthy food products are there?'),
    tr('Siam Retail Group สนใจสินค้าอะไร', 'What is Siam Retail Group interested in?'),
    tr('วันนี้มีกิจกรรมอะไรบ้าง', "What's on today?"),
    tr('Business Matching ทำอย่างไร', 'How does Business Matching work?'),
  ]

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-bold">Ask MOC AI</h1>
        <Badge tone="accent">Concept</Badge>
      </div>
      <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
        <Card className="hero-bg flex flex-col items-center justify-center p-6 text-center text-white">
          <Avatar talking={typing} />
          <div className="mt-4 text-lg font-bold">MOC AI Avatar</div>
          <div className="text-sm text-white/75">{tr('ผู้ช่วยดิจิทัลบนตู้ Kiosk และเว็บไซต์', 'Digital assistant on kiosks and the web')}</div>
          <div className="mt-4 flex flex-wrap justify-center gap-1.5 text-[11px]">
            {['TH / EN / 中文', 'Voice', 'RAG on event data'].map((x) => <span key={x} className="rounded-full bg-white/15 px-2 py-0.5">{x}</span>)}
          </div>
        </Card>

        <Card className="flex h-[620px] flex-col overflow-hidden">
          <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm sm:max-w-[80%] ${m.role === 'user' ? 'rounded-br-md bg-brand text-white dark:text-[#0a1120]' : 'rounded-bl-md bg-surface-2'}`}>
                  <div className="whitespace-pre-line">{m.text}</div>
                  {m.data?.exhibitors && (
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {m.data.exhibitors.map((e) => (
                        <Link key={e.id} to={`/exhibitors/${e.id}`} className="flex items-center gap-2 rounded-xl bg-surface p-2.5 hover:ring-1 hover:ring-brand">
                          <OrgAvatar org={e} size="sm" />
                          <div className="min-w-0">
                            <div className="truncate text-sm font-semibold">{L(e.name)}</div>
                            <div className="truncate text-xs text-muted">{L(e.products[0].name)} · Booth {e.booth}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                  {m.data?.sessions && (
                    <div className="mt-3 space-y-1.5">
                      {m.data.sessions.map((s) => (
                        <div key={s.id} className="flex gap-3 rounded-lg bg-surface px-3 py-2">
                          <span className="font-bold text-brand">{s.start}</span>
                          <span className="flex-1">{L(s.title)}</span>
                          <span className="hidden text-xs text-muted sm:inline">{L(STAGES[s.stage])}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {m.data?.link && (
                    <Link to={m.data.link.to} className="mt-3 inline-block text-sm font-semibold text-brand hover:underline">{m.data.link.label} →</Link>
                  )}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex gap-1 rounded-2xl bg-surface-2 px-4 py-3 w-fit">
                {[0, 1, 2].map((d) => <span key={d} className="size-2 animate-bounce rounded-full bg-muted" style={{ animationDelay: `${d * 0.15}s` }} />)}
              </div>
            )}
            <div ref={end} />
          </div>
          <div className="border-t border-line p-3">
            <div className="no-scrollbar mb-2 flex gap-2 overflow-x-auto">
              {suggestions.map((s) => (
                <button key={s} onClick={() => ask(s)} className="flex shrink-0 items-center gap-1 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium hover:border-brand hover:text-brand">
                  <Sparkles size={12} /> {s}
                </button>
              ))}
            </div>
            <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); ask(input) }}>
              <button type="button" className="rounded-xl border border-line p-2.5 text-muted" aria-label="Voice input (concept)" title="Voice (concept)"><Mic size={18} /></button>
              <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={tr('พิมพ์คำถาม...', 'Ask something...')}
                className="flex-1 rounded-xl border border-line bg-surface px-3.5 text-sm focus:border-brand focus:outline-none" aria-label="Question" />
              <button type="submit" className="rounded-xl bg-brand p-2.5 text-white disabled:opacity-50 dark:text-[#0a1120]" disabled={!input.trim() || typing} aria-label="Send"><Send size={18} /></button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  )
}
