import { createServerFn } from '@tanstack/react-start'
import { and, eq, gt, lt, ne } from 'drizzle-orm'
import { z } from 'zod'

import { db } from '../../db/index.js'
import { bookings } from '../../db/schema.js'
import { chalets, getChalet } from './chalet'
import { addDays, nightsBetween, quote, todayISO } from './dates'

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date')

const MAX_NIGHTS = 14
const MAX_WINDOW_DAYS = 400

/** Booked nights for every chalet in a date window. Guest details are never returned. */
export const getBookedRanges = createServerFn({ method: 'GET' })
  .validator(z.object({ from: isoDate, to: isoDate }))
  .handler(async ({ data }) => {
    const to =
      data.to > addDays(data.from, MAX_WINDOW_DAYS)
        ? addDays(data.from, MAX_WINDOW_DAYS)
        : data.to
    return db
      .select({
        roomId: bookings.roomId,
        checkIn: bookings.checkIn,
        checkOut: bookings.checkOut,
        status: bookings.status,
      })
      .from(bookings)
      .where(
        and(
          lt(bookings.checkIn, to),
          gt(bookings.checkOut, data.from),
          ne(bookings.status, 'cancelled'),
        ),
      )
  })

const bookingInput = z.object({
  roomId: z.enum(chalets.map((c) => c.id) as [string, ...string[]]),
  checkIn: isoDate,
  checkOut: isoDate,
  guests: z.number().int().min(1).max(10),
  guestName: z.string().trim().min(2, 'Please enter your name').max(100),
  phone: z
    .string()
    .trim()
    .regex(/^[+\d][\d\s-]{7,18}$/, 'Please enter a valid phone number'),
  email: z.union([z.literal(''), z.email().max(200)]).optional(),
  notes: z.string().trim().max(1000).optional(),
})

export type BookingInput = z.infer<typeof bookingInput>

type BookingResult =
  | { ok: true; reference: string; total: number; nights: number }
  | { ok: false; error: string }

function makeReference() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let out = ''
  for (const b of crypto.getRandomValues(new Uint8Array(6))) {
    out += alphabet[b % alphabet.length]
  }
  return `JTH-${out}`
}

export const createBooking = createServerFn({ method: 'POST' })
  .validator(bookingInput)
  .handler(async ({ data }): Promise<BookingResult> => {
    const chalet = getChalet(data.roomId)!
    const nights = nightsBetween(data.checkIn, data.checkOut)

    if (data.checkIn < todayISO()) {
      return { ok: false, error: 'Check-in date has already passed.' }
    }
    if (nights < 1) {
      return { ok: false, error: 'Check-out must be after check-in.' }
    }
    if (nights > MAX_NIGHTS) {
      return {
        ok: false,
        error: `Online requests are limited to ${MAX_NIGHTS} nights. Please WhatsApp us for longer stays.`,
      }
    }
    if (data.guests > chalet.maxGuests) {
      return {
        ok: false,
        error: `${chalet.name} sleeps up to ${chalet.maxGuests} guests.`,
      }
    }

    const clash = await db
      .select({ id: bookings.id })
      .from(bookings)
      .where(
        and(
          eq(bookings.roomId, data.roomId),
          lt(bookings.checkIn, data.checkOut),
          gt(bookings.checkOut, data.checkIn),
          ne(bookings.status, 'cancelled'),
        ),
      )
      .limit(1)

    if (clash.length > 0) {
      return {
        ok: false,
        error: 'Sorry, some of those nights were just taken. Please pick other dates.',
      }
    }

    const reference = makeReference()
    await db.insert(bookings).values({
      reference,
      roomId: data.roomId,
      guestName: data.guestName,
      phone: data.phone,
      email: data.email || null,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      guests: data.guests,
      notes: data.notes || null,
    })

    return { ok: true, reference, nights, total: quote(data.checkIn, data.checkOut, chalet) }
  })
