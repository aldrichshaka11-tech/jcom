"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getTableMembers } from "./tableActions";

function MembersDirectoryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tableName = searchParams.get("table") || "Zone 18 Table";

  const [members, setMembers] = useState<any[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getTableMembers(tableName).then((res) => {
      if (res.success && res.data) {
        setMembers(res.data);
        setFilteredMembers(res.data);
      }
      setLoading(false);
    });
  }, [tableName]);

  const isUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
  const displayId = (id: string) => isUUID(id) ? id.substring(0, 8) : id;

  useEffect(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) {
      setFilteredMembers(members);
    } else {
      const filtered = members.filter(
        (m) =>
          m.id.toLowerCase().includes(term) ||
          m.name.toLowerCase().includes(term) ||
          m.business.toLowerCase().includes(term) ||
          m.address.toLowerCase().includes(term)
      );
      setFilteredMembers(filtered);
    }
  }, [searchTerm, members]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        body { background-color: #f8fafc !important; }
        .banner-members {
          background: radial-gradient(circle at 10% 20%, rgba(15, 23, 42, 1) 0%, rgba(30, 41, 59, 1) 90%);
          padding: 60px 0;
          color: white;
          border-bottom: 4px solid #00a4ef;
        }
        .search-wrapper {
          position: relative;
          max-width: 500px;
          margin: -25px auto 40px auto;
          z-index: 10;
        }
        .search-input {
          padding: 16px 20px 16px 50px !important;
          border-radius: 50px !important;
          border: 1px solid #e2e8f0 !important;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05) !important;
          font-size: 15px !important;
          background-color: white !important;
        }
        .search-input:focus {
          border-color: #00a4ef !important;
          box-shadow: 0 10px 25px -5px rgba(0, 164, 239, 0.15) !important;
          outline: none !important;
        }
        .search-icon {
          position: absolute;
          left: 20px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          font-size: 18px;
        }
        .card-directory {
          background: white;
          border-radius: 20px;
          border: 1px solid #f1f5f9;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.01);
          overflow: hidden;
          margin-bottom: 50px;
        }
        .dir-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
        }
        .dir-table th {
          background-color: #f1f5f9;
          color: #475569;
          font-weight: 600;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 18px 24px;
          border-bottom: 1px solid #e2e8f0;
        }
        .dir-table td {
          padding: 20px 24px;
          border-bottom: 1px solid #f1f5f9;
          color: #1e293b;
          vertical-align: middle;
        }
        .dir-table tbody tr {
          transition: all 0.2s ease;
        }
        .dir-table tbody tr:hover {
          background-color: #f8fafc;
        }
        .icon-circle {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background-color: #e0f2fe;
          color: #0369a1;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }
        .btn-call {
          color: #0ea5e9;
          border: 1px solid #bae6fd;
          background-color: #f0f9ff;
          transition: all 0.2s ease;
        }
        .btn-call:hover {
          background-color: #0ea5e9;
          color: white;
          border-color: #0ea5e9;
        }
        .btn-wa {
          color: #22c55e;
          border: 1px solid #bbf7d0;
          background-color: #f0fdf4;
          transition: all 0.2s ease;
        }
        .btn-wa:hover {
          background-color: #22c55e;
          color: white;
          border-color: #22c55e;
        }
        .empty-state {
          padding: 60px 40px;
          text-align: center;
        }
        .empty-icon {
          font-size: 50px;
          color: #94a3b8;
          margin-bottom: 20px;
        }
        .back-link {
          color: white;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-weight: 500;
          font-size: 14px;
          opacity: 0.8;
          transition: all 0.2s ease;
          background: rgba(255, 255, 255, 0.1);
          padding: 8px 16px;
          border-radius: 50px;
        }
        .back-link:hover {
          opacity: 1;
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }
      ` }} />

      <section className="banner-members">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
            <Link href="/team" className="back-link">
              <i className="bi bi-arrow-left"></i> Back to Tables
            </Link>
            <img src="/images/logo1.png" height="50" style={{ filter: "brightness(0) invert(1)" }} alt="JCOM Logo" />
          </div>
          <div className="text-center py-3">
            <h1 className="fw-bold m-0" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>Members Directory</h1>
            <p className="lead m-0 mt-2 text-white-50">{tableName}</p>
          </div>
        </div>
      </section>

      <div className="container" style={{ maxWidth: "1200px" }}>
        {/* Search Bar */}
        <div className="search-wrapper">
          <i className="bi bi-search search-icon"></i>
          <input
            type="text"
            className="form-control search-input"
            placeholder="Search by name, business domain, address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Members Directory Card */}
        <div className="card-directory">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="mt-2 text-muted">Loading table members...</p>
            </div>
          ) : filteredMembers.length > 0 ? (
            <div className="table-responsive">
              <table className="dir-table">
                <thead>
                  <tr>
                    <th>Member Info</th>
                    <th>Contact</th>
                    <th>Business Details</th>
                    <th>Location / Address</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((member) => (
                    <tr key={member.id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <div className="icon-circle">
                            <i className="bi bi-person-fill"></i>
                          </div>
                          <div>
                            <div className="fw-bold text-dark" style={{ fontSize: "16px" }}>{member.name}</div>
                            <small className="text-muted">ID: {displayId(member.id)}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="fw-semibold text-dark mb-2">{member.mobile}</div>
                        <div className="d-flex gap-2">
                          <a
                            href={`tel:${member.mobile.replace(/\s+/g, "")}`}
                            className="btn btn-sm btn-call rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: "32px", height: "32px" }}
                            title="Call Member"
                          >
                            <i className="bi bi-telephone-fill"></i>
                          </a>
                          <a
                            href={`https://wa.me/${member.mobile.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-wa rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: "32px", height: "32px" }}
                            title="Chat on WhatsApp"
                          >
                            <i className="bi bi-whatsapp"></i>
                          </a>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-start gap-2">
                          <div className="text-primary mt-0.5"><i className="bi bi-briefcase-fill"></i></div>
                          <div>
                            <div className="fw-semibold text-dark">{member.business.split("(")[0].trim()}</div>
                            {member.business.includes("(") && (
                              <small className="text-muted block">
                                {member.business.substring(member.business.indexOf("("))}
                              </small>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-start gap-2 text-muted small" style={{ maxWidth: "250px" }}>
                          <div className="text-secondary mt-0.5"><i className="bi bi-geo-alt-fill"></i></div>
                          <span>{member.address}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <i className="bi bi-people empty-icon"></i>
              <h4 className="fw-bold text-dark">No Members Found</h4>
              <p className="text-muted">We couldn't find any members matching your search or registered under this table.</p>
              <Link href="/team" className="btn btn-primary btn-sm rounded-pill px-4 py-2 mt-3" style={{ background: "#00a4ef", border: "none" }}>
                Back to Tables
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function TableMembersPage() {
  return (
    <Suspense fallback={
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2 text-muted">Loading page...</p>
      </div>
    }>
      <MembersDirectoryContent />
    </Suspense>
  );
}
