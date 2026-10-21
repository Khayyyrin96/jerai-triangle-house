import {
  date,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'

export const bookings = pgTable(
  'bookings',
  {
    id: serial().primaryKey(),
    reference: text().notNull().unique(),
    roomId: text('room_id').notNull(),
    guestName: text('guest_name').notNull(),
    phone: text().notNull(),
    email: text(),
    // check_out is exclusive: the guest leaves that morning, so the night is free.
    checkIn: date('check_in', { mode: 'string' }).notNull(),
    checkOut: date('check_out', { mode: 'string' }).notNull(),
    guests: integer().notNull(),
    notes: text(),
    status: text().notNull().default('pending'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => [index('bookings_room_dates_idx').on(t.roomId, t.checkIn, t.checkOut)],
)

export type Booking = typeof bookings.$inferSelect
