import { useRouter } from '@tanstack/react-router'
import { CalendarCheck, Loader2, MessageCircle, Minus, Plus } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { whatsappLink } from '@/components/site-chrome'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createBooking } from '@/lib/bookings.functions'
import type { Chalet } from '@/lib/chalet'
import { formatDate, nightsBetween, quote } from '@/lib/dates'
import type { DateRange } from '@/components/availability'

type Confirmation = { reference: string; total: number; nights: number }

export function BookingForm({
  chalet,
  range,
  onClear,
}: {
  chalet: Chalet
  range: DateRange
  onClear: () => void
}) {
  const router = useRouter()
  const [guests, setGuests] = useState(Math.min(2, chalet.maxGuests))
  const [form, setForm] = useState({ guestName: '', phone: '', email: '', notes: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState<Confirmation | null>(null)

  const ready = range.checkIn !== null && range.checkOut !== null
  const nights = ready ? nightsBetween(range.checkIn!, range.checkOut!) : 0
  const total = ready ? quote(range.checkIn!, range.checkOut!, chalet) : 0

  function update(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!ready) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await createBooking({
        data: {
          roomId: chalet.id,
          checkIn: range.checkIn!,
          checkOut: range.checkOut!,
          guests,
          ...form,
        },
      })
      if (res.ok) {
        setDone(res)
        await router.invalidate()
      } else {
        setError(res.error)
      }
    } catch (err) {
      const issue = err instanceof Error ? err.message : ''
      setError(
        issue.includes('phone')
          ? 'Please enter a valid phone number.'
          : issue.includes('email')
            ? 'Please enter a valid email address.'
            : 'Please check your details and try again.',
      )
      toast.error('We could not send your request.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <form onSubmit={submit} className="space-y-5">
        <div className="grid grid-cols-2 overflow-hidden rounded-lg border">
          <div className="border-r p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Check-in
            </p>
            <p className="mt-0.5 font-medium">
              {range.checkIn ? formatDate(range.checkIn) : 'Select date'}
            </p>
          </div>
          <div className="p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Check-out
            </p>
            <p className="mt-0.5 font-medium">
              {range.checkOut ? formatDate(range.checkOut) : 'Select date'}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Label>Guests</Label>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              aria-label="Fewer guests"
              disabled={guests <= 1}
              onClick={() => setGuests((g) => g - 1)}
            >
              <Minus />
            </Button>
            <span className="w-6 text-center font-semibold">{guests}</span>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              aria-label="More guests"
              disabled={guests >= chalet.maxGuests}
              onClick={() => setGuests((g) => g + 1)}
            >
              <Plus />
            </Button>
          </div>
        </div>

        <div className="grid gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="guestName">Full name</Label>
            <Input id="guestName" required minLength={2} value={form.guestName} onChange={update('guestName')} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="phone">Phone / WhatsApp</Label>
            <Input id="phone" type="tel" required placeholder="012-345 6789" value={form.phone} onChange={update('phone')} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="email">
              Email <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input id="email" type="email" value={form.email} onChange={update('email')} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="notes">
              Notes <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="notes"
              rows={2}
              placeholder="Arrival time, BBQ set, extra mattress…"
              value={form.notes}
              onChange={update('notes')}
            />
          </div>
        </div>

        {ready && (
          <div className="space-y-1.5 rounded-lg bg-muted p-4 text-sm">
            <div className="flex justify-between">
              <span>
                {nights} night{nights > 1 ? 's' : ''}
              </span>
              <span>RM {total}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Weekday RM {chalet.pricePerNight} · Fri & Sat RM {chalet.weekendPrice}. Pay on
              confirmation.
            </p>
          </div>
        )}

        {error && (
          <p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </p>
        )}

        <Button type="submit" size="lg" className="w-full rounded-full" disabled={!ready || submitting}>
          {submitting ? <Loader2 className="animate-spin" /> : <CalendarCheck />}
          {ready ? `Request booking · RM ${total}` : 'Select dates to book'}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Your dates are held while we confirm with you on WhatsApp.
        </p>
      </form>

      <Dialog
        open={done !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDone(null)
            onClear()
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Terima kasih! 🌿</DialogTitle>
            <DialogDescription>
              Your request for <strong>{chalet.name}</strong> is in and those dates are now on hold.
            </DialogDescription>
          </DialogHeader>
          {done && (
            <div className="space-y-2 rounded-lg bg-muted p-4 text-sm">
              <p>
                Reference: <strong className="font-mono">{done.reference}</strong>
              </p>
              <p>
                {formatDate(range.checkIn!)} → {formatDate(range.checkOut!)} · {done.nights} night
                {done.nights > 1 ? 's' : ''} · {guests} guest{guests > 1 ? 's' : ''}
              </p>
              <p>
                Estimated total: <strong>RM {done.total}</strong>
              </p>
            </div>
          )}
          <DialogFooter>
            {done && (
              <Button asChild className="rounded-full">
                <a
                  href={whatsappLink(
                    `Hi! I just requested ${chalet.name} (${done.reference}) from ${range.checkIn} to ${range.checkOut} for ${guests} guest(s).`,
                  )}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle /> Confirm on WhatsApp
                </a>
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
