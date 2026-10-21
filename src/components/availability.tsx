import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import type { Chalet } from '@/lib/chalet'
import {
  addDays,
  addMonths,
  daysInMonth,
  formatMonth,
  monthStart,
  nightStatus,
  parseISO,
  type BookedRange,
  type NightStatus,
} from '@/lib/dates'
import { cn } from '@/lib/utils'

export type DateRange = { checkIn: string | null; checkOut: string | null }

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

export const statusLabel: Record<NightStatus, string> = {
  available: 'Available',
  pending: 'On hold',
  booked: 'Booked',
  past: 'Past',
}

export function Legend({ className }: { className?: string }) {
  const items: { label: string; className: string }[] = [
    { label: 'Available', className: 'bg-available/25 ring-1 ring-available' },
    { label: 'On hold (pending)', className: 'bg-pending/60' },
    { label: 'Booked', className: 'bg-booked/80' },
    { label: 'Your selection', className: 'bg-primary' },
  ]
  return (
    <div className={cn('flex flex-wrap gap-x-5 gap-y-2 text-xs', className)}>
      {items.map((i) => (
        <span key={i.label} className="flex items-center gap-1.5 text-muted-foreground">
          <span className={cn('size-3 rounded-sm', i.className)} />
          {i.label}
        </span>
      ))}
    </div>
  )
}

function rangeIsFree(
  from: string,
  to: string,
  roomId: string,
  ranges: BookedRange[],
  today: string,
) {
  for (let d = from; d < to; d = addDays(d, 1)) {
    if (nightStatus(d, roomId, ranges, today) !== 'available') return false
  }
  return true
}

/** Two-month calendar for one chalet with check-in / check-out selection. */
export function RoomCalendar({
  roomId,
  ranges,
  today,
  value,
  onChange,
}: {
  roomId: string
  ranges: BookedRange[]
  today: string
  value: DateRange
  onChange: (v: DateRange) => void
}) {
  const [month, setMonth] = useState(monthStart(value.checkIn ?? today))
  const [hover, setHover] = useState<string | null>(null)
  const minMonth = monthStart(today)
  const maxMonth = addMonths(today, 11)

  const selectingCheckout = value.checkIn !== null && value.checkOut === null

  function canPick(date: string) {
    if (selectingCheckout && date > value.checkIn!) {
      return rangeIsFree(value.checkIn!, date, roomId, ranges, today)
    }
    return nightStatus(date, roomId, ranges, today) === 'available'
  }

  function pick(date: string) {
    if (selectingCheckout && date > value.checkIn!) {
      if (rangeIsFree(value.checkIn!, date, roomId, ranges, today)) {
        onChange({ checkIn: value.checkIn, checkOut: date })
        return
      }
    }
    if (nightStatus(date, roomId, ranges, today) === 'available') {
      onChange({ checkIn: date, checkOut: null })
    }
  }

  const previewEnd =
    selectingCheckout && hover && hover > value.checkIn! && canPick(hover)
      ? hover
      : value.checkOut

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <Button
          variant="outline"
          size="icon-sm"
          aria-label="Previous month"
          disabled={month <= minMonth}
          onClick={() => setMonth(addMonths(month, -1))}
        >
          <ChevronLeft />
        </Button>
        <p className="text-sm text-muted-foreground">
          {selectingCheckout ? 'Now pick your check-out date' : 'Pick your check-in date'}
        </p>
        <Button
          variant="outline"
          size="icon-sm"
          aria-label="Next month"
          disabled={addMonths(month, 1) >= maxMonth}
          onClick={() => setMonth(addMonths(month, 1))}
        >
          <ChevronRight />
        </Button>
      </div>
      <div className="grid gap-8 sm:grid-cols-2" onMouseLeave={() => setHover(null)}>
        {[month, addMonths(month, 1)].map((m, i) => (
          <MonthGrid
            key={m}
            month={m}
            className={i === 1 ? 'hidden sm:block' : ''}
            renderDay={(date) => {
              const status = nightStatus(date, roomId, ranges, today)
              const isStart = date === value.checkIn
              const isEnd = date === previewEnd
              const inRange =
                value.checkIn !== null &&
                previewEnd !== null &&
                date > value.checkIn &&
                date < previewEnd
              const clickable = canPick(date)
              return (
                <button
                  type="button"
                  disabled={!clickable}
                  onClick={() => pick(date)}
                  onMouseEnter={() => setHover(date)}
                  title={statusLabel[status]}
                  className={cn(
                    'relative flex aspect-square w-full items-center justify-center rounded-md text-sm transition-colors',
                    status === 'available' && 'bg-available/15 hover:bg-available/35',
                    status === 'pending' && 'bg-pending/50 text-foreground/70',
                    status === 'booked' && 'bg-booked/75 text-white line-through decoration-white/60',
                    status === 'past' && 'text-muted-foreground/40',
                    clickable && status !== 'available' && 'cursor-pointer ring-1 ring-primary/40',
                    !clickable && 'cursor-not-allowed',
                    inRange && 'bg-primary/20 text-foreground no-underline',
                    (isStart || isEnd) && 'bg-primary font-semibold text-primary-foreground no-underline',
                  )}
                >
                  {parseISO(date).getUTCDate()}
                </button>
              )
            }}
          />
        ))}
      </div>
    </div>
  )
}

