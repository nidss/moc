import { useEffect } from 'react'
import { Link, Navigate, useLocation, useParams } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { ArrowLeft, Briefcase, Globe, Mail, MapPin, MessageCircle, Phone, ShieldCheck, ShoppingCart, User } from 'lucide-react'
import { useI18n } from '../../i18n/I18nProvider'
import { AGENCIES, CATEGORIES, PAVILIONS, PROVINCES, zoneLabel } from '../../data/event'
import { EXHIBITOR_BY_ID } from '../../data/exhibitors'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { LinkButton } from '../../components/ui/Button'
import { OrgAvatar, ProductArt } from '../../components/Brand'

export default function ExhibitorDetailPage() {
  const { id = '' } = useParams()
  const { hash } = useLocation()
  const { tr, L, fmtMoney } = useI18n()
  const ex = EXHIBITOR_BY_ID[id]

  useEffect(() => {
    if (hash === '#products') document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
  }, [hash])

  if (!ex) return <Navigate to="/exhibitors" replace />
  const pav = PAVILIONS[ex.pavilion]

  return (
    <div>
      <div className="h-36 sm:h-44" style={{ background: `linear-gradient(120deg, ${ex.color}, ${ex.color}aa 60%, ${pav.color}88)` }}>
        <div className="mx-auto max-w-6xl px-4 pt-5 sm:px-6">
          <Link to="/exhibitors" className="inline-flex items-center gap-1 rounded-full bg-black/20 px-3 py-1 text-xs font-semibold text-white hover:bg-black/30">
            <ArrowLeft size={14} /> {tr('กลับไปหน้ารายชื่อ', 'Back to directory')}
          </Link>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="-mt-12 w-fit rounded-3xl bg-surface p-1.5 shadow-lg ring-1 ring-line"><OrgAvatar org={ex} size="lg" /></div>
          <div className="flex-1 sm:pt-4">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{L(ex.name)}</h1>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge tone="brand">{L(CATEGORIES[ex.category])}</Badge>
              <Badge tone="neutral">{zoneLabel(ex.pavilion)}</Badge>
              {ex.agency && <Badge tone="accent">{tr('หน่วยงาน', 'Agency')}: {L(AGENCIES[ex.agency].name)}</Badge>}
              <Badge tone="success"><ShieldCheck size={12} /> SME ONE ID {ex.smeOneId}</Badge>
            </div>
          </div>
          <div className="flex gap-2 sm:pt-5">
            <LinkButton to="/matching" icon={<Briefcase size={16} />}>Business Matching</LinkButton>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <Card className="p-5 sm:p-6">
              <h2 className="font-bold">{tr('เกี่ยวกับแบรนด์', 'About the brand')}</h2>
              <p className="mt-2 leading-relaxed text-muted">{L(ex.description)}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {ex.tags.map((t) => <Badge key={t}>#{t}</Badge>)}
              </div>
            </Card>

            <section id="products" className="scroll-mt-24">
              <h2 className="mb-3 text-lg font-bold">e-Catalog · {tr('สินค้า', 'Products')} ({ex.products.length})</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {ex.products.map((p) => (
                  <Card key={p.id} className="flex overflow-hidden">
                    <ProductArt category={ex.category} color={ex.color} className="w-28 shrink-0" />
                    <div className="flex flex-1 flex-col p-4">
                      <div className="font-semibold">{L(p.name)}</div>
                      <div className="text-xs text-muted">{L(p.unit)}</div>
                      <div className="mt-1 text-xl font-extrabold text-brand">{fmtMoney(p.price)}</div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {p.channels.map((c) => <Badge key={c} tone="accent"><ShoppingCart size={11} /> {c}</Badge>)}
                      </div>
                    </div>
                    <div className="hidden flex-col items-center justify-center gap-1 border-l border-line p-3 sm:flex">
                      <QRCodeSVG value={`https://moc-expo.example/p/${p.id}`} size={64} bgColor="transparent" fgColor="currentColor" />
                      <span className="text-[10px] text-muted">{tr('สแกนซื้อ', 'Scan to buy')}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-4">
            <Card className="p-5">
              <div className="text-xs font-semibold uppercase tracking-wide text-muted">{tr('ตำแหน่งบูธ', 'Booth location')}</div>
              <div className="mt-2 flex items-center justify-between">
                <div>
                  <div className="text-3xl font-extrabold" style={{ color: pav.color }}>{ex.booth}</div>
                  <div className="text-sm text-muted">{pav.name}</div>
                </div>
                <LinkButton to={`/floorplan?zone=${ex.pavilion}`} variant="secondary" size="sm" icon={<MapPin size={14} />}>{tr('ดูผัง', 'Map')}</LinkButton>
              </div>
            </Card>
            <Card className="divide-y divide-line">
              <div className="p-5 pb-3 text-xs font-semibold uppercase tracking-wide text-muted">{tr('ติดต่อ', 'Contact')}</div>
              {[
                [User, ex.contact.name],
                [Phone, ex.contact.phone],
                [Mail, ex.contact.email],
                [MessageCircle, `LINE ${ex.contact.line}`],
                [MapPin, L(PROVINCES[ex.province])],
              ].map(([Icon, v]) => {
                const I = Icon as typeof User
                return <div key={v as string} className="flex items-center gap-3 px-5 py-2.5 text-sm"><I size={16} className="text-muted" /> {v as string}</div>
              })}
            </Card>
            <Card className="p-5">
              <div className="text-xs font-semibold uppercase tracking-wide text-muted">{tr('ร้านค้าออนไลน์ & โซเชียล', 'Online stores & social')}</div>
              <div className="mt-3 grid gap-2 text-sm">
                {ex.stores.shopee && <div className="flex items-center gap-2"><ShoppingCart size={15} className="text-[#ee4d2d]" /> {ex.stores.shopee}</div>}
                {ex.stores.lazada && <div className="flex items-center gap-2"><ShoppingCart size={15} className="text-[#0f146d] dark:text-[#8ea0ff]" /> {ex.stores.lazada}</div>}
                {ex.stores.website && <div className="flex items-center gap-2"><Globe size={15} className="text-brand" /> {ex.stores.website}</div>}
                {ex.social.facebook && <div className="flex items-center gap-2 text-muted">Facebook · {ex.social.facebook}</div>}
                {ex.social.instagram && <div className="flex items-center gap-2 text-muted">Instagram · {ex.social.instagram}</div>}
                {ex.social.tiktok && <div className="flex items-center gap-2 text-muted">TikTok · {ex.social.tiktok}</div>}
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  )
}
