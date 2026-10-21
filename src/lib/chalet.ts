// All guest-facing chalet content lives here. Edit prices, rooms, facilities
// and contact details in this one file.

export const property = {
  name: 'Jerai Triangle House',
  tagline: 'Riverside A-frame chalets beneath Gunung Jerai',
  location: 'Guar Chempedak, Yan, Kedah',
  rating: 4.4,
  reviewCount: 113,
  whatsapp: '60123456789',
  directions:
    'Take the new road from Guar Chempedak towards Pulau Bunting. We are about 300m from Ais Kacang Salji Guar Chempedak.',
  mapsUrl: 'https://maps.google.com/?q=Jerai+Triangle+House+Guar+Chempedak',
  checkInTime: '3:00 PM',
  checkOutTime: '12:00 PM',
}

/** Netlify Image CDN URL for a file in /public/img. */
export function img(file: string, width: number) {
  return `/.netlify/images?url=/img/${file}&w=${width}&fm=webp&q=78`
}

export type Chalet = {
  id: string
  name: string
  malayName: string
  summary: string
  description: string
  pricePerNight: number
  weekendPrice: number
  maxGuests: number
  beds: string
  size: string
  images: { file: string; alt: string }[]
  amenities: string[]
  highlights: string[]
}

export const chalets: Chalet[] = [
  {
    id: 'riverside',
    name: 'Riverside A-Frame',
    malayName: 'Chalet Tepi Sungai',
    summary:
      'Our signature triangle chalet, steps from the riverbank with a private deck for fishing.',
    description:
      'The chalet that made us known across Kedah. A spacious A-frame with a queen bed and a single bed, full air-conditioning and a tall triangular window framing the river. Step out to your own deck, cast a line for puyu, and watch the light change over Gunung Jerai.',
    pricePerNight: 180,
    weekendPrice: 220,
    maxGuests: 3,
    beds: '1 queen + 1 single',
    size: '22 m²',
    images: [
      { file: 'room-riverside.png', alt: 'Riverside A-Frame bedroom with river view' },
      { file: 'fishing.png', alt: 'Fishing from the riverside deck' },
      { file: 'hero.png', alt: 'Row of triangle chalets along the river' },
    ],
    amenities: [
      'Air-conditioning',
      'Private river deck',
      'Attached bathroom with water heater',
      'Free Wi-Fi',
      'Kettle & mini fridge',
      'Towels & toiletries',
    ],
    highlights: ['Most popular', 'Fishing from deck'],
  },
  {
    id: 'family',
    name: 'Family Loft A-Frame',
    malayName: 'Chalet Keluarga',
    summary:
      'A two-level triangle house with a loft under the roof — room for the whole family.',
    description:
      'Built for family getaways. The ground floor has a queen bed and a small lounge, while the loft under the pitched roof sleeps three more on comfortable mattresses. Kids love the ladder; parents love the quiet mornings on the porch.',
    pricePerNight: 280,
    weekendPrice: 340,
    maxGuests: 6,
    beds: '1 queen + 3 loft mattresses',
    size: '34 m²',
    images: [
      { file: 'room-family.png', alt: 'Family Loft chalet interior with mezzanine' },
      { file: 'bbq.png', alt: 'Evening barbecue outside the chalet' },
      { file: 'hero.png', alt: 'Chalets by the river at sunset' },
    ],
    amenities: [
      'Air-conditioning (both levels)',
      'Loft sleeping area',
      'Lounge with sofa',
      'Attached bathroom with water heater',
      'Free Wi-Fi',
      'BBQ pit access',
      'Kettle & mini fridge',
    ],
    highlights: ['Sleeps 6', 'Great for families'],
  },
  {
    id: 'couple',
    name: 'Jerai View Nest',
    malayName: 'Chalet Pasangan',
    summary:
      'A cosy hideaway for two with a full glass gable facing the mountain mist.',
    description:
      'Wake up to Gunung Jerai through a floor-to-ceiling glass gable. The Nest is our quietest chalet — a queen bed, warm lighting and a small balcony with two chairs, perfect for honeymooners or a slow weekend away.',
    pricePerNight: 200,
    weekendPrice: 240,
    maxGuests: 2,
    beds: '1 queen',
    size: '18 m²',
    images: [
      { file: 'room-couple.png', alt: 'Jerai View Nest with glass gable' },
      { file: 'hero.png', alt: 'Gunung Jerai over the chalets' },
      { file: 'fishing.png', alt: 'Quiet afternoons by the river' },
    ],
    amenities: [
      'Air-conditioning',
      'Mountain-view glass gable',
      'Private balcony',
      'Attached bathroom with water heater',
      'Free Wi-Fi',
      'Fairy-light ambience',
    ],
    highlights: ['Best view', 'Couples'],
  },
  {
    id: 'campsite',
    name: 'Riverside Campsite',
    malayName: 'Tapak Khemah',
    summary:
      'Pitch your tent on the grass by the river, with shared bathrooms and a fire pit.',
    description:
      'Prefer sleeping under the stars? Our grassy campsite sits right on the riverbank with Gunung Jerai on the horizon. Bring your own tent or rent one from us. Price covers one pitch for up to 4 campers, with access to shared bathrooms, electricity points and the campfire area.',
    pricePerNight: 60,
    weekendPrice: 80,
    maxGuests: 4,
    beds: 'Tent pitch (bring or rent)',
    size: 'Grass pitch',
    images: [
      { file: 'camping.png', alt: 'Campsite by the river at dusk' },
      { file: 'bbq.png', alt: 'Barbecue under string lights' },
      { file: 'fishing.png', alt: 'Fishing spot near the campsite' },
    ],
    amenities: [
      'Shared bathrooms',
      'Electricity point',
      'Campfire area',
      'Tent rental available',
      'Parking beside pitch',
    ],
    highlights: ['Budget friendly', 'Groups'],
  },
]

