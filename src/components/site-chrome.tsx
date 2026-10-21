import { Link } from '@tanstack/react-router'
import { MapPin, MessageCircle, Star } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { property } from '@/lib/chalet'

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 32 32" className="size-8" aria-hidden>
        <path d="M16 3 29 28H3Z" fill="var(--primary)" />
        <path d="M16 13 22 28H10Z" fill="var(--accent)" />
      </svg>
      <span className="font-display text-lg font-semibold leading-none">
        Jerai Triangle House
      </span>
    </Link>
  )
}

export function whatsappLink(text: string) {
  return `https://wa.me/${property.whatsapp}?text=${encodeURIComponent(text)}`
}

export function SiteHeader() {
  const navClass =
    'text-sm font-medium text-foreground/70 hover:text-foreground transition-colors'
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-content items-center justify-between px-5">
        <Logo />
        <nav className="hidden items-center gap-7 md:flex">
          <Link to="/" hash="chalets" className={navClass}>
            Chalets
          </Link>
          <Link to="/" hash="facilities" className={navClass}>
            Facilities
          </Link>
          <Link to="/" hash="activities" className={navClass}>
            Activities
          </Link>
          <Link
            to="/availability"
            className={navClass}
            activeProps={{ className: 'text-foreground' }}
          >
            Availability
          </Link>
        </nav>
        <Button asChild size="sm" className="rounded-full px-4">
          <Link to="/availability">Book now</Link>
        </Button>
      </div>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-content gap-10 px-5 py-14 md:grid-cols-3">
        <div className="space-y-3">
          <Logo className="[&_path:first-child]:fill-primary-foreground" />
          <p className="max-w-xs text-sm text-primary-foreground/75">
            {property.tagline}. A quiet stay in {property.location}.
          </p>
          <p className="flex items-center gap-1.5 text-sm">
            <Star className="size-4 fill-current text-accent" />
            {property.rating} · {property.reviewCount} Google reviews
          </p>
        </div>
        <div className="space-y-2 text-sm">
          <h3 className="mb-3 font-display text-base">Find us</h3>
          <p className="flex gap-2 text-primary-foreground/80">
            <MapPin className="mt-0.5 size-4 shrink-0" />
            {property.directions}
          </p>
          <a
            href={property.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-block underline underline-offset-4"
          >
            Open in Google Maps
          </a>
        </div>
        <div className="space-y-3 text-sm">
          <h3 className="mb-3 font-display text-base">Questions?</h3>
          <p className="text-primary-foreground/80">
            Check-in {property.checkInTime} · Check-out {property.checkOutTime}
          </p>
          <Button asChild variant="secondary" size="sm" className="rounded-full">
            <a
              href={whatsappLink('Hi Jerai Triangle House, I have a question.')}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle /> WhatsApp us
            </a>
          </Button>
        </div>
      </div>
      <div className="border-t border-primary-foreground/15 py-5 text-center text-xs text-primary-foreground/60">
        © {new Date().getFullYear()} Jerai Triangle House · Guar Chempedak, Kedah
      </div>
    </footer>
  )
}
