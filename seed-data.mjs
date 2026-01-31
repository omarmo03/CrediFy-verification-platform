import { drizzle } from "drizzle-orm/mysql2";
import { profiles, joinRequests } from "./drizzle/schema.js";

const db = drizzle(process.env.DATABASE_URL);

async function seedData() {
  try {
    console.log("🌱 Starting to seed data...");

    // Add sample profiles
    const sampleProfiles = [
      {
        name: "Omar Mo",
        profileLink: "https://facebook.com/omar.mo",
        status: "trusted",
        proofCount: 45,
        rank: "verified",
      },
      {
        name: "Omar Mohamed",
        profileLink: "https://facebook.com/omar.mohamed",
        status: "trusted",
        proofCount: 120,
        rank: "middleman",
      },
      {
        name: "x3moreex",
        profileLink: "https://facebook.com/x3moreex",
        status: "trusted",
        proofCount: 250,
        rank: "topSeller",
      },
    ];

    for (const profile of sampleProfiles) {
      await db.insert(profiles).values(profile);
      console.log(`✅ Added profile: ${profile.name}`);
    }

    console.log("✨ Data seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
}

seedData();
