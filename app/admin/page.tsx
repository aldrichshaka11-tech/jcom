"use client";

import React, { useState, useEffect } from "react";
import { getDashboardData, deleteItem, addTeamMember, addEvent, updateTeamMember, updateTableMember, addJcomTable, updateJcomTable } from "./actions";
import { addTableMember } from "../team/members/tableActions";
import Link from "next/link";

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [activeTab, setActiveTab] = useState("team");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [teamSubTab, setTeamSubTab] = useState<"governing" | "tables" | "members">("governing");
  
  const [loading, setLoading] = useState(true);
  const [dbConnected, setDbConnected] = useState<boolean | null>(null);
  
  const [dashboardData, setDashboardData] = useState<{
    team: any[];
    events: any[];
    applications: any[];
    contacts: any[];
    tableMembers: any[];
    jcomTables: any[];
  }>({
    team: [],
    events: [],
    applications: [],
    contacts: [],
    tableMembers: [],
    jcomTables: [],
  });

  const [tableMemberForm, setTableMemberForm] = useState({
    name: "",
    mobile: "",
    address: "",
    business: "",
    tableName: "JCOM L Ambasamudram 1.0",
  });
  const [submittingTableMember, setSubmittingTableMember] = useState(false);
  const [filterTableSelected, setFilterTableSelected] = useState("JCOM L Ambasamudram 1.0");

  const [teamForm, setTeamForm] = useState({
    name: "",
    role: "Zone Chairman",
    phone: "",
    whatsapp: "",
    imageUrl: "",
    bio: "",
  });
  const [teamFile, setTeamFile] = useState<File | null>(null);

  // Unified form states & Editing states
  const [memberLevel, setMemberLevel] = useState<string>("Chairman");
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingType, setEditingType] = useState<"team" | "jcom-table" | "table-member" | null>(null);
  const [memberIdInput, setMemberIdInput] = useState("");

  const isUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
  const displayId = (id: string) => isUUID(id) ? id.substring(0, 8) : id;

  const [jcomTableForm, setJcomTableForm] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [submittingJcomTable, setSubmittingJcomTable] = useState(false);

  const [eventForm, setEventForm] = useState({
    title: "",
    category: "Summit",
    date: "",
    time: "",
    location: "",
    imageUrl: "",
    actionUrl: "",
    description: "",
  });
  const [eventFile, setEventFile] = useState<File | null>(null);
  const [galleryInputCount, setGalleryInputCount] = useState(1);

  const [submittingTeam, setSubmittingTeam] = useState(false);
  const [submittingEvent, setSubmittingEvent] = useState(false);

  const fetchAllData = async () => {
    setLoading(true);
    const result = await getDashboardData();
    if (result.success && result.data) {
      setDashboardData(result.data);
      setDbConnected(true);
    } else {
      setDbConnected(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchAllData();
    }
  }, [isLoggedIn]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123") {
      setIsLoggedIn(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const handleDelete = async (type: "TeamMembers" | "Events" | "membership" | "contact" | "tableMember" | "jcomTable", id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    const result = await deleteItem(type, id);
    if (result.success) {
      alert("Item deleted successfully!");
      fetchAllData();
    } else {
      alert(result.error || "Failed to delete item.");
    }
  };

  const handleMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedId = memberIdInput.trim();
    if (memberLevel !== "Zone 18 Table Member") {
      if (!trimmedId) {
        alert("Member ID is required.");
        return;
      }
      const isDuplicate = !isEditing && (
        dashboardData.team.some(m => m.id.trim().toLowerCase() === trimmedId.toLowerCase()) ||
        dashboardData.tableMembers.some(m => m.id.trim().toLowerCase() === trimmedId.toLowerCase())
      );
      if (isDuplicate) {
        alert("Member ID already exists. Please enter a unique Member ID.");
        return;
      }
    }

    setSubmittingTeam(true);

    try {
      if (memberLevel === "Zone 18 Member") {
        const fd = new FormData();
        fd.append("name", tableMemberForm.name);
        fd.append("mobile", tableMemberForm.mobile);
        fd.append("address", tableMemberForm.address);
        fd.append("business", tableMemberForm.business);
        fd.append("tableName", tableMemberForm.tableName);

        if (isEditing && editingId) {
          fd.append("id", editingId);
          const result = await updateTableMember(fd);
          if (result.success) {
            alert("Table member updated successfully!");
            resetMemberForm();
            fetchAllData();
          } else {
            alert(result.error || "Failed to update table member.");
          }
        } else {
          fd.append("id", trimmedId);
          const result = await addTableMember(fd);
          if (result.success) {
            alert("Table member added successfully!");
            resetMemberForm();
            fetchAllData();
          } else {
            alert(result.error || "Failed to add table member.");
          }
        }
      } else if (memberLevel === "Zone 18 Table Member") {
        const fd = new FormData();
        fd.append("name", jcomTableForm.name);
        fd.append("phone", jcomTableForm.phone);
        fd.append("email", jcomTableForm.email);

        if (isEditing && editingId) {
          fd.append("id", editingId);
          const result = await updateJcomTable(fd);
          if (result.success) {
            alert("JCOM Table updated successfully!");
            resetMemberForm();
            fetchAllData();
          } else {
            alert(result.error || "Failed to update JCOM Table.");
          }
        } else {
          const result = await addJcomTable(fd);
          if (result.success) {
            alert("JCOM Table added successfully!");
            resetMemberForm();
            fetchAllData();
          } else {
            alert(result.error || "Failed to add JCOM Table.");
          }
        }
      } else {
        // Chairman, Post Chairman, or Table Member (storing in db.teamMember)
        const fd = new FormData();
        fd.append("name", teamForm.name);
        
        let roleToSave = teamForm.role;
        if (memberLevel === "Chairman") {
          roleToSave = teamForm.role || "Zone Chairman";
        } else if (memberLevel === "Post Chairman") {
          roleToSave = teamForm.role || "Past Zone Chairman";
        } else if (memberLevel === "Table Member") {
          roleToSave = teamForm.role || "JCOM Member";
        }
        fd.append("role", roleToSave);
        fd.append("phone", teamForm.phone);
        fd.append("whatsapp", teamForm.whatsapp);
        fd.append("bio", teamForm.bio);
        fd.append("imageUrl", teamForm.imageUrl);
        if (teamFile) {
          fd.append("imageFile", teamFile);
        }

        if (isEditing && editingId) {
          fd.append("id", editingId);
          const result = await updateTeamMember(fd);
          if (result.success) {
            alert("Team member updated successfully!");
            resetMemberForm();
            fetchAllData();
          } else {
            alert(result.error || "Failed to update team member.");
          }
        } else {
          fd.append("id", trimmedId);
          const result = await addTeamMember(fd);
          if (result.success) {
            alert("Team member added successfully!");
            resetMemberForm();
            fetchAllData();
          } else {
            alert(result.error || "Failed to add team member.");
          }
        }
      }
  } catch (error: any) {
    alert(error.message || "An error occurred during submission. (Possible 413 File Too Large)");
  } finally {
    setSubmittingTeam(false);
  }
};

  const resetMemberForm = () => {
    setTeamForm({ name: "", role: "Zone Chairman", phone: "", whatsapp: "", imageUrl: "", bio: "" });
    setTableMemberForm({ name: "", mobile: "", address: "", business: "", tableName: dashboardData.jcomTables?.[0]?.name || "JCOM L Ambasamudram 1.0" });
    setJcomTableForm({ name: "", phone: "", email: "" });
    setTeamFile(null);
    setIsEditing(false);
    setEditingId(null);
    setEditingType(null);
    setMemberLevel("Chairman");
    setMemberIdInput("");
    const fileInput = document.getElementById("t_image_file") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const startEditTeamMember = (member: any) => {
    setIsEditing(true);
    setEditingId(member.id);
    setEditingType("team");
    setTeamSubTab("governing");
    setMemberIdInput(member.id);

    const roleLower = member.role.toLowerCase();
    let level = "Table Member";
    if (roleLower.includes("chairman") && !roleLower.includes("past")) {
      level = "Chairman";
    } else if (roleLower.includes("past") && roleLower.includes("chairman")) {
      level = "Post Chairman";
    }

    setMemberLevel(level);
    setTeamForm({
      name: member.name,
      role: member.role,
      phone: member.phone || "",
      whatsapp: member.whatsapp || "",
      imageUrl: member.imageUrl || "",
      bio: member.bio || "",
    });

    const formElement = document.getElementById("add-member-form-card");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formTarget = e.currentTarget as HTMLFormElement;
    setSubmittingEvent(true);

    try {
      const fd = new FormData();
      fd.append("title", eventForm.title);
      fd.append("category", eventForm.category);
      fd.append("date", eventForm.date);
      fd.append("time", eventForm.time);
      fd.append("location", eventForm.location);
      fd.append("actionUrl", eventForm.actionUrl);
      fd.append("description", eventForm.description);
      fd.append("imageUrl", eventForm.imageUrl);
      if (eventFile) {
        fd.append("imageFile", eventFile);
      }
      const rawFd = new FormData(formTarget);
    const allGalleryFiles = rawFd.getAll("galleryFiles") as File[];
    allGalleryFiles.forEach((file) => {
      if (file && file.size > 0) {
        fd.append("galleryFiles", file);
      }
    });

    const result = await addEvent(fd);
    if (result.success) {
      alert("Event added successfully!");
      setEventForm({
        title: "",
        category: "Summit",
        date: "",
        time: "",
        location: "",
        imageUrl: "",
        actionUrl: "",
        description: "",
      });
      setEventFile(null);
      setGalleryInputCount(1);
      // Reset file input
      const fileInput = document.getElementById("e_image_file") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      fetchAllData();
    } else {
      alert(result.error || "Failed to add event.");
    }
    } catch (error: any) {
      alert(error.message || "An error occurred during submission. (Possible 413 File Too Large)");
    } finally {
      setSubmittingEvent(false);
    }
  };

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



  const startEditTableMember = (member: any) => {
    setActiveTab("team");
    setTeamSubTab("members");
    setIsEditing(true);
    setEditingId(member.id);
    setEditingType("table-member");
    setMemberLevel("Zone 18 Member");
    setTableMemberForm({
      name: member.name,
      mobile: member.mobile,
      address: member.address,
      business: member.business,
      tableName: member.tableName,
    });

    const formElement = document.getElementById("add-member-form-card");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };



  const startEditJcomTable = (table: any) => {
    setActiveTab("team");
    setTeamSubTab("tables");
    setIsEditing(true);
    setEditingId(table.id);
    setEditingType("jcom-table");
    setMemberLevel("Zone 18 Table Member");
    setJcomTableForm({
      name: table.name,
      phone: table.phone,
      email: table.email,
    });
    
    const formElement = document.getElementById("add-member-form-card");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };


  if (!isLoggedIn) {
    return (
      <div className="login-wrapper">
        <style dangerouslySetInnerHTML={{ __html: `
          body { margin: 0; background: #0f172a; }
          .login-wrapper {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at 10% 20%, rgba(15, 23, 42, 1) 0%, rgba(30, 41, 59, 1) 90%);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }
          .login-card {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 24px;
            padding: 45px 35px;
            width: 100%;
            max-width: 440px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          }
          .login-input {
            background: rgba(255, 255, 255, 0.08) !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            color: white !important;
            border-radius: 12px !important;
            padding: 14px 18px !important;
            font-weight: 500 !important;
            transition: all 0.3s ease !important;
          }
          .login-input::placeholder {
            color: rgba(255, 255, 255, 0.4) !important;
          }
          .login-input:focus {
            background: rgba(255, 255, 255, 0.12) !important;
            border-color: #38bdf8 !important;
            box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.25) !important;
            outline: none !important;
          }
          .login-btn {
            background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%) !important;
            border: none !important;
            color: white !important;
            border-radius: 12px !important;
            padding: 14px !important;
            font-weight: 600 !important;
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2) !important;
            transition: all 0.3s ease !important;
          }
          .login-btn:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 8px 20px rgba(37, 99, 235, 0.4) !important;
          }
        ` }} />
        <div className="login-card animate__animated animate__fadeIn">
          <div className="text-center mb-4">
            <img src="/images/logo1.png" height="70" className="mb-3" alt="JCOM Logo" />
            <h3 className="fw-bold text-white mb-1">Welcome Back</h3>
            <p className="text-white-50 small">Enter admin credentials to access Control Panel</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="text-white-50 small fw-semibold mb-2">Admin Password</label>
              <input
                type="password"
                className="form-control login-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn login-btn w-100 py-3 mt-2">
              Sign In <i className="bi bi-arrow-right-short ms-1"></i>
            </button>
          </form>
          {loginError && (
            <div className="alert alert-danger border-0 bg-danger-subtle text-danger mt-4 small py-2 text-center rounded-3 fw-semibold">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>Incorrect password
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        body { background-color: #f8fafc !important; font-family: 'Poppins', sans-serif !important; margin: 0; }
        
        /* Layout */
        .admin-layout {
          display: flex;
          min-height: 100vh;
          width: 100%;
          overflow: hidden;
        }
        .admin-sidebar {
          width: 270px;
          background-color: #0f172a;
          color: #94a3b8;
          display: flex;
          flex-direction: column;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          flex-shrink: 0;
          border-right: 1px solid #1e293b;
          z-index: 1040;
        }
        .admin-sidebar-header {
          padding: 24px;
          border-bottom: 1px solid #1e293b;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .sidebar-menu {
          padding: 20px 0;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .sidebar-item-btn {
          background: transparent;
          border: none;
          display: flex;
          align-items: center;
          padding: 14px 24px;
          color: #94a3b8;
          text-decoration: none;
          font-weight: 500;
          gap: 14px;
          transition: all 0.2s ease;
          text-align: left;
          width: 100%;
          border-left: 4px solid transparent;
        }
        .sidebar-item-btn:hover {
          color: #f8fafc;
          background: rgba(255, 255, 255, 0.03);
        }
        .sidebar-item-btn.active {
          color: #ffffff;
          background: rgba(59, 130, 246, 0.08);
          border-left-color: #3b82f6;
          font-weight: 600;
        }
        .sidebar-item-btn.active i {
          color: #3b82f6;
        }
        .sidebar-footer {
          padding: 20px;
          border-top: 1px solid #1e293b;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .admin-main {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          background-color: #f8fafc;
        }
        .admin-topbar {
          height: 70px;
          background: white;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 30px;
          position: sticky;
          top: 0;
          z-index: 1030;
        }
        .admin-content {
          padding: 35px 30px;
          flex-grow: 1;
          overflow-y: auto;
        }
        
        /* Stats Cards */
        .metric-card {
          background: white;
          border-radius: 16px;
          padding: 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 1px solid #f1f5f9;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.02), 0 1px 2px 0 rgba(0, 0, 0, 0.01);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }
        .metric-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 20px -5px rgba(0, 0, 0, 0.05), 0 8px 16px -6px rgba(0, 0, 0, 0.03);
        }
        .metric-icon-bg {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          transition: all 0.3s ease;
        }
        
        /* Card & Forms */
        .admin-card {
          background: white;
          border-radius: 18px;
          border: 1px solid #f1f5f9;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.01);
          margin-bottom: 30px;
        }
        .admin-card-header {
          padding: 24px 30px;
          border-bottom: 1px solid #f1f5f9;
          background: transparent;
        }
        .admin-card-body {
          padding: 30px;
        }
        
        /* Inputs styling */
        .admin-form-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #334155;
          margin-bottom: 8px;
        }
        .admin-form-control {
          background-color: #f8fafc !important;
          border: 1px solid #e2e8f0 !important;
          border-radius: 10px !important;
          padding: 10px 14px !important;
          font-size: 0.95rem !important;
          color: #1e293b !important;
          transition: all 0.2s ease !important;
        }
        .admin-form-control:focus {
          background-color: #fff !important;
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1) !important;
          outline: none !important;
        }
        .admin-form-select {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 0.75rem center;
          background-size: 16px 12px;
          appearance: none;
        }
        
        /* Table Customization */
        .admin-table-container {
          overflow-x: auto;
        }
        .admin-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          margin-bottom: 0;
        }
        .admin-table th {
          background-color: #f8fafc;
          color: #475569;
          font-weight: 600;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 16px 24px;
          border-bottom: 1px solid #e2e8f0;
          border-top: 1px solid #e2e8f0;
        }
        .admin-table td {
          padding: 18px 24px;
          border-bottom: 1px solid #f1f5f9;
          color: #334155;
          font-size: 0.9rem;
        }
        .admin-table tbody tr {
          transition: all 0.2s ease;
        }
        .admin-table tbody tr:hover {
          background-color: #f8fafc;
        }
        
        /* Custom Buttons */
        .btn-admin-primary {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%) !important;
          border: none !important;
          color: white !important;
          font-weight: 600 !important;
          border-radius: 10px !important;
          padding: 10px 24px !important;
          box-shadow: 0 4px 10px rgba(59, 130, 246, 0.15) !important;
          transition: all 0.2s ease !important;
        }
        .btn-admin-primary:hover {
          transform: translateY(-1px) !important;
          box-shadow: 0 6px 14px rgba(59, 130, 246, 0.25) !important;
        }
        .btn-admin-outline-danger {
          color: #ef4444 !important;
          background: transparent !important;
          border: 1px solid #fecaca !important;
          border-radius: 8px !important;
          padding: 6px 12px !important;
          font-weight: 500 !important;
          transition: all 0.2s ease !important;
        }
        .btn-admin-outline-danger:hover {
          background-color: #fef2f2 !important;
          border-color: #ef4444 !important;
          color: #ef4444 !important;
        }
        .btn-admin-outline-primary {
          color: #3b82f6 !important;
          background: transparent !important;
          border: 1px solid #bfdbfe !important;
          border-radius: 8px !important;
          padding: 6px 12px !important;
          font-weight: 500 !important;
          transition: all 0.2s ease !important;
        }
        .btn-admin-outline-primary:hover {
          background-color: #eff6ff !important;
          border-color: #3b82f6 !important;
          color: #3b82f6 !important;
        }
        
        /* Soft Badges */
        .badge-soft-blue {
          background-color: #dbeafe !important;
          color: #1e40af !important;
          font-weight: 600 !important;
        }
        .badge-soft-purple {
          background-color: #f3e8ff !important;
          color: #6b21a8 !important;
          font-weight: 600 !important;
        }
        .badge-soft-green {
          background-color: #d1fae5 !important;
          color: #065f46 !important;
          font-weight: 600 !important;
        }
        .badge-soft-amber {
          background-color: #fef3c7 !important;
          color: #92400e !important;
          font-weight: 600 !important;
        }
        
        /* Mobile Hamburger & Overlay */
        .mobile-sidebar-toggle {
          display: none;
          background: transparent;
          border: none;
          font-size: 24px;
          color: #1e293b;
        }
        .sidebar-overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(4px);
          z-index: 1035;
        }
        
        @media (max-width: 991.98px) {
          .admin-sidebar {
            position: fixed;
            top: 0;
            bottom: 0;
            left: -270px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15);
          }
          .admin-sidebar.open {
            left: 0;
          }
          .sidebar-overlay.show {
            display: block;
          }
          .mobile-sidebar-toggle {
            display: block;
          }
          .admin-topbar {
            padding: 0 20px;
          }
          .admin-content {
            padding: 20px;
          }
        }

        @media (max-width: 575.98px) {
          .nav-tabs-scrollable {
            display: flex !important;
            flex-wrap: nowrap !important;
            overflow-x: auto !important;
            -webkit-overflow-scrolling: touch;
            width: 100%;
            scrollbar-width: none;
          }
          .nav-tabs-scrollable::-webkit-scrollbar {
            display: none;
          }
          .nav-tabs-scrollable .nav-item {
            flex: 0 0 auto;
          }
        }
      ` }} />

      <div className="admin-layout">
        {/* Sidebar Overlay */}
        <div className={`sidebar-overlay ${sidebarOpen ? "show" : ""}`} onClick={() => setSidebarOpen(false)}></div>

        {/* Sidebar */}
        <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="admin-sidebar-header py-4 px-3 text-center border-bottom" style={{ borderColor: "#1e293b !important" }}>
            <div className="w-100">
              <div className="bg-white p-2 rounded-3 mb-2 d-inline-block shadow-sm" style={{ width: "100%", maxWidth: "220px" }}>
                <img src="/images/logo1.png" style={{ width: "100%", height: "auto", display: "block" }} alt="JCOM Logo" />
              </div>
              <div className="mt-2">
                <h6 className="m-0 text-white fw-bold" style={{ fontSize: "1rem", letterSpacing: "0.5px" }}>JCOM Zone 18</h6>
                <small className="text-muted" style={{ fontSize: "11px" }}>Control Panel</small>
              </div>
            </div>
          </div>

          <div className="sidebar-menu">
            <button className={`sidebar-item-btn ${activeTab === "team" ? "active" : ""}`} onClick={() => { setActiveTab("team"); setSidebarOpen(false); }}>
              <i className="bi bi-people-fill"></i>
              <span>Team & Tables</span>
            </button>
            <button className={`sidebar-item-btn ${activeTab === "events" ? "active" : ""}`} onClick={() => { setActiveTab("events"); setSidebarOpen(false); }}>
              <i className="bi bi-calendar-event-fill"></i>
              <span>Events</span>
            </button>
            <button className={`sidebar-item-btn ${activeTab === "apps" ? "active" : ""}`} onClick={() => { setActiveTab("apps"); setSidebarOpen(false); }}>
              <i className="bi bi-person-check-fill"></i>
              <span>Membership</span>
            </button>
            <button className={`sidebar-item-btn ${activeTab === "contacts" ? "active" : ""}`} onClick={() => { setActiveTab("contacts"); setSidebarOpen(false); }}>
              <i className="bi bi-envelope-open-fill"></i>
              <span>Contact Queries</span>
            </button>
          </div>

          <div className="sidebar-footer">
            <Link href="/" className="btn btn-outline-light btn-sm w-100 fw-semibold py-2">
              <i className="bi bi-house me-2"></i>Public Site
            </Link>
            <button className="btn btn-danger btn-sm w-100 fw-semibold py-2" onClick={() => setIsLoggedIn(false)}>
              <i className="bi bi-box-arrow-right me-2"></i>Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content Container */}
        <div className="admin-main">
          {/* Top Bar */}
          <header className="admin-topbar">
            <div className="d-flex align-items-center gap-3">
              <button className="mobile-sidebar-toggle" onClick={() => setSidebarOpen(true)}>
                <i className="bi bi-list"></i>
              </button>
              <h4 className="fw-bold m-0 text-dark d-none d-sm-block">
                {activeTab === "team" && "Manage Team & Tables"}
                {activeTab === "events" && "Manage JCOM Events"}
                {activeTab === "apps" && "Membership Applications"}
                {activeTab === "contacts" && "Contact Inquiries"}
              </h4>
            </div>

            <div className="d-flex align-items-center gap-3">
              {dbConnected === null && (
                <span className="badge bg-warning text-dark px-2 py-1"><i className="bi bi-arrow-repeat spin me-1"></i>Checking DB</span>
              )}
              {dbConnected === true && (
                <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1"><i className="bi bi-cloud-check-fill me-1"></i>Database: Connected</span>
              )}
              {dbConnected === false && (
                <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1"><i className="bi bi-exclamation-triangle-fill me-1"></i>Database Offline</span>
              )}
              <div className="d-flex align-items-center gap-2">
                <div className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: "38px", height: "38px" }}>
                  <i className="bi bi-person-badge-fill"></i>
                </div>
                <span className="text-dark fw-semibold d-none d-md-block">Administrator</span>
              </div>
            </div>
          </header>

          {/* Main Area */}
          <main className="admin-content">
            {/* Live Statistics Cards */}
            <div className="row g-4 mb-5">
              <div className="col-md-6 col-lg" onClick={() => { setActiveTab("team"); setTeamSubTab("governing"); }}>
                <div className={`metric-card ${activeTab === "team" && teamSubTab === "governing" ? "border-primary shadow-sm" : ""}`}>
                  <div>
                    <span className="text-muted small fw-semibold text-uppercase">Team Members</span>
                    <h2 className="fw-bold text-dark m-0 mt-1">{dashboardData.team.length}</h2>
                  </div>
                  <div className="metric-icon-bg bg-primary-subtle text-primary">
                    <i className="bi bi-people"></i>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg" onClick={() => setActiveTab("events")}>
                <div className={`metric-card ${activeTab === "events" ? "border-primary shadow-sm" : ""}`}>
                  <div>
                    <span className="text-muted small fw-semibold text-uppercase">JCOM Events</span>
                    <h2 className="fw-bold text-dark m-0 mt-1">{dashboardData.events.length}</h2>
                  </div>
                  <div className="metric-icon-bg bg-purple-subtle text-purple" style={{ color: "#8b5cf6" }}>
                    <i className="bi bi-calendar-event"></i>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg" onClick={() => { setActiveTab("team"); setTeamSubTab("tables"); }}>
                <div className={`metric-card ${activeTab === "team" && teamSubTab === "tables" ? "border-primary shadow-sm" : ""}`}>
                  <div>
                    <span className="text-muted small fw-semibold text-uppercase">JCOM Tables</span>
                    <h2 className="fw-bold text-dark m-0 mt-1">{dashboardData.jcomTables ? dashboardData.jcomTables.length : 0}</h2>
                  </div>
                  <div className="metric-icon-bg bg-info-subtle text-info" style={{ color: "#0ea5e9" }}>
                    <i className="bi bi-diagram-3"></i>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg" onClick={() => { setActiveTab("team"); setTeamSubTab("members"); }}>
                <div className={`metric-card ${activeTab === "team" && teamSubTab === "members" ? "border-primary shadow-sm" : ""}`}>
                  <div>
                    <span className="text-muted small fw-semibold text-uppercase">Table Members</span>
                    <h2 className="fw-bold text-dark m-0 mt-1">{dashboardData.tableMembers ? dashboardData.tableMembers.length : 0}</h2>
                  </div>
                  <div className="metric-icon-bg bg-success-subtle text-success">
                    <i className="bi bi-grid-3x3-gap"></i>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg" onClick={() => setActiveTab("apps")}>
                <div className={`metric-card ${activeTab === "apps" ? "border-primary shadow-sm" : ""}`}>
                  <div>
                    <span className="text-muted small fw-semibold text-uppercase">Applications</span>
                    <h2 className="fw-bold text-dark m-0 mt-1">{dashboardData.applications.length}</h2>
                  </div>
                  <div className="metric-icon-bg bg-warning-subtle text-warning">
                    <i className="bi bi-person-check"></i>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg" onClick={() => setActiveTab("contacts")}>
                <div className={`metric-card ${activeTab === "contacts" ? "border-primary shadow-sm" : ""}`}>
                  <div>
                    <span className="text-muted small fw-semibold text-uppercase">Contact Queries</span>
                    <h2 className="fw-bold text-dark m-0 mt-1">{dashboardData.contacts.length}</h2>
                  </div>
                  <div className="metric-icon-bg bg-danger-subtle text-danger" style={{ color: "#ef4444" }}>
                    <i className="bi bi-envelope-open"></i>
                  </div>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-2 text-muted">Syncing dashboard with PostgreSQL database...</p>
              </div>
            ) : (
              <div className="tab-content">
                
                {/* TEAM TAB */}
                {activeTab === "team" && (
                  <div className="row g-4">
                    {/* Form Column */}
                    <div className="col-lg-5">
                      <div className="admin-card" id="add-member-form-card">
                        <div className="admin-card-header">
                          <h5 className="fw-bold m-0 text-dark">
                            <i className="bi bi-person-plus-fill me-2 text-primary"></i>
                            {isEditing ? "Edit JCOM Member" : "Add JCOM Member"}
                          </h5>
                        </div>
                        <div className="admin-card-body">
                          <form onSubmit={handleMemberSubmit}>
                            <div className="mb-4">
                              <label className="admin-form-label text-primary">Member Level / Role Type</label>
                              <select
                                className="form-select admin-form-control admin-form-select fw-bold"
                                style={{ borderColor: "#3b82f6 !important" }}
                                value={memberLevel}
                                onChange={(e) => {
                                  const lvl = e.target.value;
                                  setMemberLevel(lvl);
                                  if (lvl === "Chairman") {
                                    setTeamForm(prev => ({ ...prev, role: "Zone Chairman" }));
                                    setTeamSubTab("governing");
                                  } else if (lvl === "Post Chairman") {
                                    setTeamForm(prev => ({ ...prev, role: "Past Zone Chairman" }));
                                    setTeamSubTab("governing");
                                  } else if (lvl === "Table Member") {
                                    setTeamForm(prev => ({ ...prev, role: "JCOM President" }));
                                    setTeamSubTab("governing");
                                  } else if (lvl === "Zone 18 Table Member") {
                                    setTeamSubTab("tables");
                                  } else if (lvl === "Zone 18 Member") {
                                    setTeamSubTab("members");
                                  }
                                }}
                                disabled={isEditing}
                              >
                                <option value="Chairman">Chairman</option>
                                <option value="Post Chairman">Post Chairman</option>
                                <option value="Table Member">Table Member</option>
                                <option value="Zone 18 Table Member">Zone 18 Table Member</option>
                                <option value="Zone 18 Member">Zone 18 Member</option>
                              </select>
                            </div>

                            {memberLevel !== "Zone 18 Table Member" && (
                              <div className="mb-4">
                                <label className="admin-form-label text-primary">Member ID</label>
                                <input
                                  type="text"
                                  className="form-control admin-form-control"
                                  placeholder="e.g. M-101"
                                  value={memberIdInput}
                                  onChange={(e) => setMemberIdInput(e.target.value)}
                                  disabled={isEditing}
                                  required
                                />
                                {memberIdInput.trim() && !isEditing && (
                                  dashboardData.team.some(m => m.id.trim().toLowerCase() === memberIdInput.trim().toLowerCase()) ||
                                  dashboardData.tableMembers.some(m => m.id.trim().toLowerCase() === memberIdInput.trim().toLowerCase())
                                ) && (
                                  <div className="text-danger small mt-1">
                                    Member ID already exists. Please enter a unique Member ID.
                                  </div>
                                )}
                              </div>
                            )}

                            {memberLevel === "Zone 18 Member" ? (
                              // Level 5: Table Member (Zone 18 Member)
                              <>
                                <div className="mb-3">
                                  <label className="admin-form-label">Full Name</label>
                                  <input
                                    type="text"
                                    className="form-control admin-form-control"
                                    value={tableMemberForm.name}
                                    onChange={(e) => setTableMemberForm({ ...tableMemberForm, name: e.target.value })}
                                    placeholder="John Doe"
                                    required
                                  />
                                </div>
                                <div className="mb-3">
                                  <label className="admin-form-label">Mobile Number</label>
                                  <input
                                    type="text"
                                    className="form-control admin-form-control"
                                    value={tableMemberForm.mobile}
                                    onChange={(e) => setTableMemberForm({ ...tableMemberForm, mobile: e.target.value })}
                                    placeholder="9876543210 (without +91)"
                                    required
                                  />
                                </div>
                                <div className="mb-3">
                                  <label className="admin-form-label">Select Table Name</label>
                                  <select
                                    className="form-select admin-form-control admin-form-select"
                                    value={tableMemberForm.tableName}
                                    onChange={(e) => setTableMemberForm({ ...tableMemberForm, tableName: e.target.value })}
                                    required
                                  >
                                    {(dashboardData.jcomTables && dashboardData.jcomTables.length > 0
                                      ? dashboardData.jcomTables.map((t) => t.name)
                                      : zoneTables
                                    ).map((tbl) => (
                                      <option key={tbl} value={tbl}>
                                        {tbl}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <div className="mb-3">
                                  <label className="admin-form-label">Business Name / Profession</label>
                                  <input
                                    type="text"
                                    className="form-control admin-form-control"
                                    value={tableMemberForm.business}
                                    onChange={(e) => setTableMemberForm({ ...tableMemberForm, business: e.target.value })}
                                    placeholder="e.g. ABC Textiles, Software Engineer"
                                    required
                                  />
                                </div>
                                <div className="mb-3">
                                  <label className="admin-form-label">Address</label>
                                  <textarea
                                    className="form-control admin-form-control"
                                    rows={3}
                                    value={tableMemberForm.address}
                                    onChange={(e) => setTableMemberForm({ ...tableMemberForm, address: e.target.value })}
                                    placeholder="Address details..."
                                    required
                                  ></textarea>
                                </div>
                              </>
                            ) : memberLevel === "Zone 18 Table Member" ? (
                              // Level 4: JCOM Table (Zone 18 Table Member)
                              <>
                                <div className="mb-3">
                                  <label className="admin-form-label">Table Name</label>
                                  <input
                                    type="text"
                                    className="form-control admin-form-control"
                                    value={jcomTableForm.name}
                                    onChange={(e) => setJcomTableForm({ ...jcomTableForm, name: e.target.value })}
                                    placeholder="JCOM L Town 1.0"
                                    required
                                  />
                                </div>
                                <div className="mb-3">
                                  <label className="admin-form-label">Contact Phone</label>
                                  <input
                                    type="text"
                                    className="form-control admin-form-control"
                                    value={jcomTableForm.phone}
                                    onChange={(e) => setJcomTableForm({ ...jcomTableForm, phone: e.target.value })}
                                    placeholder="+919876543210"
                                    required
                                  />
                                </div>
                                <div className="mb-3">
                                  <label className="admin-form-label">Contact Email</label>
                                  <input
                                    type="email"
                                    className="form-control admin-form-control"
                                    value={jcomTableForm.email}
                                    onChange={(e) => setJcomTableForm({ ...jcomTableForm, email: e.target.value })}
                                    placeholder="info@jcom.org"
                                    required
                                  />
                                </div>
                              </>
                            ) : (
                              // Levels 1, 2, 3: Chairman, Post Chairman, Table Member (Governing Board)
                              <>
                                <div className="mb-3">
                                  <label className="admin-form-label">Full Name</label>
                                  <input type="text" className="form-control admin-form-control" value={teamForm.name} onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })} placeholder="John Doe" required />
                                </div>

                                {memberLevel === "Table Member" ? (
                                  <div className="mb-3">
                                    <label className="admin-form-label">Role / Designation</label>
                                    <input type="text" className="form-control admin-form-control" value={teamForm.role} onChange={(e) => setTeamForm({ ...teamForm, role: e.target.value })} placeholder="e.g. JCOM President, Secretary, Treasurer" required />
                                  </div>
                                ) : (
                                  <div className="mb-3">
                                    <label className="admin-form-label">Role / Designation</label>
                                    <input type="text" className="form-control admin-form-control" value={memberLevel === "Chairman" ? "Zone Chairman" : "Past Zone Chairman"} disabled />
                                  </div>
                                )}

                                <div className="row g-2 mb-3">
                                  <div className="col-6">
                                    <label className="admin-form-label">Phone Number</label>
                                    <input type="text" className="form-control admin-form-control" placeholder="+91 98765 43210" value={teamForm.phone} onChange={(e) => setTeamForm({ ...teamForm, phone: e.target.value })} />
                                  </div>
                                  <div className="col-6">
                                    <label className="admin-form-label">WhatsApp Number</label>
                                    <input type="text" className="form-control admin-form-control" placeholder="919876543210" value={teamForm.whatsapp} onChange={(e) => setTeamForm({ ...teamForm, whatsapp: e.target.value })} />
                                  </div>
                                </div>
                                <div className="mb-3">
                                  <label className="admin-form-label">Upload Photo File (Direct Upload)</label>
                                  <input type="file" className="form-control admin-form-control" id="t_image_file" accept="image/*" onChange={(e) => setTeamFile(e.target.files?.[0] || null)} />
                                </div>
                                <div className="mb-3">
                                  <label className="admin-form-label">OR Photo URL</label>
                                  <input type="text" className="form-control admin-form-control" placeholder="https://... or /uploads/..." value={teamForm.imageUrl} onChange={(e) => setTeamForm({ ...teamForm, imageUrl: e.target.value })} />
                                </div>
                                <div className="mb-3">
                                  <label className="admin-form-label">Bio / Business Domain</label>
                                  <textarea className="form-control admin-form-control" rows={3} placeholder="Brief description of business or bio..." value={teamForm.bio} onChange={(e) => setTeamForm({ ...teamForm, bio: e.target.value })}></textarea>
                                </div>
                              </>
                            )}

                            <button type="submit" className="btn btn-admin-primary w-100 mt-2" disabled={submittingTeam}>
                              {submittingTeam ? (
                                <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Saving...</>
                              ) : (isEditing ? "Update Member" : "Save Member")}
                            </button>

                            {isEditing && (
                              <button type="button" className="btn btn-secondary w-100 mt-2" onClick={resetMemberForm}>
                                Cancel Edit
                              </button>
                            )}
                          </form>
                        </div>
                      </div>
                    </div>

                    {/* List Column */}
                    <div className="col-lg-7">
                      <div className="admin-card">
                        <div className="admin-card-header d-flex justify-content-between align-items-center flex-wrap gap-2 pb-0" style={{ borderBottom: "1px solid #f1f5f9" }}>
                          <ul className="nav nav-tabs border-0 nav-tabs-scrollable" style={{ gap: "10px", marginBottom: "-1px" }}>
                            <li className="nav-item">
                              <button 
                                className={`nav-link border-0 px-3 py-2 fw-semibold ${teamSubTab === "governing" ? "active text-primary" : "text-muted"}`}
                                style={{ 
                                  background: "transparent", 
                                  borderBottom: teamSubTab === "governing" ? "3px solid #3b82f6" : "3px solid transparent",
                                  borderRadius: 0
                                }}
                                onClick={() => setTeamSubTab("governing")}
                              >
                                <i className="bi bi-people-fill me-2"></i>Governing Board
                              </button>
                            </li>
                            <li className="nav-item">
                              <button 
                                className={`nav-link border-0 px-3 py-2 fw-semibold ${teamSubTab === "tables" ? "active text-primary" : "text-muted"}`}
                                style={{ 
                                  background: "transparent", 
                                  borderBottom: teamSubTab === "tables" ? "3px solid #3b82f6" : "3px solid transparent",
                                  borderRadius: 0
                                }}
                                onClick={() => setTeamSubTab("tables")}
                              >
                                <i className="bi bi-diagram-3-fill me-2"></i>JCOM Tables
                              </button>
                            </li>
                            <li className="nav-item">
                              <button 
                                className={`nav-link border-0 px-3 py-2 fw-semibold ${teamSubTab === "members" ? "active text-primary" : "text-muted"}`}
                                style={{ 
                                  background: "transparent", 
                                  borderBottom: teamSubTab === "members" ? "3px solid #3b82f6" : "3px solid transparent",
                                  borderRadius: 0
                                }}
                                onClick={() => setTeamSubTab("members")}
                              >
                                <i className="bi bi-grid-3x3-gap-fill me-2"></i>Table Members
                              </button>
                            </li>
                          </ul>
                          
                          {teamSubTab === "members" && (
                            <div className="pb-2">
                              <select
                                className="form-select admin-form-control admin-form-select py-1 px-3 fs-7"
                                style={{ width: "220px", fontSize: "0.85rem" }}
                                value={filterTableSelected}
                                onChange={(e) => setFilterTableSelected(e.target.value)}
                              >
                                {(dashboardData.jcomTables && dashboardData.jcomTables.length > 0
                                  ? dashboardData.jcomTables.map((t) => t.name)
                                  : zoneTables
                                ).map((tbl) => (
                                  <option key={tbl} value={tbl}>
                                    {tbl}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>
                        <div className="admin-card-body p-0">
                          {teamSubTab === "governing" && (
                            <div className="admin-table-container">
                              <table className="admin-table">
                                <thead>
                                  <tr>
                                    <th>Member Info</th>
                                    <th>Role</th>
                                    <th>Contact Details</th>
                                    <th className="text-end">Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {dashboardData.team.length > 0 ? (
                                    dashboardData.team.map((member) => (
                                      <tr key={member.id}>
                                        <td>
                                          <div className="d-flex align-items-center gap-3">
                                            <img src={member.imageUrl || "https://placehold.co/50x50"} alt={member.name} className="rounded-circle object-fit-cover shadow-sm border border-light" width="42" height="42" />
                                            <div>
                                              <div className="fw-semibold text-dark">{member.name}</div>
                                              <div className="text-muted small">ID: {displayId(member.id)}</div>
                                              {member.bio && <div className="text-muted small text-truncate" style={{ maxWidth: '180px' }} title={member.bio}>{member.bio}</div>}
                                            </div>
                                          </div>
                                        </td>
                                        <td><span className="badge badge-soft-blue px-2.5 py-1.5 rounded">{member.role}</span></td>
                                        <td>
                                          <div className="small text-muted mb-1"><i className="bi bi-telephone-fill me-1"></i>{member.phone || "-"}</div>
                                          <div className="small text-muted"><i className="bi bi-whatsapp me-1 text-success"></i>{member.whatsapp || "-"}</div>
                                        </td>
                                        <td className="text-end">
                                          <div className="d-flex justify-content-end gap-2">
                                            <button className="btn btn-admin-outline-primary btn-sm" onClick={() => startEditTeamMember(member)} title="Edit Member">
                                              <i className="bi bi-pencil-fill"></i>
                                            </button>
                                            <button className="btn btn-admin-outline-danger btn-sm" onClick={() => handleDelete("TeamMembers", member.id)} title="Delete Member">
                                              <i className="bi bi-trash-fill"></i>
                                            </button>
                                          </div>
                                        </td>
                                      </tr>
                                    ))
                                  ) : (
                                    <tr>
                                      <td colSpan={4} className="text-center text-muted py-5">No team members found in database.</td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          )}

                          {teamSubTab === "tables" && (
                            <div className="admin-table-container">
                              <table className="admin-table">
                                <thead>
                                  <tr>
                                    <th>Table Name</th>
                                    <th>Contact Phone</th>
                                    <th>Contact Email</th>
                                    <th className="text-end">Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {dashboardData.jcomTables && dashboardData.jcomTables.length > 0 ? (
                                    dashboardData.jcomTables.map((table) => (
                                      <tr key={table.id}>
                                        <td>
                                          <div className="fw-bold text-dark">{table.name}</div>
                                        </td>
                                        <td>{table.phone || "-"}</td>
                                        <td>{table.email || "-"}</td>
                                        <td className="text-end">
                                          <div className="d-flex justify-content-end gap-2">
                                            <button className="btn btn-admin-outline-primary btn-sm" onClick={() => startEditJcomTable(table)} title="Edit JCOM Table">
                                              <i className="bi bi-pencil-fill"></i>
                                            </button>
                                            <button className="btn btn-admin-outline-danger btn-sm" onClick={() => handleDelete("jcomTable", table.id)} title="Delete JCOM Table">
                                              <i className="bi bi-trash-fill"></i>
                                            </button>
                                          </div>
                                        </td>
                                      </tr>
                                    ))
                                  ) : (
                                    <tr>
                                      <td colSpan={4} className="text-center text-muted py-5">No JCOM Tables found in database.</td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          )}

                          {teamSubTab === "members" && (
                            <div className="admin-table-container">
                              <table className="admin-table">
                                <thead>
                                  <tr>
                                    <th>Member Info</th>
                                    <th>Business</th>
                                    <th>Address</th>
                                    <th className="text-end">Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {dashboardData.tableMembers && dashboardData.tableMembers.filter((m) => m.tableName === filterTableSelected).length > 0 ? (
                                    dashboardData.tableMembers
                                      .filter((m) => m.tableName === filterTableSelected)
                                      .map((member) => (
                                        <tr key={member.id}>
                                          <td>
                                            <div className="fw-semibold text-dark">{member.name}</div>
                                            <div className="small text-muted mt-1">
                                              ID: {displayId(member.id)} | <i className="bi bi-telephone-fill"></i> {member.mobile}
                                            </div>
                                          </td>
                                          <td>
                                            <span className="badge badge-soft-blue px-2 py-1 rounded">
                                              {member.business}
                                            </span>
                                          </td>
                                          <td>
                                            <div className="small text-muted text-wrap" style={{ maxWidth: "200px" }}>
                                              {member.address}
                                            </div>
                                          </td>
                                          <td className="text-end">
                                            <div className="d-flex justify-content-end gap-2">
                                              <button
                                                className="btn btn-admin-outline-primary btn-sm"
                                                onClick={() => startEditTableMember(member)}
                                                title="Edit Table Member"
                                              >
                                                <i className="bi bi-pencil-fill"></i>
                                              </button>
                                              <button
                                                className="btn btn-admin-outline-danger btn-sm"
                                                onClick={() => handleDelete("tableMember", member.id)}
                                                title="Delete Table Member"
                                              >
                                                <i className="bi bi-trash-fill"></i>
                                              </button>
                                            </div>
                                          </td>
                                        </tr>
                                      ))
                                  ) : (
                                    <tr>
                                      <td colSpan={4} className="text-center text-muted py-5">
                                        No members found in {filterTableSelected}.
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* EVENTS TAB */}
                {activeTab === "events" && (
                  <div className="row g-4">
                    {/* Form Column */}
                    <div className="col-lg-5">
                      <div className="admin-card">
                        <div className="admin-card-header">
                          <h5 className="fw-bold m-0 text-dark"><i className="bi bi-calendar-plus-fill me-2 text-primary"></i>Add Event</h5>
                        </div>
                        <div className="admin-card-body">
                          <form onSubmit={handleEventSubmit}>
                            <div className="mb-3">
                              <label className="admin-form-label">Event Title</label>
                              <input type="text" className="form-control admin-form-control" value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} placeholder="e.g. Annual Summit 2026" required />
                            </div>
                            <div className="row g-2 mb-3">
                              <div className="col-6">
                                <label className="admin-form-label">Category</label>
                                <select className="form-select admin-form-control admin-form-select" value={eventForm.category} onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}>
                                  <option value="Summit">Summit</option>
                                  <option value="Trade Expo">Trade Expo</option>
                                  <option value="Workshop">Workshop</option>
                                  <option value="Networking">Networking</option>
                                  <option value="Awards Night">Awards Night</option>
                                </select>
                              </div>
                              <div className="col-6">
                                <label className="admin-form-label">Date</label>
                                <input type="date" className="form-control admin-form-control" value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} required />
                              </div>
                            </div>
                            <div className="row g-2 mb-3">
                              <div className="col-6">
                                <label className="admin-form-label">Time</label>
                                <input type="text" className="form-control admin-form-control" placeholder="09:30 AM - 05:30 PM" value={eventForm.time} onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })} />
                              </div>
                              <div className="col-6">
                                <label className="admin-form-label">Location</label>
                                <input type="text" className="form-control admin-form-control" placeholder="e.g. Chennai" value={eventForm.location} onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })} required />
                              </div>
                            </div>
                            <div className="mb-3">
                              <label className="admin-form-label">Upload Poster Image (Direct Upload)</label>
                              <input type="file" className="form-control admin-form-control" id="e_image_file" accept="image/*" onChange={(e) => setEventFile(e.target.files?.[0] || null)} />
                            </div>
                            <div className="mb-3">
                              <div className="d-flex align-items-center justify-content-between mb-2">
                                <label className="admin-form-label m-0">Upload Gallery Images (Max 5)</label>
                                <div className="d-flex gap-1">
                                  <button type="button" className="btn btn-outline-primary btn-sm py-0 px-2" onClick={() => setGalleryInputCount(c => c < 5 ? c + 1 : c)} disabled={galleryInputCount >= 5} title="Add image upload field">
                                    <i className="bi bi-plus-lg"></i>
                                  </button>
                                  <button type="button" className="btn btn-outline-danger btn-sm py-0 px-2" onClick={() => setGalleryInputCount(c => c > 1 ? c - 1 : c)} disabled={galleryInputCount <= 1} title="Remove image upload field">
                                    <i className="bi bi-dash-lg"></i>
                                  </button>
                                </div>
                              </div>
                              {Array.from({ length: galleryInputCount }).map((_, i) => (
                                <div className="d-flex align-items-center mb-2" key={i}>
                                  <span className="text-muted small me-2" style={{ minWidth: "20px" }}>#{i+1}</span>
                                  <input type="file" className="form-control admin-form-control py-1" name="galleryFiles" accept="image/*" />
                                </div>
                              ))}
                            </div>
                            <div className="mb-3">
                              <label className="admin-form-label">OR Event Photo URL</label>
                              <input type="text" className="form-control admin-form-control" placeholder="https://... or /uploads/..." value={eventForm.imageUrl} onChange={(e) => setEventForm({ ...eventForm, imageUrl: e.target.value })} />
                            </div>
                            <div className="mb-3">
                              <label className="admin-form-label">Action URL (Registration Google Form, etc.)</label>
                              <input type="url" className="form-control admin-form-control" placeholder="https://..." value={eventForm.actionUrl} onChange={(e) => setEventForm({ ...eventForm, actionUrl: e.target.value })} />
                            </div>
                            <div className="mb-3">
                              <label className="admin-form-label">Event Description</label>
                              <textarea className="form-control admin-form-control" rows={3} placeholder="Describe the JCOM event details..." value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} required></textarea>
                            </div>
                            <button type="submit" className="btn btn-admin-primary w-100 mt-2" disabled={submittingEvent}>
                              {submittingEvent ? (
                                <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Creating...</>
                              ) : "Create Event"}
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>

                    {/* List Column */}
                    <div className="col-lg-7">
                      <div className="admin-card">
                        <div className="admin-card-header">
                          <h5 className="fw-bold m-0 text-dark"><i className="bi bi-calendar-event-fill me-2 text-primary"></i>Current JCOM Events</h5>
                        </div>
                        <div className="admin-card-body p-0">
                          <div className="admin-table-container">
                            <table className="admin-table">
                              <thead>
                                <tr>
                                  <th>Event Detail</th>
                                  <th>Date & Time</th>
                                  <th>Location</th>
                                  <th className="text-end">Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {dashboardData.events.length > 0 ? (
                                  dashboardData.events.map((event) => (
                                    <tr key={event.id}>
                                      <td>
                                        <div className="d-flex align-items-center gap-3">
                                          <img src={event.imageUrl || "https://placehold.co/80x50"} alt={event.title} className="rounded object-fit-cover shadow-sm border border-light" width="60" height="42" />
                                          <div>
                                            <div className="fw-semibold text-dark text-truncate" style={{ maxWidth: '160px' }} title={event.title}>{event.title}</div>
                                            <div className="d-flex gap-2 align-items-center mt-1">
                                              <span className="badge badge-soft-blue px-2 py-0.5 rounded small">{event.category}</span>
                                              {event.galleryImages && event.galleryImages.length > 0 && (
                                                <span className="text-muted small"><i className="bi bi-images me-1"></i>{event.galleryImages.length}</span>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </td>
                                      <td>
                                        <div className="fw-semibold text-dark">{new Date(event.date).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}</div>
                                        {event.time && <div className="text-muted small">{event.time}</div>}
                                      </td>
                                      <td>
                                        <span className="text-muted small"><i className="bi bi-geo-alt-fill me-1"></i>{event.location}</span>
                                      </td>
                                      <td className="text-end">
                                        <button className="btn btn-admin-outline-danger btn-sm" onClick={() => handleDelete("Events", event.id)} title="Delete Event">
                                          <i className="bi bi-trash-fill"></i>
                                        </button>
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan={4} className="text-center text-muted py-5">No events found in database.</td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* MEMBERSHIP TAB */}
                {activeTab === "apps" && (
                  <div className="admin-card">
                    <div className="admin-card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
                      <h5 className="fw-bold m-0 text-dark"><i className="bi bi-person-check-fill me-2 text-success"></i>Membership Applications</h5>
                      <span className="badge badge-soft-green px-3 py-1.5 rounded">{dashboardData.applications.length} Received</span>
                    </div>
                    <div className="admin-card-body p-0">
                      <div className="admin-table-container">
                        <table className="admin-table">
                          <thead>
                            <tr>
                              <th>Applicant Name</th>
                              <th>Contact Details</th>
                              <th>Company & Industry</th>
                              <th>Intro Message</th>
                              <th>Applied Date</th>
                              <th className="text-end">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {dashboardData.applications.length > 0 ? (
                              dashboardData.applications.map((app) => (
                                <tr key={app.id}>
                                  <td>
                                    <div className="fw-bold text-dark">{app.name}</div>
                                  </td>
                                  <td>
                                    <div className="small text-dark"><i className="bi bi-envelope-fill me-1 text-secondary"></i>{app.email}</div>
                                    <div className="small text-muted mt-1">
                                      <span className="me-2"><i className="bi bi-telephone-fill me-1"></i>{app.phone}</span>
                                      <span><i className="bi bi-whatsapp me-1 text-success"></i>{app.whatsapp}</span>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="fw-semibold text-dark">{app.company || "-"}</div>
                                    <div className="text-muted small mt-1">{app.industry || "-"}</div>
                                  </td>
                                  <td>
                                    <div className="text-muted small text-wrap" style={{ maxWidth: "250px", maxHeight: "60px", overflowY: "auto" }}>
                                      {app.message}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="small text-muted">{new Date(app.timestamp).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}</div>
                                    <div className="small text-muted" style={{fontSize: "11px"}}>{new Date(app.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                                  </td>
                                  <td className="text-end">
                                    <button className="btn btn-admin-outline-danger btn-sm" onClick={() => handleDelete("membership", app.id)} title="Delete Application">
                                      <i className="bi bi-trash-fill"></i>
                                    </button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={6} className="text-center text-muted py-5">No membership applications found in database.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* CONTACTS TAB */}
                {activeTab === "contacts" && (
                  <div className="admin-card">
                    <div className="admin-card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
                      <h5 className="fw-bold m-0 text-dark"><i className="bi bi-envelope-open-fill me-2 text-warning"></i>Contact Queries</h5>
                      <span className="badge badge-soft-amber px-3 py-1.5 rounded">{dashboardData.contacts.length} Queries</span>
                    </div>
                    <div className="admin-card-body p-0">
                      <div className="admin-table-container">
                        <table className="admin-table">
                          <thead>
                            <tr>
                              <th>Sender Name</th>
                              <th>Email Address</th>
                              <th>Message Details</th>
                              <th>Date Received</th>
                              <th className="text-end">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {dashboardData.contacts.length > 0 ? (
                              dashboardData.contacts.map((query) => (
                                <tr key={query.id}>
                                  <td>
                                    <div className="fw-bold text-dark">{query.name}</div>
                                  </td>
                                  <td>
                                    <div className="small text-dark"><i className="bi bi-envelope-fill me-1 text-secondary"></i>{query.email}</div>
                                  </td>
                                  <td>
                                    <div className="text-muted small text-wrap" style={{ maxWidth: "350px", maxHeight: "60px", overflowY: "auto" }}>
                                      {query.message}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="small text-muted">{new Date(query.timestamp).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}</div>
                                    <div className="small text-muted" style={{fontSize: "11px"}}>{new Date(query.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                                  </td>
                                  <td className="text-end">
                                    <button className="btn btn-admin-outline-danger btn-sm" onClick={() => handleDelete("contact", query.id)} title="Delete Query">
                                      <i className="bi bi-trash-fill"></i>
                                    </button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={5} className="text-center text-muted py-5">No contact queries found in database.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
