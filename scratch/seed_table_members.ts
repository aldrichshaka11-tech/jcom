import { db } from "../lib/db";
import crypto from "crypto";

const zoneTables = [
  "JCOM L Ambasamudram 1.0",
  "JCOM L Kadayanallur 1.0",
  "JCOM L Kovilpatti 1.0",
  "JCOM L Marthandam 1.0",
  "JCOM L Nagercoil 1.0",
  "JCOM L Rajapalayam 1.0",
  "JCOM L Sattur 1.0",
  "JCOM L Sivakasi 1.0",
  "JCOM L Sivakasi 2.0",
  "JCOM L Sivakasi 3.0",
  "JCOM L Tenkasi 1.0",
  "JCOM L Tirunelveli 1.0",
  "JCOM L Tuticorin 1.0",
  "JCOM L Virudhunagar 1.0",
  "JCOM V Virudhunagar 2.0",
];

const mockMemberProfiles = [
  {
    name: "Suresh Kumar A.",
    mobile: "919876500001",
    address: "12, Main Street, Junction Area",
    business: "Suresh Textiles (Retail & Wholesale Clothing)"
  },
  {
    name: "Mohammad Bilal K.",
    mobile: "919876500002",
    address: "45, Bazaar Road, Town Center",
    business: "Bilal Traders (Spices & Agri-products)"
  },
  {
    name: "Muthuraj P.",
    mobile: "919876500003",
    address: "78, Match Works Road, Industrial Zone",
    business: "Muthu Matches (Safety Match Manufacturing)"
  },
  {
    name: "Ramesh Raja S.",
    mobile: "919876500004",
    address: "5, Cotton Mill Street",
    business: "Raja Ginning Mills (Cotton Spinning & Textiles)"
  },
  {
    name: "Dr. Anitha Edwin",
    mobile: "919876500005",
    address: "22, Court Road, Clinic District",
    business: "Edwin Dental Clinic (Healthcare Services)"
  }
];

async function main() {
  console.log("Seeding Table Members...");

  // Clear existing table members to start fresh
  const deleted = await db.tableMember.deleteMany();
  console.log(`Cleared ${deleted.count} existing table members.`);

  let seededCount = 0;

  for (const tableName of zoneTables) {
    // We will select 3 distinct mock profiles for each table
    const shuffled = [...mockMemberProfiles].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);

    for (let i = 0; i < selected.length; i++) {
      const profile = selected[i];
      // Slightly randomize phone and names to make them realistic per table
      const suffix = tableName.split(" ").pop() || "1.0";
      const location = tableName.split(" ")[2] || "Zone 18";
      
      const memberName = `${profile.name.split(" ")[0]} ${profile.name.split(" ")[1] || ""} (${location} ${suffix})`;
      const memberMobile = String(Number(profile.mobile) + seededCount);
      const memberAddress = `${profile.address}, ${location}`;
      
      await db.tableMember.create({
        data: {
          id: crypto.randomUUID(),
          name: memberName,
          mobile: `+91 ${memberMobile.substring(2, 7)} ${memberMobile.substring(7)}`,
          address: memberAddress,
          business: profile.business,
          tableName: tableName,
        }
      });
      seededCount++;
    }
  }

  console.log(`Seeding completed. Seeded ${seededCount} table members successfully!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
