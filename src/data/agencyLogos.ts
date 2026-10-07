/** Official organisation logos; source URLs are recorded in docs/agency-logo-sources.json. */
const asset = (file: string) => `${import.meta.env.BASE_URL}images/agencies/${file}`

export const AGENCY_LOGOS: Record<string, string> = {
  DBD: asset('dbd.png'),
  DIP: asset('dip.png'),
  DIT: asset('dit.png'),
  DTN: asset('dtn.png'),
  DFT: asset('dft.png'),
  DITP: asset('ditp.png'),
  SACIT: asset('sacit.svg'),
  GIT: asset('git.png'),
  OPS: asset('ops.png'),
}

export const PARTNER_LOGOS: Record<string, string> = {
  TCG: asset('tcg.png'),
  'Krungthai Bank': asset('ktb.png'),
  'Government Savings Bank': asset('gsb.jpg'),
  'SME D Bank': asset('sme.png'),
  OSMEP: asset('osmep.svg'),
}
