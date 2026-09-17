// One-off script to top up the travellersDb.services collection with more sample tour
// packages. Field names match what the travellers-client React app already reads
// (packageName, destination, price, description) plus category/rating/img, which the
// client now also reads for category badges, star ratings, and real per-tour photos.
// Run with: npm run seed
//
// This is additive (insertMany) — it will NOT delete or modify your existing documents.

const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uvdy64o.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });

const sampleTours = [
  {
    packageName: "Cox's Bazar Beach Getaway",
    destination: "Cox's Bazar, Bangladesh",
    category: "Beach",
    price: 12500,
    rating: 4.6,
    img: "https://images.unsplash.com/photo-1519046904884-53103b34b206",
    description:
      "Relax on the world's longest natural sea beach with sunrise views, seafood, and a sunset cruise.",
  },
  {
    packageName: "Sundarbans Mangrove Safari",
    destination: "Khulna, Bangladesh",
    category: "Wildlife",
    price: 15800,
    rating: 4.8,
    img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5",
    description:
      "Cruise through the largest mangrove forest in the world in search of the Royal Bengal Tiger.",
  },
  {
    packageName: "Sajek Valley Cloud Trek",
    destination: "Rangamati, Bangladesh",
    category: "Adventure",
    price: 9200,
    rating: 4.7,
    img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
    description:
      "Wake up above the clouds in the 'Queen of Hills' with jeep trails and tribal culture.",
  },
  {
    packageName: "Bandarban Hill Expedition",
    destination: "Bandarban, Bangladesh",
    category: "Adventure",
    price: 11000,
    rating: 4.5,
    img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
    description: "Trek through Nilgiri and Nafakhum waterfall for panoramic hill-tract views.",
  },
  {
    packageName: "Sylhet Tea Garden Escape",
    destination: "Sylhet, Bangladesh",
    category: "Nature",
    price: 8700,
    rating: 4.4,
    img: "https://images.unsplash.com/photo-1563911302283-d2bc129e7570",
    description: "Wander through rolling tea estates and the crystal-clear Jaflong riverbed.",
  },
  {
    packageName: "Sreemangal Tea Trail",
    destination: "Sreemangal, Bangladesh",
    category: "Nature",
    price: 7600,
    rating: 4.5,
    img: "https://images.unsplash.com/photo-1500817487388-039e623edc73",
    description: "Sip seven-layer tea and cycle through emerald tea gardens and lemon groves.",
  },
  {
    packageName: "Maldives Overwater Bliss",
    destination: "Maldives",
    category: "Beach",
    price: 145000,
    rating: 4.9,
    img: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd",
    description: "Stay in an overwater villa with private snorkeling and coral reef tours.",
  },
  {
    packageName: "Bali Cultural & Beach Tour",
    destination: "Bali, Indonesia",
    category: "Cultural",
    price: 68000,
    rating: 4.7,
    img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
    description: "Explore ancient temples, rice terraces, and Bali's iconic beach clubs.",
  },
  {
    packageName: "Dubai City Lights",
    destination: "Dubai, UAE",
    category: "City",
    price: 92000,
    rating: 4.6,
    img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c",
    description: "Desert safari, Burj Khalifa views, and the Dubai Mall fountain show.",
  },
  {
    packageName: "Thailand Island Hopping",
    destination: "Phuket, Thailand",
    category: "Beach",
    price: 54000,
    rating: 4.6,
    img: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a",
    description: "Hop between Phi Phi, James Bond Island, and Phang Nga Bay by speedboat.",
  },
  {
    packageName: "Kashmir Valley Retreat",
    destination: "Kashmir, India",
    category: "Mountain",
    price: 47000,
    rating: 4.7,
    img: "https://images.unsplash.com/photo-1566837945700-30057527ade0",
    description: "Shikara rides on Dal Lake and gondola trips through snowy Gulmarg.",
  },
  {
    packageName: "Nepal Himalayan Base Camp Trek",
    destination: "Kathmandu, Nepal",
    category: "Adventure",
    price: 63000,
    rating: 4.8,
    img: "https://images.unsplash.com/photo-1544735716-392fe2489ffa",
    description: "Trek toward Everest Base Camp through Sherpa villages and alpine forests.",
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
