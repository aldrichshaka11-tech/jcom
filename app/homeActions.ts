"use server";

import { db } from "@/lib/db";

export async function getHomeEvents() {
  const now = new Date();
  
  // Strip time component for accurate date comparison
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const upcomingEvents = await db.event.findMany({
    where: { date: { gte: today } },
    orderBy: { date: "asc" },
    take: 5,
  });

  const completedEvents = await db.event.findMany({
    where: { date: { lt: today } },
    orderBy: { date: "desc" },
    take: 5,
  });

  return { upcomingEvents, completedEvents };
}
