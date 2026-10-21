// Dates are handled as 'YYYY-MM-DD' strings and computed in UTC so that
// server and browser agree on which night is which.

export function toISO(d: Date) {
  return d.toISOString().slice(0, 10)
}

export function parseISO(s: string) {
  return new Date(`${s}T00:00:00Z`)
}

export function addDays(s: string, n: number) {
  const d = parseISO(s)
  d.setUTCDate(d.getUTCDate() + n)
  return toISO(d)
}

/** Today in Malaysia (UTC+8). */
export function todayISO() {
  return toISO(new Date(Date.now() + 8 * 60 * 60 * 1000))
}

export function nightsBetween(checkIn: string, checkOut: string) {
  return Math.round(
    (parseISO(checkOut).getTime() - parseISO(checkIn).getTime()) / 86_400_000,
  )
}

export function monthStart(s: string) {
  return `${s.slice(0, 7)}-01`
}

export function addMonths(s: string, n: number) {
  const d = parseISO(monthStart(s))
  d.setUTCMonth(d.getUTCMonth() + n)
  return toISO(d)
}

export function daysInMonth(s: string) {
  const d = parseISO(monthStart(s))
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate()
}

export function formatDate(s: string, opts?: Intl.DateTimeFormatOptions) {
  return parseISO(s).toLocaleDateString('en-MY', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
    ...opts,
  })
}

export function formatMonth(s: string) {
  return parseISO(s).toLocaleDateString('en-MY', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

/** Friday and Saturday nights use the weekend rate. */
export function isWeekendNight(s: string) {
  const day = parseISO(s).getUTCDay()
  return day === 5 || day === 6
}

export type NightStatus = 'available' | 'pending' | 'booked' | 'past'

export type BookedRange = {
  roomId: string
  checkIn: string
  checkOut: string
  status: string
}

/** Status of a single night (the night starting on `date`) for a room. */
export function nightStatus(
  date: string,
  roomId: string,
  ranges: BookedRange[],
  today: string,
): NightStatus {
  if (date < today) return 'past'
  const hit = ranges.find(
    (r) => r.roomId === roomId && r.checkIn <= date && date < r.checkOut,
  )
  if (!hit) return 'available'
  return hit.status === 'confirmed' ? 'booked' : 'pending'
}

export function quote(
  checkIn: string,
  checkOut: string,
  rates: { pricePerNight: number; weekendPrice: number },
) {
  let total = 0
  for (let d = checkIn; d < checkOut; d = addDays(d, 1)) {
    total += isWeekendNight(d) ? rates.weekendPrice : rates.pricePerNight
  }
  return total
}
