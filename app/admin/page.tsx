"use client";

import React, { useState, useEffect } from "react";
import { getDashboardData, deleteItem, addTeamMember, addEvent } from "./actions";
import Link from "next/link";

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [activeTab, setActiveTab] = useState("team");
  
  const [loading, setLoading] = useState(true);
  const [dbConnected, setDbConnected] = useState<boolean | null>(null);
  
  const [dashboardData, setDashboardData] = useState<{
    team: any[];
    events: any[];
    applications: any[];
    contacts: any[];
  }>({
    team: [],
    events: [],
    applications: [],
    contacts: [],
  });

  const [teamForm, setTeamForm] = useState({
    name: "",
    role: "",
    phone: "",
    whatsapp: "",
    imageUrl: "",
    bio: "",
  });
  const [teamFile, setTeamFile] = useState<File | null>(null);

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

  const handleDelete = async (type: "TeamMembers" | "Events" | "membership" | "contact", id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    const result = await deleteItem(type, id);
    if (result.success) {
      alert("Item deleted successfully!");
      fetchAllData();
    } else {
      alert(result.error || "Failed to delete item.");
    }
  };

  const handleTeamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingTeam(true);

    const fd = new FormData();
    fd.append("name", teamForm.name);
    fd.append("role", teamForm.role);
    fd.append("phone", teamForm.phone);
    fd.append("whatsapp", teamForm.whatsapp);
    fd.append("bio", teamForm.bio);
    fd.append("imageUrl", teamForm.imageUrl);
    if (teamFile) {
      fd.append("imageFile", teamFile);
    }

    const result = await addTeamMember(fd);
    if (result.success) {
      alert("Team member added successfully!");
      setTeamForm({ name: "", role: "", phone: "", whatsapp: "", imageUrl: "", bio: "" });
      setTeamFile(null);
      // Reset file input
      const fileInput = document.getElementById("t_image_file") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      fetchAllData();
    } else {
      alert(result.error || "Failed to add team member.");
    }
    setSubmittingTeam(false);
  };

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingEvent(true);

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
    const rawFd = new FormData(e.currentTarget as HTMLFormElement);
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
    setSubmittingEvent(false);
  };

  if (!isLoggedIn) {
    return (
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "#0f172a", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ backgroundColor: "white", padding: "40px", borderRadius: "12px", textAlign: "center", width: "100%", maxWidth: "400px" }}>
          <img src="/images/logo1.png" height="60" className="mb-4 mx-auto d-block" alt="JCOM Logo" />
          <h4 className="fw-bold mb-4 text-dark">Admin Login</h4>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              className="form-control mb-3"
              placeholder="Enter Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary w-100 fw-bold">Login</button>
          </form>
          {loginError && <p className="text-danger mt-2 fw-semibold">Incorrect Password</p>}
        </div>
      </div>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        body { background-color: #f8fafc; }
        .admin-container {
          max-width: 1100px;
          margin: 40px auto;
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          padding: 40px;
        }
        .admin-header {
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .nav-pills .nav-link.active {
          background: linear-gradient(90deg, #1da1f2, #0077b5);
          color: white;
        }
        .nav-pills .nav-link {
          color: #475569;
          border: 1px solid #e2e8f0;
        }
      ` }} />

      <div className="admin-container">
        <div className="admin-header d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div className="d-flex align-items-center gap-3">
            <h2 className="fw-bold m-0 text-dark"><i className="bi bi-shield-lock-fill text-primary"></i> Control Panel</h2>
            {dbConnected === null && (
              <span className="badge bg-warning text-dark"><i className="bi bi-arrow-repeat spin"></i> Checking DB...</span>
            )}
            {dbConnected === true && (
              <span className="badge bg-success"><i className="bi bi-cloud-check-fill"></i> Database: Connected</span>
            )}
            {dbConnected === false && (
              <span className="badge bg-danger"><i className="bi bi-exclamation-triangle-fill"></i> Database: Error</span>
            )}
          </div>
          <Link href="/" className="btn btn-outline-secondary btn-sm"><i className="bi bi-house"></i> Back to Site</Link>
        </div>

        {/* Navigation Pills */}
        <ul className="nav nav-pills mb-4 gap-2">
          <li className="nav-item">
            <button className={`nav-link fw-bold px-4 ${activeTab === "team" ? "active" : ""}`} onClick={() => setActiveTab("team")}>Team Members</button>
          </li>
          <li className="nav-item">
            <button className={`nav-link fw-bold px-4 ${activeTab === "events" ? "active" : ""}`} onClick={() => setActiveTab("events")}>Events</button>
          </li>
          <li className="nav-item">
            <button className={`nav-link fw-bold px-4 ${activeTab === "apps" ? "active" : ""}`} onClick={() => setActiveTab("apps")}>Membership</button>
          </li>
          <li className="nav-item">
            <button className={`nav-link fw-bold px-4 ${activeTab === "contacts" ? "active" : ""}`} onClick={() => setActiveTab("contacts")}>Contact Queries</button>
          </li>
        </ul>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2 text-muted">Syncing with PostgreSQL database...</p>
          </div>
        ) : (
          <div className="tab-content">
            
            {/* TEAM TAB */}
            {activeTab === "team" && (
              <div>
                <div className="card border-0 shadow-sm border">
                  <div className="card-body p-4">
                    <h5 className="fw-bold mb-4 text-dark">Add New Team Member</h5>
                    <form onSubmit={handleTeamSubmit}>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label text-dark small fw-bold">Name</label>
                          <input type="text" className="form-control" value={teamForm.name} onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })} required />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label text-dark small fw-bold">Role (e.g. Chairman, President, Vice Chairman)</label>
                          <input type="text" className="form-control" value={teamForm.role} onChange={(e) => setTeamForm({ ...teamForm, role: e.target.value })} required />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label text-dark small fw-bold">Phone</label>
                          <input type="text" className="form-control" placeholder="e.g. +91 9876543210" value={teamForm.phone} onChange={(e) => setTeamForm({ ...teamForm, phone: e.target.value })} />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label text-dark small fw-bold">WhatsApp</label>
                          <input type="text" className="form-control" placeholder="e.g. 919876543210" value={teamForm.whatsapp} onChange={(e) => setTeamForm({ ...teamForm, whatsapp: e.target.value })} />
                        </div>
                        
                        <div className="col-md-6">
                          <label className="form-label text-dark small fw-bold">Upload Image File (Direct Upload)</label>
                          <input type="file" className="form-control" id="t_image_file" accept="image/*" onChange={(e) => setTeamFile(e.target.files?.[0] || null)} />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label text-dark small fw-bold">OR Photo URL</label>
                          <input type="url" className="form-control" placeholder="https://..." value={teamForm.imageUrl} onChange={(e) => setTeamForm({ ...teamForm, imageUrl: e.target.value })} />
                        </div>

                        <div className="col-12">
                          <label className="form-label text-dark small fw-bold">Bio / Business Domain</label>
                          <textarea className="form-control" rows={3} placeholder="Brief description of business or bio..." value={teamForm.bio} onChange={(e) => setTeamForm({ ...teamForm, bio: e.target.value })}></textarea>
                        </div>
                        <div className="col-12 text-end">
                          <button type="submit" className="btn btn-primary fw-bold px-5" disabled={submittingTeam}>
                            {submittingTeam ? "Adding..." : "Add Member"}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>

                <div className="card border-0 shadow-sm mt-4 border">
                  <div className="card-body p-4">
                    <h5 className="fw-bold mb-3 text-dark">Current Team Members</h5>
                    <div className="table-responsive">
                      <table className="table table-hover align-middle">
                        <thead className="table-light">
                          <tr>
                            <th>Photo</th>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Phone / WhatsApp</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dashboardData.team.length > 0 ? (
                            dashboardData.team.map((member) => (
                              <tr key={member.id}>
                                <td>
                                  <img src={member.imageUrl || "https://placehold.co/50x50"} alt={member.name} className="rounded-circle object-fit-cover" width="40" height="40" />
                                </td>
                                <td className="text-dark"><strong>{member.name}</strong></td>
                                <td><span className="badge bg-secondary">{member.role}</span></td>
                                <td className="text-muted small">{member.phone || "-" } / {member.whatsapp || "-"}</td>
                                <td>
                                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete("TeamMembers", member.id)}>
                                    <i className="bi bi-trash"></i> Delete
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={5} className="text-center text-muted py-4">No team members found in database.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* EVENTS TAB */}
            {activeTab === "events" && (
              <div>
                <div className="card border-0 shadow-sm border">
                  <div className="card-body p-4">
                    <h5 className="fw-bold mb-4 text-dark">Add New JCOM Event</h5>
                    <form onSubmit={handleEventSubmit}>
                      <div className="row g-3">
                        <div className="col-md-8">
                          <label className="form-label text-dark small fw-bold">Event Title</label>
                          <input type="text" className="form-control" value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} required />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label text-dark small fw-bold">Category / Badge</label>
                          <select className="form-select" value={eventForm.category} onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}>
                            <option value="Summit">Summit</option>
                            <option value="Trade Expo">Trade Expo</option>
                            <option value="Workshop">Workshop</option>
                            <option value="Networking">Networking</option>
                            <option value="Awards Night">Awards Night</option>
                          </select>
                        </div>
                        <div className="col-md-4">
                          <label className="form-label text-dark small fw-bold">Date</label>
                          <input type="date" className="form-control" value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} required />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label text-dark small fw-bold">Time</label>
                          <input type="text" className="form-control" placeholder="e.g. 09:30 AM - 05:30 PM" value={eventForm.time} onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })} />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label text-dark small fw-bold">Location</label>
                          <input type="text" className="form-control" placeholder="e.g. Chennai" value={eventForm.location} onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })} required />
                        </div>
                        
                        <div className="col-md-6">
                          <label className="form-label text-dark small fw-bold">Upload Event Image (Direct Upload)</label>
                          <input type="file" className="form-control" id="e_image_file" accept="image/*" onChange={(e) => setEventFile(e.target.files?.[0] || null)} />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label text-dark small fw-bold">Upload Gallery Images (Max 5)</label>
                          {Array.from({ length: galleryInputCount }).map((_, i) => (
                            <div className="d-flex align-items-center mb-2" key={i}>
                              <input type="file" className="form-control" name="galleryFiles" accept="image/*" multiple />
                              {i === galleryInputCount - 1 && (
                                <button type="button" className="btn btn-outline-primary ms-2 fw-bold" onClick={() => setGalleryInputCount(c => c < 5 ? c + 1 : c)} title="Add another image row" disabled={galleryInputCount >= 5}>
                                  +
                                </button>
                              )}
                              {galleryInputCount > 1 && i === galleryInputCount - 1 && (
                                <button type="button" className="btn btn-outline-danger ms-2 fw-bold" onClick={() => setGalleryInputCount(c => c - 1)} title="Remove row">
                                  -
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                        <div className="col-md-6">
                          <label className="form-label text-dark small fw-bold">OR Event Photo URL</label>
                          <input type="url" className="form-control" placeholder="https://..." value={eventForm.imageUrl} onChange={(e) => setEventForm({ ...eventForm, imageUrl: e.target.value })} />
                        </div>
                        
                        <div className="col-md-12">
                          <label className="form-label text-dark small fw-bold">Register URL / Action URL (Google Form, etc.)</label>
                          <input type="url" className="form-control" placeholder="https://..." value={eventForm.actionUrl} onChange={(e) => setEventForm({ ...eventForm, actionUrl: e.target.value })} />
                        </div>
                        <div className="col-12">
                          <label className="form-label text-dark small fw-bold">Event Description</label>
                          <textarea className="form-control" rows={3} placeholder="Describe the JCOM event details here..." value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} required></textarea>
                        </div>
                        <div className="col-12 text-end">
                          <button type="submit" className="btn btn-primary fw-bold px-5" disabled={submittingEvent}>
                            {submittingEvent ? "Adding..." : "Add Event"}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>

                <div className="card border-0 shadow-sm mt-4 border">
                  <div className="card-body p-4">
                    <h5 className="fw-bold mb-3 text-dark">Current JCOM Events</h5>
                    <div className="table-responsive">
                      <table className="table table-hover align-middle">
                        <thead className="table-light">
                          <tr>
                            <th>Photo</th>
                            <th>Event Title</th>
                            <th>Date & Time</th>
                            <th>Location</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dashboardData.events.length > 0 ? (
                            dashboardData.events.map((event) => (
                              <tr key={event.id}>
                                <td>
                                  <img src={event.imageUrl || "https://placehold.co/80x50"} alt={event.title} className="rounded object-fit-cover" width="60" height="40" />
                                </td>
                                <td className="text-dark">
                                  <strong>{event.title}</strong> <br />
                                  <div className="d-flex gap-2 align-items-center mt-1">
                                    <span className="badge bg-info text-dark small">{event.category}</span>
                                    {event.galleryImages && event.galleryImages.length > 0 && (
                                      <span className="badge bg-secondary small"><i className="bi bi-images me-1"></i>{event.galleryImages.length}</span>
                                    )}
                                  </div>
                                </td>
                                <td className="text-muted small">
                                  {new Date(event.date).toLocaleDateString()} <br />
                                  {event.time && <small>{event.time}</small>}
                                </td>
                                <td className="text-muted small">{event.location}</td>
                                <td>
                                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete("Events", event.id)}>
                                    <i className="bi bi-trash"></i> Delete
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={5} className="text-center text-muted py-4">No events found in database.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MEMBERSHIP APPLICATIONS TAB */}
            {activeTab === "apps" && (
              <div className="card border-0 shadow-sm border">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-3 text-dark">Membership Applications</h5>
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Name</th>
                          <th>Email / Phone</th>
                          <th>Company / Industry</th>
                          <th>Message</th>
                          <th>Applied Date</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardData.applications.length > 0 ? (
                          dashboardData.applications.map((app) => (
                            <tr key={app.id}>
                              <td className="text-dark"><strong>{app.name}</strong></td>
                              <td className="text-muted small">
                                {app.email} <br />
                                <small>Phone: {app.phone} | WA: {app.whatsapp}</small>
                              </td>
                              <td className="text-muted small">
                                {app.company || "-"} <br />
                                <small>{app.industry || "-"}</small>
                              </td>
                              <td>
                                <span className="small text-muted" title={app.message}>
                                  {app.message ? app.message.substring(0, 70) + (app.message.length > 70 ? "..." : "") : ""}
                                </span>
                              </td>
                              <td className="text-muted small">{new Date(app.timestamp).toLocaleString()}</td>
                              <td>
                                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete("membership", app.id)}>
                                    <i className="bi bi-trash"></i> Delete
                                  </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="text-center text-muted py-4">No applications received yet.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* CONTACT QUERIES TAB */}
            {activeTab === "contacts" && (
              <div className="card border-0 shadow-sm border">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-3 text-dark">Contact Queries</h5>
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Message</th>
                          <th>Submitted Date</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardData.contacts.length > 0 ? (
                          dashboardData.contacts.map((query) => (
                            <tr key={query.id}>
                              <td className="text-dark"><strong>{query.name}</strong></td>
                              <td className="text-muted small">{query.email}</td>
                              <td>
                                <span className="small text-muted" title={query.message}>
                                  {query.message ? query.message.substring(0, 70) + (query.message.length > 70 ? "..." : "") : ""}
                                </span>
                              </td>
                              <td className="text-muted small">{new Date(query.timestamp).toLocaleString()}</td>
                              <td>
                                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete("contact", query.id)}>
                                    <i className="bi bi-trash"></i> Delete
                                  </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="text-center text-muted py-4">No contact messages received yet.</td>
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
      </div>
    </>
  );
}
