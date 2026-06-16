import { db } from "./db";

export async function seedDatabaseIfEmpty() {
  try {
    const tableCount = await db.jcomTable.count();
    if (tableCount === 0) {
      console.log("Seeding default JCOM Tables...");
      await db.jcomTable.createMany({
        data: [
          { name: "JCOM L Ambasamudram 1.0", phone: "+919876543210", email: "info@jcom.org" },
          { name: "JCOM L Kadayanallur 1.0", phone: "+919876543210", email: "info@jcom.org" },
          { name: "JCOM L Kovilpatti 1.0", phone: "+919876543210", email: "info@jcom.org" },
          { name: "JCOM L Marthandam 1.0", phone: "+919876543210", email: "info@jcom.org" },
          { name: "JCOM L Nagercoil 1.0", phone: "+919876543210", email: "info@jcom.org" },
          { name: "JCOM L Rajapalayam 1.0", phone: "+919876543210", email: "info@jcom.org" },
          { name: "JCOM L Sattur 1.0", phone: "+919876543210", email: "info@jcom.org" },
          { name: "JCOM L Sivakasi 1.0", phone: "+919876543210", email: "info@jcom.org" },
          { name: "JCOM L Sivakasi 2.0", phone: "+919876543210", email: "info@jcom.org" },
          { name: "JCOM L Sivakasi 3.0", phone: "+919876543210", email: "info@jcom.org" },
          { name: "JCOM L Tenkasi 1.0", phone: "+919876543210", email: "info@jcom.org" },
          { name: "JCOM L Tirunelveli 1.0", phone: "+919876543210", email: "info@jcom.org" },
          { name: "JCOM L Tuticorin 1.0", phone: "+919876543210", email: "info@jcom.org" },
          { name: "JCOM L Virudhunagar 1.0", phone: "+919876543210", email: "info@jcom.org" },
          { name: "JCOM V Virudhunagar 2.0", phone: "+919876543210", email: "info@jcom.org" },
        ]
      });
    }

    const teamCount = await db.teamMember.count();
    if (teamCount === 0) {
      console.log("Seeding default team members...");
      await db.teamMember.createMany({
        data: [
          {
            name: "Rajamoorthy R",
            role: "Zone Chairman",
            imageUrl: "/team/rajamoorthy2.jpg",
            bio: "Rajamoorthy R is a dynamic and visionary leader who drives JCOM's mission.",
            phone: "+91 98765 43210",
            whatsapp: "+91 98765 43210",
          },
          {
            name: "Sundar Rajan",
            role: "Past Zone Chairman",
            imageUrl: "/team/virtual-photoshoot-2 (6) - sundar rajan.jpg",
            bio: "Sundar Rajan brings strong leadership and strategic vision to JCOM.",
            phone: "+91 98765 43211",
            whatsapp: "+91 98765 43211",
          },
          {
            name: "Gayathri T.",
            role: "Secretary",
            imageUrl: "/team/Screenshot_20251201_210947_Photos - Gayathri Thirupathi.jpg",
            bio: "Gayathri Thirupathi is a committed professional who excels in organizational management.",
            phone: "+91 98765 43212",
            whatsapp: "+91 98765 43212",
          },
          {
            name: "Loganathan G",
            role: "Treasurer",
            imageUrl: "/team/LOGU assistant coach - JFD.G LOGANATHAN.png",
            bio: "JFD.G Loganathan manages JCOM's financial operations with precision.",
            phone: "+91 98765 43213",
            whatsapp: "+91 98765 43213",
          },
        ]
      });
    }
  } catch (error) {
    console.error("Error during DB seeding:", error);
  }
}
