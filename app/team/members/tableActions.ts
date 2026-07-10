"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// Fetch members of a specific table name
export async function getTableMembers(tableName: string) {
  try {
    const members = await db.tableMember.findMany({
      where: { tableName },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: members };
  } catch (error) {
    console.error("Error fetching table members:", error);
    return { success: false, error: "Failed to fetch table members." };
  }
}

// Add a member to a specific table
export async function addTableMember(formData: FormData) {
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
    const mobile = formData.get("mobile") as string;
    const address = formData.get("address") as string;
    const business = formData.get("business") as string;
    const tableName = formData.get("tableName") as string;

    if (!name || !mobile || !address || !business || !tableName) {
      return { success: false, error: "All fields are required." };
    }

    const newMember = await db.tableMember.create({
      data: {
        id,
        name,
        mobile,
        address,
        business,
        tableName,
      },
    });

    revalidatePath(`/team/members`);
    revalidatePath("/admin");
    return { success: true, data: newMember };
  } catch (error: any) {
    console.error("Error adding table member:", error);
    return { success: false, error: error.message || "Failed to add table member." };
  }
}

// Delete a member from a table
export async function deleteTableMember(id: string) {
  try {
    await db.tableMember.delete({
      where: { id },
    });
    revalidatePath(`/team/members`);
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error deleting table member:", error);
    return { success: false, error: "Failed to delete table member." };
  }
}
