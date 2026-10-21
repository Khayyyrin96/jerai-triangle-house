import { Link, createFileRoute } from '@tanstack/react-router'
import {
  ArrowRight,
  BedDouble,
  Car,
  Fish,
  Flame,
  MapPin,
  Moon,
  ShowerHead,
  Snowflake,
  Star,
  Tent,
  Users,
  Wifi,
} from 'lucide-react'

import { DateCheck } from '@/components/date-check'
import { whatsappLink } from '@/components/site-chrome'
import { Button } from '@/components/ui/button'
import { activities, chalets, facilities, img, property, reviews } from '@/lib/chalet'
import { todayISO } from '@/lib/dates'

export const Route = createFileRoute('/')({
  loader: () => ({ today: todayISO() }),
  component: Home,
})

const facilityIcons = {
  snowflake: Snowflake,
  wifi: Wifi,
  car: Car,
  flame: Flame,
  fish: Fish,
  tent: Tent,
  shower: ShowerHead,
  moon: Moon,
}

function Stars({ value }: { value: number }) {
  return (
    <span className="flex gap-0.5" aria-label={`${value} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`size-4 ${i < Math.round(value) ? 'fill-accent text-accent' : 'text-border'}`}
        />
      ))}
    </span>
  )
}

function SectionTitle({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <div className="mb-10 max-w-2xl">
      <p className="text-sm font-medium uppercase tracking-widest text-accent">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-semibold md:text-4xl">{title}</h2>
      {intro && <p className="mt-3 text-muted-foreground">{intro}</p>}
    </div>
  )
}

function Home() {
  const { today } = Route.useLoaderData()

  return (
    <>
      {/* Hero */}
      <section className="relative isolate -mt-16 flex min-h-[92vh] items-end overflow-hidden pt-16">
        <img
          src={img('hero.png', 2000)}
          srcSet={`${img('hero.png', 900)} 900w, ${img('hero.png', 1400)} 1400w, ${img('hero.png', 2000)} 2000w`}
          sizes="100vw"
          alt="Triangle A-frame chalets along a river with Gunung Jerai behind"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[oklch(0.2_0.04_150)] via-[oklch(0.2_0.04_150/0.35)] to-transparent" />
        <div className="mx-auto w-full max-w-content px-5 pb-12 text-white md:pb-16">
          <a
            href={property.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-sm backdrop-blur hover:bg-white/25"
          >
            <Star className="size-4 fill-accent text-accent" />
            <strong>{property.rating}</strong> · {property.reviewCount} Google reviews
          </a>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[1.02] md:text-7xl">
            Rumah tiga segi by the river, under Gunung Jerai.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/85">
            Riverside A-frame chalets and a campsite in Guar Chempedak, Kedah. Fish for puyu from
            your deck, fire up the BBQ and wake to mountain mist.
          </p>
          <div className="mt-8 max-w-3xl rounded-2xl bg-card p-4 text-foreground shadow-2xl md:p-5">
            <DateCheck today={today} />
          </div>
        </div>
      </section>

      {/* Chalets */}
      <section id="chalets" className="mx-auto max-w-content scroll-mt-20 px-5 pt-24">
        <SectionTitle
          eyebrow="Our chalets"
          title="Pick your triangle"
          intro="Four ways to stay — from our signature riverside A-frame to a grassy pitch under the stars. Tap any chalet to see photos, facilities and live availability."
        />
        <div className="grid gap-6 md:grid-cols-2">
          {chalets.map((c, i) => (
            <Link
              key={c.id}
              to="/chalets/$chaletId"
              params={{ chaletId: c.id }}
              className="group overflow-hidden rounded-2xl border bg-card transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative overflow-hidden">
                <img
                  src={img(c.images[0].file, 900)}
                  alt={c.images[0].alt}
                  loading={i > 1 ? 'lazy' : undefined}
                  className="aspect-[16/10] w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <span className="absolute top-4 left-4 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold">
                  {c.highlights[0]}
                </span>
              </div>
              <div className="flex items-start justify-between gap-4 p-6">
                <div>
                  <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    {c.malayName}
                  </p>
                  <h3 className="mt-1 text-2xl font-semibold">{c.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{c.summary}</p>
                  <div className="mt-4 flex gap-5 text-sm">
                    <span className="flex items-center gap-1.5">
                      <Users className="size-4 text-accent" /> {c.maxGuests}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <BedDouble className="size-4 text-accent" /> {c.beds}
                    </span>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs text-muted-foreground">from</p>
                  <p className="font-display text-2xl font-semibold">RM {c.pricePerNight}</p>
                  <p className="text-xs text-muted-foreground">/ night</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Facilities */}
      <section id="facilities" className="mt-24 scroll-mt-20 bg-secondary/60 py-20 grain">
        <div className="mx-auto max-w-content px-5">
          <SectionTitle
            eyebrow="Kemudahan"
            title="Everything for an easy stay"
            intro="Simple comforts done well — cold air-con after a hot Kedah day, hot showers in the morning and space to park right by your chalet."
          />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {facilities.map((f) => {
              const Icon = facilityIcons[f.icon]
              return (
                <div key={f.label} className="flex items-center gap-3 rounded-xl bg-card p-4 shadow-sm">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Icon className="size-5" />
                  </span>
                  <span className="text-sm font-medium">{f.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Activities */}
      <section id="activities" className="mx-auto max-w-content scroll-mt-20 px-5 pt-24">
        <SectionTitle
          eyebrow="Aktiviti"
          title="Things to do here"
          intro="Slow days by the water, or adventures up the mountain — it's your call."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {activities.map((a) => (
            <article key={a.title} className="group">
              <div className="overflow-hidden rounded-2xl">
                <img
                  src={img(a.image, 600)}
                  alt={a.title}
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
              <h3 className="mt-4 text-xl font-semibold">{a.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{a.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="mx-auto max-w-content px-5 pt-24">
        <div className="grid gap-10 lg:grid-cols-[320px_1fr]">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-accent">Ulasan</p>
            <p className="mt-2 font-display text-7xl font-semibold">{property.rating}</p>
            <Stars value={property.rating} />
            <p className="mt-2 text-muted-foreground">from {property.reviewCount} Google reviews</p>
            <Button asChild variant="link" className="mt-2 px-0">
              <a href={property.mapsUrl} target="_blank" rel="noreferrer">
                Read all reviews <ArrowRight />
              </a>
            </Button>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {reviews.map((r) => (
              <figure key={r.name} className="flex flex-col rounded-2xl border bg-card p-6">
                <Stars value={r.rating} />
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed">“{r.text}”</blockquote>
                <figcaption className="mt-4 text-sm font-semibold">{r.name}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Location CTA */}
      <section className="mx-auto max-w-content px-5 pt-24">
        <div className="relative overflow-hidden rounded-3xl bg-primary p-8 text-primary-foreground md:p-14">
          <svg
            viewBox="0 0 200 200"
            aria-hidden
            className="absolute -right-10 -bottom-16 size-80 opacity-15"
          >
            <path d="M100 10 190 190H10Z" fill="currentColor" />
          </svg>
          <div className="relative max-w-xl">
            <h2 className="text-3xl font-semibold md:text-4xl">Getting here</h2>
            <p className="mt-4 flex gap-2 text-primary-foreground/85">
              <MapPin className="mt-1 size-5 shrink-0" /> {property.directions}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="secondary" size="lg" className="rounded-full">
                <Link to="/availability">See availability</Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <a href={property.mapsUrl} target="_blank" rel="noreferrer">
                  Open in Google Maps
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="rounded-full hover:bg-white/10 hover:text-primary-foreground"
              >
                <a href={whatsappLink('Hi, I would like to ask about Jerai Triangle House.')} target="_blank" rel="noreferrer">
                  WhatsApp us
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
