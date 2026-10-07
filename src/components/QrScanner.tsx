import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { Camera, CameraOff } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider'

/** กล้องสแกน QR — เริ่มทำงานเมื่อผู้ใช้กดเปิดกล้องเท่านั้น */
export function QrScanner({ onResult }: { onResult: (text: string) => void }) {
  const { tr } = useI18n()
  const [state, setState] = useState<'idle' | 'starting' | 'running' | 'error'>('idle')
  const scanner = useRef<Html5Qrcode | null>(null)
  const done = useRef(false)
  const onResultRef = useRef(onResult)
  onResultRef.current = onResult

  const stop = async () => {
    const s = scanner.current
    scanner.current = null
    if (s?.isScanning) {
      try {
        await s.stop()
      } catch {
        // ignore
      }
    }
    try {
      s?.clear()
    } catch {
      // ignore
    }
  }

  useEffect(() => () => void stop(), [])

  const start = async () => {
    setState('starting')
    done.current = false
    try {
      const s = new Html5Qrcode('qr-reader', { verbose: false })
      scanner.current = s
      await s.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: (w, h) => { const size = Math.floor(Math.min(w, h) * 0.7); return { width: size, height: size } } },
        (text) => {
          if (done.current) return
          done.current = true
          void stop().then(() => { setState('idle'); onResultRef.current(text.trim()) })
        },
        () => {},
      )
      setState('running')
    } catch {
      await stop()
      setState('error')
    }
  }

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-navy sm:aspect-[4/3]">
      <div id="qr-reader" className="absolute inset-0 [&_video]:h-full! [&_video]:w-full! [&_video]:object-cover" />
      {state !== 'running' && (
        <div className="scan-frame absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center text-white">
          <div className="absolute inset-[12%] rounded-3xl border-2 border-white/25" />
          {state === 'error' ? (
            <>
              <CameraOff size={40} className="text-white/70" />
              <div className="relative max-w-xs text-sm text-white/80">
                {tr('ไม่สามารถเปิดกล้องได้ — ใช้ “จำลองการสแกน” หรือค้นหาด้วยชื่อแทน', 'Camera unavailable — use “Simulate scan” or manual search instead.')}
              </div>
              <button onClick={start} className="relative rounded-full bg-white/15 px-4 py-2 text-sm font-semibold ring-1 ring-white/30">{tr('ลองอีกครั้ง', 'Try again')}</button>
            </>
          ) : (
            <>
              <Camera size={40} className="text-accent" />
              <div className="relative text-lg font-bold">{tr('สแกน QR ผู้เข้าชม', 'Scan Visitor QR')}</div>
              <button onClick={start} disabled={state === 'starting'}
                className="relative rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-on-accent disabled:opacity-60">
                {state === 'starting' ? tr('กำลังเปิดกล้อง...', 'Starting camera...') : tr('เปิดกล้อง', 'Start camera')}
              </button>
            </>
          )}
        </div>
      )}
      {state === 'running' && (
        <button onClick={() => { void stop(); setState('idle') }} className="absolute right-3 bottom-3 rounded-full bg-black/50 px-3 py-1.5 text-xs font-semibold text-white">
          {tr('ปิดกล้อง', 'Stop camera')}
        </button>
      )}
    </div>
  )
}
