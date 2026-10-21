import { useNavigate } from '@tanstack/react-router'
import { Search } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { addDays } from '@/lib/dates'
import { cn } from '@/lib/utils'

/** Check-in / check-out picker that sends guests to the availability page. */
export function DateCheck({
  today,
  initial,
  className,
}: {
  today: string
  initial?: { checkIn?: string; checkOut?: string }
  className?: string
}) {
  const navigate = useNavigate()
  const [checkIn, setCheckIn] = useState(initial?.checkIn ?? '')
  const [checkOut, setCheckOut] = useState(initial?.checkOut ?? '')

  return (
    <form
      className={cn('grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end', className)}
      onSubmit={(e) => {
        e.preventDefault()
        if (!checkIn || !checkOut) return
        void navigate({ to: '/availability', search: { checkIn, checkOut } })
      }}
    >
      <div className="grid gap-1.5">
        <Label htmlFor="dc-in" className="text-xs uppercase tracking-wide">
          Check-in
        </Label>
        <Input
          id="dc-in"
          type="date"
          required
          min={today}
          value={checkIn}
          onChange={(e) => {
            setCheckIn(e.target.value)
            if (checkOut && checkOut <= e.target.value) setCheckOut(addDays(e.target.value, 1))
          }}
          className="h-11 bg-background"
        />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="dc-out" className="text-xs uppercase tracking-wide">
          Check-out
        </Label>
        <Input
          id="dc-out"
          type="date"
          required
          min={checkIn ? addDays(checkIn, 1) : addDays(today, 1)}
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          className="h-11 bg-background"
        />
      </div>
      <Button type="submit" size="lg" className="h-11 rounded-full px-6">
        <Search /> Check availability
      </Button>
    </form>
  )
}