export function getChalet(id: string) {
  return chalets.find((c) => c.id === id)
}

export const facilities = [
  { icon: 'snowflake', label: 'Air-conditioned chalets' },
  { icon: 'wifi', label: 'Free Wi-Fi' },
  { icon: 'car', label: 'Free parking' },
  { icon: 'flame', label: 'BBQ pits' },
  { icon: 'fish', label: 'Riverside fishing spot' },
  { icon: 'tent', label: 'Campsite' },
  { icon: 'shower', label: 'Hot showers' },
  { icon: 'moon', label: 'Surau nearby' },
] as const

export const activities = [
  {
    title: 'Fishing for puyu',
    description:
      'Cast a line straight from the riverbank or your deck. Rods available to borrow — the river is known for puyu (climbing perch).',
    image: 'fishing.png',
  },
  {
    title: 'Camping under Jerai',
    description:
      'Grassy riverside pitches, a shared fire pit and a clear view of Gunung Jerai at sunrise.',
    image: 'camping.png',
  },
  {
    title: 'Evening BBQ',
    description:
      'Fire up the BBQ pit outside your chalet. Charcoal and grill sets can be arranged on request.',
    image: 'bbq.png',
  },
  {
    title: 'Gunung Jerai day trip',
    description:
      'Drive up to the Jerai Geopark summit for cool air, waterfalls and views over the Kedah paddy fields.',
    image: 'hero.png',
  },
]

export const reviews = [
  {
    name: 'Aisyah R.',
    rating: 5,
    text: 'Bilik luas, aircond sejuk, and the triangle design is so cute. Anak-anak enjoy memancing puyu depan chalet!',
  },
  {
    name: 'Hafiz M.',
    rating: 4,
    text: 'Peaceful place by the river, very clean. Owner very helpful with directions. Will come back for camping.',
  },
  {
    name: 'Nurul H.',
    rating: 5,
    text: 'Sunset view with Gunung Jerai in the background is unreal. Perfect weekend getaway from Alor Setar.',
  },
]

export const houseRules = [
  `Check-in from ${property.checkInTime}, check-out by ${property.checkOutTime}`,
  'No smoking inside chalets',
  'Quiet hours from 11:00 PM',
  'Pets on request only',
  'Please keep the riverbank clean',
]
