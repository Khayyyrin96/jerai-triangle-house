CREATE TABLE "bookings" (
	"id" serial PRIMARY KEY,
	"reference" text NOT NULL UNIQUE,
	"room_id" text NOT NULL,
	"guest_name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text,
	"check_in" date NOT NULL,
	"check_out" date NOT NULL,
	"guests" integer NOT NULL,
	"notes" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "bookings_room_dates_idx" ON "bookings" ("room_id","check_in","check_out");