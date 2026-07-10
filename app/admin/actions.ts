"use server";

import { db } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { uploadToCloudinary } from "@/lib/cloudinary";

// Helper to save uploaded file (Cloudinary in production, local storage in development)
async function saveUploadedFile(file: File): Promise<string> {
  // If Cloudinary credentials are set up on Render, upload to the cloud
  if (process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_URL) {
    try {
      return await uploadToCloudinary(file);
    } catch (error) {
      console.error("Cloudinary upload failed, falling back:", error);
      throw new Error("Failed to save image file to cloud storage.");
    }
  }

  // Fallback to local files for local development
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
    console.error("Failed to save file upload locally:", error);
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
    const tableMembers = await db.tableMember.findMany({ orderBy: { createdAt: "desc" } });
    const jcomTables = await db.jcomTable.findMany({ orderBy: { name: "asc" } });

    return {
      success: true,
      data: { team, events, applications, contacts, tableMembers, jcomTables },
    };
  } catch (error) {
    console.error("Dashboard fetch error:", error);
    return { success: false, error: "Failed to fetch data from database." };
  }
}

// Delete item generic action
export async function deleteItem(type: "TeamMembers" | "Events" | "membership" | "contact" | "tableMember" | "jcomTable", id: string) {
  try {
    if (type === "TeamMembers") {
      await db.teamMember.delete({ where: { id } });
    } else if (type === "Events") {
      await db.event.delete({ where: { id } });
    } else if (type === "membership") {
      await db.membershipApplication.delete({ where: { id } });
    } else if (type === "contact") {
      await db.contactQuery.delete({ where: { id } });
    } else if (type === "tableMember") {
      await db.tableMember.delete({ where: { id } });
    } else if (type === "jcomTable") {
      await db.jcomTable.delete({ where: { id } });
    }

    revalidatePath("/team");
    revalidatePath("/events");
    revalidatePath("/team/members");
    return { success: true };
  } catch (error) {
    console.error(`Error deleting item of type ${type}:`, error);
    return { success: false, error: "Failed to delete item from database." };
  }
}

// Add Team Member Action
export async function addTeamMember(formData: FormData) {
  try {
    const id = (formData.get("id") as string || "").trim();
    if (!id) {
      return { success: false, error: "Member ID is required." };
    }

    // Check for duplicate Member ID
    const existingTeam = await db.teamMember.findUnique({ where: { id } });
    const existingTable = await db.tableMember.findUnique({ where: { id } });
    if (existingTeam || existingTable) {
      return { success: false, error: "Member ID already exists. Please enter a unique Member ID." };
    }

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
        id,
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

// Update Team Member Action
export async function updateTeamMember(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const role = formData.get("role") as string;
    const phone = formData.get("phone") as string;
    const whatsapp = formData.get("whatsapp") as string;
    const bio = formData.get("bio") as string;
    const imageFile = formData.get("imageFile") as File | null;
    let imageUrl = formData.get("imageUrl") as string;

    const existing = await db.teamMember.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, error: "Team member not found." };
    }

    // Handle direct image file upload
    if (imageFile && imageFile.size > 0 && imageFile.name) {
      imageUrl = await saveUploadedFile(imageFile);
    }

    await db.teamMember.update({
      where: { id },
      data: {
        name,
        role,
        phone: phone || null,
        whatsapp: whatsapp || null,
        bio: bio || null,
        imageUrl: imageUrl || existing.imageUrl,
      },
    });

    revalidatePath("/team");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating team member:", error);
    return { success: false, error: error.message || "Failed to update team member." };
  }
}

// Update Table Member Action
export async function updateTableMember(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const mobile = formData.get("mobile") as string;
    const address = formData.get("address") as string;
    const business = formData.get("business") as string;
    const tableName = formData.get("tableName") as string;

    if (!id || !name || !mobile || !address || !business || !tableName) {
      return { success: false, error: "All fields are required." };
    }

    await db.tableMember.update({
      where: { id },
      data: {
        name,
        mobile,
        address,
        business,
        tableName,
      },
    });

    revalidatePath("/team");
    revalidatePath("/team/members");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating table member:", error);
    return { success: false, error: error.message || "Failed to update table member." };
  }
}

// Add JCOM Table Action
export async function addJcomTable(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;

    if (!name || !phone || !email) {
      return { success: false, error: "All fields are required." };
    }

    await db.jcomTable.create({
      data: {
        name,
        phone,
        email,
      },
    });

    revalidatePath("/team");
    return { success: true };
  } catch (error: any) {
    console.error("Error creating JCOM table:", error);
    return { success: false, error: error.message || "Failed to create JCOM table." };
  }
}

// Update JCOM Table Action
export async function updateJcomTable(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;

    if (!id || !name || !phone || !email) {
      return { success: false, error: "All fields are required." };
    }

    await db.jcomTable.update({
      where: { id },
      data: {
        name,
        phone,
        email,
      },
    });

    revalidatePath("/team");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating JCOM table:", error);
    return { success: false, error: error.message || "Failed to update JCOM table." };
  }
}


