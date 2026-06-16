import { db } from "../lib/db";

async function main() {
  const events = await db.event.findMany();
  console.log("All Events in DB:");
  console.dir(events, { depth: null });
}

main().catch(console.error);
