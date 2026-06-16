"use server";

import { db } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";

// Helper to save uploaded file locally under /public/uploads
async function saveUploadedFile(file: File): Promise<string> {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create the public/uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    // Generate unique name
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${uniqueSuffix}-${safeName}`;
    const filepath = path.join(uploadDir, filename);

    // Write file to disk
    await writeFile(filepath, buffer);
    return `/uploads/${filename}`;
  } catch (error) {
    console.error("Failed to save file upload:", error);
    throw new Error("Failed to save image file on server.");
  }
}

// Fetch all dashboard data
export async function getDashboardData() {
  try {
    const team = await db.teamMember.findMany({ orderBy: { createdAt: "desc" } });
    const events = await db.event.findMany({ orderBy: { date: "desc" } });
    const applications = await db.membershipApplication.findMany({ orderBy: { timestamp: "desc" } });
    const contacts = await db.contactQuery.findMany({ orderBy: { timestamp: "desc" } });

    return {
      success: true,
      data: { team, events, applications, contacts },
    };
  } catch (error) {
    console.error("Dashboard fetch error:", error);
    return { success: false, error: "Failed to fetch data from database." };
  }
}

// Delete item generic action
export async function deleteItem(type: "TeamMembers" | "Events" | "membership" | "contact", id: string) {
  try {
    if (type === "TeamMembers") {
      await db.teamMember.delete({ where: { id } });
    } else if (type === "Events") {
      await db.event.delete({ where: { id } });
    } else if (type === "membership") {
      await db.membershipApplication.delete({ where: { id } });
    } else if (type === "contact") {
      await db.contactQuery.delete({ where: { id } });
    }

    revalidatePath("/team");
    revalidatePath("/events");
    return { success: true };
  } catch (error) {
    console.error(`Error deleting item of type ${type}:`, error);
    return { success: false, error: "Failed to delete item from database." };
  }
}

// Add Team Member Action
export async function addTeamMember(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const role = formData.get("role") as string;
    const phone = formData.get("phone") as string;
    const whatsapp = formData.get("whatsapp") as string;
    const bio = formData.get("bio") as string;
    const imageFile = formData.get("imageFile") as File | null;
    let imageUrl = formData.get("imageUrl") as string;

    // Handle direct image file upload
    if (imageFile && imageFile.size > 0 && imageFile.name) {
      imageUrl = await saveUploadedFile(imageFile);
    }

    if (!imageUrl) {
      return { success: false, error: "Please provide either a Photo URL or select an Image file to upload." };
    }

    await db.teamMember.create({
      data: {
        name,
        role,
        phone: phone || null,
        whatsapp: whatsapp || null,
        bio: bio || null,
        imageUrl,
      },
    });

    revalidatePath("/team");
    return { success: true };
  } catch (error: any) {
    console.error("Error creating team member:", error);
    return { success: false, error: error.message || "Failed to create team member." };
  }
}

// Add Event Action
export async function addEvent(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const dateStr = formData.get("date") as string;
    const time = formData.get("time") as string;
    const location = formData.get("location") as string;
    const actionUrl = formData.get("actionUrl") as string;
    const description = formData.get("description") as string;
    const imageFile = formData.get("imageFile") as File | null;
    let imageUrl = formData.get("imageUrl") as string;

    // Handle direct image file upload
    if (imageFile && imageFile.size > 0 && imageFile.name) {
      imageUrl = await saveUploadedFile(imageFile);
    }

    if (!imageUrl) {
      return { success: false, error: "Please provide either an Event Photo URL or select an Image file to upload." };
    }

    // Process gallery images
    const galleryImages: string[] = [];
    const galleryFiles = formData.getAll("galleryFiles") as File[];
    for (const file of galleryFiles) {
      if (file && file.size > 0 && file.name) {
        const fileUrl = await saveUploadedFile(file);
        galleryImages.push(fileUrl);
      }
    }

    await db.event.create({
      data: {
        title,
        category,
        date: new Date(dateStr),
        time: time || null,
        location,
        actionUrl: actionUrl || null,
        description,
        imageUrl,
        galleryImages,
      },
    });

    revalidatePath("/events");
    return { success: true };
  } catch (error: any) {
    console.error("Error creating event:", error);
    return { success: false, error: error.message || "Failed to create event." };
  }
}
