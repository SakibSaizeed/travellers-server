// One-off script to top up the travellersDb.services collection with richer sample tour data
// (category, location, price, rating, images, etc.) so the client has more to show and can
// filter/sort/show "related tours". Run with: npm run seed
//
// This is additive (insertMany) — it will NOT delete or modify your existing documents.
// If your client expects different field names than the ones below (e.g. "title" instead of
// "name"), rename the keys in `sampleTours` to match before running.

const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uvdy64o.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });

const sampleTours = [
  {
    name: "Cox's Bazar Beach Getaway",
    category: "Beach",
    location: "Cox's Bazar, Bangladesh",
    price: 12500,
    duration: "3 Days 2 Nights",
    rating: 4.6,
    reviewsCount: 218,
    img: "https://images.unsplash.com/photo-1519046904884-53103b34b206",
    description:
      "Relax on the world's longest natural sea beach with sunrise views, seafood, and a sunset cruise.",
    highlights: ["Longest sea beach", "Sunset boat cruise", "Fresh seafood"],
  },
  {
    name: "Sundarbans Mangrove Safari",
    category: "Wildlife",
    location: "Khulna, Bangladesh",
    price: 15800,
    duration: "4 Days 3 Nights",
    rating: 4.8,
    reviewsCount: 156,
    img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5",
    description:
      "Cruise through the largest mangrove forest in the world in search of the Royal Bengal Tiger.",
    highlights: ["Royal Bengal Tiger spotting", "River cruise", "Local village visit"],
  },
  {
    name: "Sajek Valley Cloud Trek",
    category: "Adventure",
    location: "Rangamati, Bangladesh",
    price: 9200,
    duration: "3 Days 2 Nights",
    rating: 4.7,
    reviewsCount: 302,
    img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
    description:
      "Wake up above the clouds in the 'Queen of Hills' with jeep trails and tribal culture.",
    highlights: ["Cloud-top sunrise", "Jeep safari", "Tribal cuisine"],
  },
  {
    name: "Bandarban Hill Expedition",
    category: "Adventure",
    location: "Bandarban, Bangladesh",
    price: 11000,
    duration: "4 Days 3 Nights",
    rating: 4.5,
    reviewsCount: 174,
    img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
    description:
      "Trek through Nilgiri and Nafakhum waterfall for panoramic hill-tract views.",
    highlights: ["Nilgiri viewpoint", "Nafakhum waterfall", "Waterfall trekking"],
  },
  {
    name: "Sylhet Tea Garden Escape",
    category: "Nature",
    location: "Sylhet, Bangladesh",
    price: 8700,
    duration: "2 Days 1 Night",
    rating: 4.4,
    reviewsCount: 129,
    img: "https://images.unsplash.com/photo-1563911302283-d2bc129e7570",
    description:
      "Wander through rolling tea estates and the crystal-clear Jaflong riverbed.",
    highlights: ["Tea garden walk", "Jaflong riverbed", "Ratargul swamp forest"],
  },
  {
    name: "Maldives Overwater Bliss",
    category: "Beach",
    location: "Maldives",
    price: 145000,
    duration: "5 Days 4 Nights",
    rating: 4.9,
    reviewsCount: 412,
    img: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd",
    description: "Stay in an overwater villa with private snorkeling and coral reef tours.",
    highlights: ["Overwater villa", "Snorkeling", "Private beach dinner"],
  },
  {
    name: "Bali Cultural & Beach Tour",
    category: "Cultural",
    location: "Bali, Indonesia",
    price: 68000,
    duration: "6 Days 5 Nights",
    rating: 4.7,
    reviewsCount: 356,
    img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
    description: "Explore ancient temples, rice terraces, and Bali's iconic beach clubs.",
    highlights: ["Tanah Lot temple", "Tegallalang rice terrace", "Uluwatu sunset"],
  },
  {
    name: "Dubai City Lights",
    category: "City",
    location: "Dubai, UAE",
    price: 92000,
    duration: "4 Days 3 Nights",
    rating: 4.6,
    reviewsCount: 289,
    img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c",
    description: "Desert safari, Burj Khalifa views, and the Dubai Mall fountain show.",
    highlights: ["Burj Khalifa", "Desert safari", "Dubai Mall fountain show"],
  },
  {
    name: "Swiss Alps Scenic Rail Journey",
    category: "Mountain",
    location: "Switzerland",
    price: 210000,
    duration: "7 Days 6 Nights",
    rating: 4.9,
    reviewsCount: 198,
    img: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99",
    description: "Ride scenic alpine trains past glaciers, lakes, and snow-capped peaks.",
    highlights: ["Glacier Express", "Jungfraujoch", "Lake Lucerne"],
  },
  {
    name: "Thailand Island Hopping",
    category: "Beach",
    location: "Phuket, Thailand",
    price: 54000,
    duration: "5 Days 4 Nights",
    rating: 4.6,
    reviewsCount: 271,
    img: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a",
    description: "Hop between Phi Phi, James Bond Island, and Phang Nga Bay by speedboat.",
    highlights: ["Phi Phi Islands", "James Bond Island", "Snorkeling"],
  },
  {
    name: "Paris Romantic Getaway",
    category: "City",
    location: "Paris, France",
    price: 175000,
    duration: "5 Days 4 Nights",
    rating: 4.8,
    reviewsCount: 245,
    img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
    description: "Eiffel Tower, the Louvre, and a Seine river dinner cruise.",
    highlights: ["Eiffel Tower", "Louvre Museum", "Seine river cruise"],
  },
  {
    name: "Kashmir Valley Retreat",
    category: "Mountain",
    location: "Kashmir, India",
    price: 47000,
    duration: "5 Days 4 Nights",
    rating: 4.7,
    reviewsCount: 163,
    img: "https://images.unsplash.com/photo-1566837945700-30057527ade0",
    description: "Shikara rides on Dal Lake and gondola trips through snowy Gulmarg.",
    highlights: ["Dal Lake shikara ride", "Gulmarg gondola", "Houseboat stay"],
  },
  {
    name: "Nepal Himalayan Base Camp Trek",
    category: "Adventure",
    location: "Kathmandu, Nepal",
    price: 63000,
    duration: "8 Days 7 Nights",
    rating: 4.8,
    reviewsCount: 187,
    img: "https://images.unsplash.com/photo-1544735716-392fe2489ffa",
    description: "Trek toward Everest Base Camp through Sherpa villages and alpine forests.",
    highlights: ["Everest views", "Sherpa villages", "Guided trekking"],
  },
  {
    name: "Singapore Family Adventure",
    category: "City",
    location: "Singapore",
    price: 98000,
    duration: "4 Days 3 Nights",
    rating: 4.7,
    reviewsCount: 233,
    img: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd",
    description: "Universal Studios, Gardens by the Bay, and the Sentosa cable car.",
    highlights: ["Universal Studios", "Gardens by the Bay", "Sentosa Island"],
  },
  {
    name: "Sundarban to Sea Cruise",
    category: "Cruise",
    location: "Bay of Bengal, Bangladesh",
    price: 21000,
    duration: "3 Days 2 Nights",
    rating: 4.5,
    reviewsCount: 98,
    img: "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c",
    description: "A relaxed cruise from the mangrove estuary out into the open bay.",
    highlights: ["River-to-sea cruise", "Onboard dining", "Wildlife spotting"],
  },
];

async function seed() {
  try {
    await client.connect();
    const serviceCollection = client.db("travellersDb").collection("services");

    const before = await serviceCollection.countDocuments();
    const result = await serviceCollection.insertMany(sampleTours);
    const after = await serviceCollection.countDocuments();

    console.log(`Inserted ${result.insertedCount} tours.`);
    console.log(`services collection: ${before} -> ${after} documents.`);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

seed();
