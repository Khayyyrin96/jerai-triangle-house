import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { CheckCircle2, ChevronLeft, ChevronRight, XCircle } from 'lucide-react'
import { useState } from 'react'
import { z } from 'zod'

import { Legend, OverviewGrid } from '@/components/availability'
import { DateCheck } from '@/components/date-check'
import { Button } from '@/components/ui/button'
import { getBookedRanges } from '@/lib/bookings.functions'
import { chalets, img, property } from '@/lib/chalet'
import {
  addDays,
  addMonths,
  formatDate,
  formatMonth,
  monthStart,
  nightStatus,
  nightsBetween,
  quote,
  todayISO,
  type BookedRange,
} from '@/lib/dates'

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/)

export const Route = createFileRoute('/availability')({
  validateSearch: z.object({
    checkIn: isoDate.optional().catch(undefined),
    checkOut: isoDate.optional().catch(undefined),
  }),
  loader: async () => {
    const today = todayISO()
    const ranges = await getBookedRanges({ data: { from: today, to: addDays(today, 370) } })
    return { ranges, today }
  },
  head: () => ({
    meta: [{ title: `Availability · ${property.name}` }],
  }),
  component: AvailabilityPage,
})

function isFree(roomId: string, from: string, to: string, ranges: BookedRange[], today: string) {
  for (let d = from; d < to; d = addDays(d, 1)) {
    if (nightStatus(d, roomId, ranges, today) !== 'available') return false
  }
  return true
}

function AvailabilityPage() {
  const { ranges, today } = Route.useLoaderData()
  const { checkIn, checkOut } = Route.useSearch()
  const navigate = useNavigate()
  const [month, setMonth] = useState(monthStart(checkIn ?? today))

  const hasQuery = checkIn && checkOut && checkOut > checkIn && checkIn >= today
  const nights = hasQuery ? nightsBetween(checkIn, checkOut) : 0

  return (
    <div className="mx-auto max-w-content px-5 pt-10">
      <p className="text-sm font-medium uppercase tracking-widest text-accent">Kekosongan</p>
      <h1 className="mt-1 text-4xl font-semibold md:text-5xl">Check availability</h1>
      <p className="mt-3 max-w-reading text-muted-foreground">
        See which chalets are free at a glance. Pick your dates, or tap any green night in the
        calendar to start a booking.
      </p>

      <div className="mt-8 rounded-2xl border bg-card p-5 md:p-6">
        <DateCheck key={`${checkIn}-${checkOut}`} today={today} initial={{ checkIn, checkOut }} />
      </div>

      {hasQuery && (
        <section className="mt-8">
          <h2 className="mb-4 text-xl font-semibold">
            {formatDate(checkIn)} → {formatDate(checkOut)}
            <span className="ml-2 font-sans text-base font-normal text-muted-foreground">
              {nights} night{nights > 1 ? 's' : ''}
            </span>
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {chalets.map((c) => {
              const free = isFree(c.id, checkIn, checkOut, ranges, today)
              return (
                <div
                  key={c.id}
                  className={`overflow-hidden rounded-xl border bg-card ${free ? '' : 'opacity-70'}`}
                >
                  <img
                    src={img(c.images[0].file, 500)}
                    alt={c.name}
                    className={`aspect-[16/10] w-full object-cover ${free ? '' : 'grayscale'}`}
                  />
                  <div className="space-y-3 p-4">
                    <div>
                      <p className="font-display font-semibold">{c.name}</p>
                      <p
                        className={`mt-1 flex items-center gap-1.5 text-sm font-medium ${free ? 'text-primary' : 'text-booked'}`}
                      >
                        {free ? <CheckCircle2 className="size-4" /> : <XCircle className="size-4" />}
                        {free ? 'Available' : 'Taken for some of these nights'}
                      </p>
                    </div>
                    {free ? (
                      <Button asChild size="sm" className="w-full rounded-full">
                        <Link
                          to="/chalets/$chaletId"
                          params={{ chaletId: c.id }}
                          search={{ checkIn }}
                          hash="calendar"
                        >
                          Book · RM {quote(checkIn, checkOut, c)}
                        </Link>
                      </Button>
                    ) : (
                      <Button asChild size="sm" variant="outline" className="w-full rounded-full">
                        <Link to="/chalets/$chaletId" params={{ chaletId: c.id }} hash="calendar">
                          See other dates
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      <section className="mt-12">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Previous month"
              disabled={month <= monthStart(today)}
              onClick={() => setMonth(addMonths(month, -1))}
            >
              <ChevronLeft />
            </Button>
            <h2 className="min-w-44 text-center text-2xl font-semibold">{formatMonth(month)}</h2>
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Next month"
              disabled={month >= addMonths(today, 11)}
              onClick={() => setMonth(addMonths(month, 1))}
            >
              <ChevronRight />
            </Button>
          </div>
          <Legend className="[&>span:last-child]:hidden" />
        </div>
        <OverviewGrid
          chalets={chalets}
          ranges={ranges}
          today={today}
          month={month}
          onPick={(roomId, date) =>
            void navigate({
              to: '/chalets/$chaletId',
              params: { chaletId: roomId },
              search: { checkIn: date },
              hash: 'calendar',
            })
          }
        />
        <p className="mt-3 text-xs text-muted-foreground">
          Each square is one night. Friday & Saturday nights are highlighted and use the weekend
          rate.
        </p>
      </section>
    </div>
  )
}