function MonthGrid({
  month,
  renderDay,
  className,
}: {
  month: string
  renderDay: (date: string) => React.ReactNode
  className?: string
}) {
  // Monday-first offset.
  const offset = (parseISO(month).getUTCDay() + 6) % 7
  const days = Array.from({ length: daysInMonth(month) }, (_, i) => addDays(month, i))
  return (
    <div className={className}>
      <h4 className="mb-3 text-center font-display text-base font-semibold">
        {formatMonth(month)}
      </h4>
      <div className="grid grid-cols-7 gap-1">
        {WEEKDAYS.map((d) => (
          <div key={d} className="pb-1 text-center text-[11px] font-medium uppercase text-muted-foreground">
            {d}
          </div>
        ))}
        {Array.from({ length: offset }, (_, i) => (
          <div key={`pad-${i}`} />
        ))}
        {days.map((d) => (
          <div key={d}>{renderDay(d)}</div>
        ))}
      </div>
    </div>
  )
}

/** Month overview: one row per chalet, one column per night. */
export function OverviewGrid({
  chalets,
  ranges,
  today,
  month,
  onPick,
}: {
  chalets: Chalet[]
  ranges: BookedRange[]
  today: string
  month: string
  onPick: (roomId: string, date: string) => void
}) {
  const days = Array.from({ length: daysInMonth(month) }, (_, i) => addDays(month, i))
  return (
    <div className="overflow-x-auto rounded-xl border bg-card">
      <table className="w-full border-separate border-spacing-0 text-xs">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 min-w-40 border-b bg-card p-3 text-left font-display text-sm font-semibold">
              Chalet
            </th>
            {days.map((d) => {
              const date = parseISO(d)
              const weekend = date.getUTCDay() === 5 || date.getUTCDay() === 6
              return (
                <th
                  key={d}
                  className={cn(
                    'min-w-8 border-b px-0.5 py-2 text-center font-medium',
                    weekend ? 'text-accent' : 'text-muted-foreground',
                  )}
                >
                  <div className="text-[10px] uppercase">
                    {date.toLocaleDateString('en-MY', { weekday: 'narrow', timeZone: 'UTC' })}
                  </div>
                  <div className="text-sm text-foreground">{date.getUTCDate()}</div>
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {chalets.map((c) => (
            <tr key={c.id}>
              <th className="sticky left-0 z-10 border-b bg-card p-3 text-left text-sm font-medium">
                {c.name}
              </th>
              {days.map((d) => {
                const status = nightStatus(d, c.id, ranges, today)
                return (
                  <td key={d} className="border-b p-0.5">
                    <button
                      type="button"
                      disabled={status !== 'available'}
                      onClick={() => onPick(c.id, d)}
                      title={`${c.name} · ${d} · ${statusLabel[status]}`}
                      aria-label={`${c.name} ${d} ${statusLabel[status]}`}
                      className={cn(
                        'block h-9 w-full rounded transition-colors',
                        status === 'available' &&
                          'bg-available/20 hover:bg-available/50 cursor-pointer',
                        status === 'pending' && 'bg-pending/60',
                        status === 'booked' && 'bg-booked/80',
                        status === 'past' && 'bg-muted/60',
                      )}
                    />
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
