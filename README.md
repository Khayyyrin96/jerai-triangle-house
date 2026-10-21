# Jerai Triangle House

Booking website for **Jerai Triangle House** — riverside triangle A-frame chalets and a campsite beneath Gunung Jerai in Guar Chempedak, Kedah (4.4★ from 113 Google reviews).

Guests can:

- Browse the four stays (Riverside A-Frame, Family Loft, Jerai View Nest, Riverside Campsite) with photo galleries, beds, capacity and amenities
- See facilities and activities (puyu fishing, camping, BBQ, Gunung Jerai trips)
- Check live availability — per chalet on a two-month calendar, or for every chalet at once on a monthly grid — with each night marked Available, On hold or Booked
- Search a date range and see which chalets are free, with the total price
- Send a booking request that immediately holds the dates, then confirm with the owner on WhatsApp

## Tech

- [TanStack Start](https://tanstack.com/start) (React 19, file-based routing, server functions)
- Tailwind CSS v4 + Radix-based UI components
- [Netlify Database](https://docs.netlify.com) (managed Postgres) via Drizzle ORM for bookings
- Netlify Image CDN for responsive WebP images

## Run locally

```bash
pnpm install
netlify dev        # runs Vite plus local Netlify Database emulation
```

Edit chalet details, prices and contact info in `src/lib/chalet.ts`.

After changing `db/schema.ts`, generate a migration:

```bash
npx drizzle-kit generate --name describe_the_change
```

Migrations are applied automatically on deploy.

## Roadmap

- **Owner dashboard** — a protected page (Netlify Identity) to view requests and mark them confirmed or cancelled
- **Notifications** — email/WhatsApp alert to the owner when a new request arrives
- **Real content** — replace placeholder prices, WhatsApp number, reviews and AI-generated photos with the owner's own
- **Bahasa Melayu toggle** for the full site
