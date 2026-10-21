import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { ArrowLeft, BedDouble, Check, Maximize2, Users } from 'lucide-react'
import { useState } from 'react'
import { z } from 'zod'

import { Legend, RoomCalendar, type DateRange } from '@/components/availability'
import { BookingForm } from '@/components/booking-form'
import { Badge } from '@/components/ui/badge'
import { getBookedRanges } from '@/lib/bookings.functions'
import { chalets, getChalet, houseRules, img, property } from '@/lib/chalet'
import { addDays, todayISO } from '@/lib/dates'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/chalets/$chaletId')({
  validateSearch: z.object({
    checkIn: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional()
      .catch(undefined),
  }),
  loader: async ({ params }) => {
    const chalet = getChalet(params.chaletId)
    if (!chalet) throw notFound()
    const today = todayISO()
    const ranges = await getBookedRanges({ data: { from: today, to: addDays(today, 370) } })
    return { chalet, ranges, today }
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.chalet.name} · ${property.name}` },
          { name: 'description', content: loaderData.chalet.summary },
        ]
      : [],
  }),
  component: ChaletPage,
})

function ChaletPage() {
  const { chalet } = Route.useLoaderData()
  // Remount per chalet so gallery and date selection start fresh.
  return <ChaletView key={chalet.id} />
}

function ChaletView() {
  const { chalet, ranges, today } = Route.useLoaderData()
  const { checkIn } = Route.useSearch()
  const [active, setActive] = useState(0)
  const [range, setRange] = useState<DateRange>({
    checkIn: checkIn && checkIn >= today ? checkIn : null,
    checkOut: null,
  })

  return (
    <div className="mx-auto max-w-content px-5 pt-8">
      <Link
        to="/"
        hash="chalets"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> All chalets
      </Link>

      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-accent">
            {chalet.malayName}
          </p>
          <h1 className="mt-1 text-4xl font-semibold md:text-5xl">{chalet.name}</h1>
        </div>
        <div className="flex gap-2">
          {chalet.highlights.map((h) => (
            <Badge key={h} variant="secondary" className="rounded-full px-3 py-1">
              {h}
            </Badge>
          ))}
        </div>
      </div>

      {/* Gallery */}
      <div className="grid gap-3 md:grid-cols-[1fr_180px]">
        <div className="overflow-hidden rounded-2xl bg-muted">
          <img
            key={chalet.images[active].file}
            src={img(chalet.images[active].file, 1400)}
            alt={chalet.images[active].alt}
            className="aspect-[4/3] w-full animate-in fade-in object-cover duration-500 md:aspect-[16/10]"
          />
        </div>
        <div className="grid grid-cols-3 gap-3 md:grid-cols-1">
          {chalet.images.map((image, i) => (
            <button
              key={image.file + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show photo: ${image.alt}`}
              className={cn(
                'overflow-hidden rounded-xl ring-offset-2 ring-offset-background transition',
                i === active ? 'ring-2 ring-primary' : 'opacity-70 hover:opacity-100',
              )}
            >
              <img src={img(image.file, 400)} alt="" className="aspect-[4/3] h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_400px]">
        <div className="space-y-12">
          <section>
            <div className="mb-6 flex flex-wrap gap-6 text-sm">
              <span className="flex items-center gap-2">
                <Users className="size-4 text-accent" /> Up to {chalet.maxGuests} guests
              </span>
              <span className="flex items-center gap-2">
                <BedDouble className="size-4 text-accent" /> {chalet.beds}
              </span>
              <span className="flex items-center gap-2">
                <Maximize2 className="size-4 text-accent" /> {chalet.size}
              </span>
            </div>
            <p className="max-w-reading text-lg leading-relaxed text-foreground/80">
              {chalet.description}
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">What's included</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {chalet.amenities.map((a) => (
                <li key={a} className="flex items-center gap-3 rounded-lg border bg-card p-3 text-sm">
                  <span className="flex size-7 items-center justify-center rounded-full bg-available/20 text-primary">
                    <Check className="size-4" />
                  </span>
                  {a}
                </li>
              ))}
            </ul>
          </section>

          <section id="calendar" className="rounded-2xl border bg-card p-5 md:p-7">
            <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="text-2xl font-semibold">Availability</h2>
              <Legend />
            </div>
            <RoomCalendar
              roomId={chalet.id}
              ranges={ranges}
              today={today}
              value={range}
              onChange={setRange}
            />
            {range.checkIn && (
              <button
                type="button"
                onClick={() => setRange({ checkIn: null, checkOut: null })}
                className="mt-4 text-sm text-muted-foreground underline underline-offset-4"
              >
                Clear dates
              </button>
            )}
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">Good to know</h2>
            <ul className="space-y-2 text-sm text-foreground/80">
              {houseRules.map((r) => (
                <li key={r} className="flex gap-2">
                  <span className="text-accent">▲</span> {r}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <p className="mb-5">
              <span className="font-display text-3xl font-semibold">RM {chalet.pricePerNight}</span>
              <span className="text-muted-foreground"> / night</span>
              <span className="block text-xs text-muted-foreground">
                RM {chalet.weekendPrice} on Friday & Saturday nights
              </span>
            </p>
            <BookingForm
              chalet={chalet}
              range={range}
              onClear={() => setRange({ checkIn: null, checkOut: null })}
            />
          </div>
        </aside>
      </div>

      <section className="mt-20">
        <h2 className="mb-6 text-2xl font-semibold">Other places to stay</h2>
        <div className="grid gap-5 sm:grid-cols-3">
          {chalets
            .filter((c) => c.id !== chalet.id)
            .map((c) => (
              <Link
                key={c.id}
                to="/chalets/$chaletId"
                params={{ chaletId: c.id }}
                className="group overflow-hidden rounded-xl border bg-card"
              >
                <img
                  src={img(c.images[0].file, 600)}
                  alt={c.name}
                  className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="p-4">
                  <p className="font-display font-semibold">{c.name}</p>
                  <p className="text-sm text-muted-foreground">From RM {c.pricePerNight} / night</p>
                </div>
              </Link>
            ))}
        </div>
      </section>
    </div>
  )
}
