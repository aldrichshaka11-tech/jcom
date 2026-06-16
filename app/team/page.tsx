import { db } from "@/lib/db";
import Link from "next/link";
import TeamModalHandler from "./TeamModalHandler";

export const revalidate = 0; // ensure page is always dynamically rendered

export default async function TeamPage() {
  // Fetch dynamic members from PostgreSQL
  let dbMembers: any[] = [];
  try {
    dbMembers = await db.teamMember.findMany({
      orderBy: { createdAt: "asc" },
    });
  } catch (error) {
    console.error("Error fetching team members from DB:", error);
  }

  // Find chairman and past chairman from DB
  const dbChairman = dbMembers.find(
    (m) =>
      m.role.toLowerCase().includes("chairman") &&
      !m.role.toLowerCase().includes("past")
  );
  const dbPastChairman = dbMembers.find(
    (m) =>
      m.role.toLowerCase().includes("past chairman") ||
      m.role.toLowerCase().includes("past-chairman")
  );

  // Filter board members (everyone who is not a chairman or past chairman)
  const dbBoardMembers = dbMembers.filter(
    (m) => !m.role.toLowerCase().includes("chairman")
  );

  // Static Fallback Team Members (shown if no board members are in the database)
  const staticBoardMembers = [
    {
      name: "Rajamoorthy R",
      role: "JCOM President",
      imageUrl: "/team/rajamoorthy2.jpg",
      bio: "Rajamoorthy R is a dynamic and visionary leader who drives JCOM's mission of empowering business leaders and building communities across the region.",
      phone: "+91 98765 43210",
      whatsapp: "+91 98765 43210",
      domain: "Corporate Leadership & Strategic Growth",
      location: "JCOM HQ, Tamil Nadu, India",
    },
    {
      name: "Sundar Rajan",
      role: "Vice President",
      imageUrl: "/team/virtual-photoshoot-2 (6) - sundar rajan.jpg",
      bio: "Sundar Rajan brings strong leadership and strategic vision to JCOM, supporting business growth and community development initiatives.",
      phone: "+91 98765 43211",
      whatsapp: "+91 98765 43211",
      domain: "Community Development & Networking",
      location: "JCOM Regional Office, India",
    },
    {
      name: "Gayathri T.",
      role: "Secretary",
      imageUrl: "/team/Screenshot_20251201_210947_Photos - Gayathri Thirupathi.jpg",
      bio: "Gayathri Thirupathi is a committed professional who excels in organizational management and serves as a vital bridge within the JCOM network.",
      phone: "+91 98765 43212",
      whatsapp: "+91 98765 43212",
      domain: "Organizational Management & Coordination",
      location: "JCOM Administration, India",
    },
    {
      name: "Loganathan G",
      role: "Treasurer",
      imageUrl: "/team/LOGU assistant coach - JFD.G LOGANATHAN.png",
      bio: "JFD.G Loganathan manages JCOM's financial operations with precision and integrity, ensuring fiscal responsibility across all initiatives.",
      phone: "+91 98765 43213",
      whatsapp: "+91 98765 43213",
      domain: "Financial Management & Fiscal Control",
      location: "Finance Dept, JCOM, India",
    },
    {
      name: "Jeeth Pandien",
      role: "Board Member",
      imageUrl: "/team/JEETH PASSPOT SIZE PHOTO - Jeeth Pandien.jpg",
      bio: "Jeeth Pandien is an energetic board member who actively participates in JCOM's events and drives strategic committee initiatives.",
      phone: "+91 98765 43214",
      whatsapp: "+91 98765 43214",
      domain: "Strategic Committee Leadership",
      location: "JCOM Board, India",
    },
    {
      name: "Aarojin Raja",
      role: "Committee Head",
      imageUrl: "/team/IMG_20260405_121710_263~2 - Aarojin Infant Raja.png",
      bio: "Aarojin Infant Raja leads key JCOM committees with dedication, focusing on business development and community engagement.",
      phone: "+91 98765 43215",
      whatsapp: "+91 98765 43215",
      domain: "Business Dev & Community Engagement",
      location: "JCOM Projects, India",
    },
    {
      name: "Maruthi S.",
      role: "Board Member",
      imageUrl: "/team/Screenshot_20260301_061402_Gallery - Maruthi Sivakasi.jpg",
      bio: "Maruthi Sivakasi is a dedicated JCOM board member contributing to leadership programs and regional business networking efforts.",
      phone: "+91 98765 43216",
      whatsapp: "+91 98765 43216",
      domain: "Leadership Programs & Networking",
      location: "JCOM Sivakasi, India",
    },
    {
      name: "Pon Vijayan",
      role: "Committee Head",
      imageUrl: "/team/e64633ab-76d4-4755-b5c1-51feede74430 - Pon Vijayan.jpeg",
      bio: "Pon Vijayan is a proactive JCOM committee head who channels his entrepreneurial spirit into driving impactful business and community projects.",
      phone: "+91 98765 43217",
      whatsapp: "+91 98765 43217",
      domain: "Entrepreneurial Ventures & Projects",
      location: "JCOM Tuticorin, India",
    },
    {
      name: "Aravind Gowsik",
      role: "Executive Member",
      imageUrl: "/team/60d2995a-584f-4cdd-84a8-4f8e0e0dab4a - Aravind Gowsik. (1).jpeg",
      bio: "Aravind Gowsik is a strategic thinker and dedicated member of JCOM, contributing to various organizational initiatives and business expansion projects.",
      phone: "+91 98765 43218",
      whatsapp: "+91 98765 43218",
      domain: "Strategic Planning & Operations",
      location: "JCOM Operations, India",
    },
  ];

  // List of tables for the "Zone 18 Table Names" section
  const zoneTables = [
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
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .team2-section {
            padding: 30px 15px;
            text-align: center;
        }
        .team2-section .container {
            max-width: 1400px;
        }
        .team2-title {
            font-size: 48px;
            font-weight: 800;
            margin-bottom: 30px;
            color: #000000;
        }
        .team-card-premium {
            background: linear-gradient(to bottom, #ffffff, #fcfdff);
            border-radius: 24px;
            overflow: hidden;
            transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
            text-align: left;
            height: 100%;
            box-shadow:
                0 4px 6px -1px rgba(0, 0, 0, 0.05),
                0 10px 15px -3px rgba(0, 0, 0, 0.03),
                0 20px 25px -5px rgba(0, 0, 0, 0.02);
            border: 1px solid rgba(226, 232, 240, 0.6);
            display: flex;
            flex-direction: column;
            position: relative;
            cursor: pointer;
        }
        .team-card-premium.accent-top {
            border-top: 5px solid #3b82f6;
        }
        .team-card-premium.accent-bottom {
            border-bottom: 5px solid #10b981;
        }
        .team-card-premium:hover {
            transform: translateY(-8px);
            box-shadow:
                0 20px 25px -5px rgba(0, 0, 0, 0.1),
                0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        .card-header-top {
            padding: 30px;
            display: flex;
            gap: 25px;
            position: relative;
            align-items: flex-start;
        }
        .profile-box {
            width: 130px;
            height: 140px;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
            flex-shrink: 0;
            background: #fff;
            border: 4px solid #fff;
            outline: 1px solid #e2e8f0;
        }
        .profile-box img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: top center;
        }
        .header-info {
            flex-grow: 1;
        }
        .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            background: #fef9c3;
            color: #854d0e;
            padding: 4px 12px;
            border-radius: 50px;
            font-size: 10px;
            font-weight: 800;
            text-transform: uppercase;
            margin-bottom: 10px;
        }
        .status-dot {
            width: 8px;
            height: 8px;
            background: #f59e0b;
            border-radius: 50%;
        }
        .member-name {
            font-size: 1.4rem;
            font-weight: 800;
            color: #0f172a;
            margin-bottom: 3px;
            line-height: 1.2;
        }
        .member-company {
            font-size: 0.75rem;
            font-weight: 700;
            color: #3b82f6;
            text-transform: uppercase;
            margin-bottom: 10px;
            display: block;
        }
        .card-body-mid {
            padding: 0 30px 30px;
            flex-grow: 1;
        }
        .domain-label {
            font-size: 11px;
            font-weight: 800;
            color: #3b82f6;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .domain-label::after {
            content: '';
            height: 1px;
            flex-grow: 1;
            background: linear-gradient(to right, #3b82f644, transparent);
        }
        .domain-text {
            font-size: 1.05rem;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 20px;
            line-height: 1.5;
        }
        .location-text {
            font-size: 0.85rem;
            color: #64748b;
            display: flex;
            gap: 10px;
            align-items: center;
            background: #f8fafc;
            padding: 8px 15px;
            border-radius: 10px;
            width: fit-content;
        }
        .card-quick-actions {
            position: absolute;
            top: 50%;
            right: 15px;
            transform: translateY(-50%);
            display: flex;
            flex-direction: column;
            gap: 15px;
            z-index: 5;
        }
        .action-icon-btn {
            width: 46px;
            height: 46px;
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.3rem;
            color: #fff;
            text-decoration: none;
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
            backdrop-filter: blur(4px);
        }
        .action-icon-btn:hover {
            transform: scale(1.15) rotate(5deg);
            color: #fff;
        }
        .btn-call-mini {
            background: #3b82f6;
        }
        .btn-whatsapp-mini {
            background: #10b981;
        }
        .btn-email-mini {
            background: #ea4335;
        }
        .card-footer-btns {
            padding: 25px;
            background: #f8fafc;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
        }
        .table-name-card {
            background: #ffffff;
            border-radius: 16px;
            padding: 30px 20px;
            text-align: center;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
            border: 1px solid #e2e8f0;
            transition: all 0.3s ease;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            position: relative;
            overflow: hidden;
        }
        .table-name-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: linear-gradient(90deg, #1da1f2, #0077b5);
            transform: scaleX(0);
            transform-origin: left;
            transition: transform 0.4s ease;
        }
        .table-name-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.08);
        }
        .table-name-card:hover::before {
            transform: scaleX(1);
        }
        .table-name-card .card-icon {
            font-size: 28px;
            color: #1da1f2;
            margin-bottom: 15px;
            background: rgba(29, 161, 242, 0.1);
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-left: auto;
            margin-right: auto;
        }
        .table-name-card .t-name {
            font-size: 15px;
            font-weight: 800;
            color: #1e293b;
            margin-bottom: 15px;
            flex-grow: 1;
        }
        .table-name-card .view-table-link {
            font-size: 12px;
            font-weight: 800;
            color: #64748b;
            text-decoration: none;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: color 0.3s;
        }
        .table-name-card:hover .view-table-link {
            color: #1da1f2;
        }
      ` }} />

      {/* Page Header Banner */}
      <section className="page-header-banner">
        <div className="container">
          <h1 className="page-header-title">JCOM ZONE GOVERNING BORD-2026</h1>
        </div>
      </section>

      {/* Team Content */}
      <section className="team2-section mt-3">
        <div className="container">
          <h2 className="team2-title">OUR CHAIRMAN</h2>

          {/* CHAIRMAN ROW */}
          <div className="row justify-content-center g-4 mb-5" id="chairman-row">
            {/* 1. Zone Chairman Card */}
            <div className="col-lg-4 col-md-6 col-12">
              {dbChairman ? (
                // Database Chairman Card
                <div
                  className="team-card-premium accent-top"
                  style={{ borderTop: "5px solid #f59e0b" }}
                  data-bs-toggle="modal"
                  data-bs-target="#bioModal"
                  data-name={dbChairman.name}
                  data-role={dbChairman.role}
                  data-img={dbChairman.imageUrl}
                  data-bio={dbChairman.bio || "JCOM Zone Chairman."}
                >
                  <div className="card-header-top">
                    <div className="profile-box">
                      <img src={dbChairman.imageUrl} alt={dbChairman.name} />
                    </div>
                    <div className="header-info">
                      <span className="status-badge" style={{ background: "#fef3c7", color: "#d97706" }}>
                        <span className="status-dot" style={{ background: "#d97706" }}></span> Zone Chairman
                      </span>
                      <h3 className="member-name">{dbChairman.name}</h3>
                      <span className="member-company" style={{ color: "#d97706" }}>{dbChairman.role}</span>
                    </div>

                    <div className="card-quick-actions">
                      {dbChairman.phone && (
                        <a href={`tel:${dbChairman.phone}`} className="action-icon-btn btn-call-mini" style={{ background: "#d97706" }} title="Call">
                          <i className="bi bi-telephone-fill"></i>
                        </a>
                      )}
                      {dbChairman.whatsapp && (
                        <a href={`https://wa.me/${dbChairman.whatsapp.replace(/\+/g, '').replace(/ /g, '')}`} className="action-icon-btn btn-whatsapp-mini" title="WhatsApp">
                          <i className="bi bi-whatsapp"></i>
                        </a>
                      )}
                      <a href="mailto:info@jcom.org" className="action-icon-btn btn-email-mini" style={{ background: "#ea4335" }} title="Email">
                        <i className="bi bi-envelope-fill"></i>
                      </a>
                    </div>
                  </div>

                  <div className="card-body-mid">
                    <span className="domain-label" style={{ color: "#d97706" }}>Business Domain</span>
                    <p className="domain-text">Zone Governance & Strategic Vision</p>
                    <div className="location-text">
                      <i className="bi bi-geo-alt-fill"></i>
                      <span>JCOM Zone, India</span>
                    </div>
                  </div>

                  <div className="card-footer-btns border-top-0 pt-0 pb-4 px-4 bg-transparent mt-auto" style={{ display: "block" }}>
                    <button className="btn btn-primary w-100 rounded-pill fw-bold" style={{ background: "linear-gradient(90deg, #d97706, #b45309), #d97706", border: "none", padding: "10px 0" }}>
                      View Profile <i className="bi bi-arrow-right ms-2"></i>
                    </button>
                  </div>
                </div>
              ) : (
                // Static Fallback Chairman Card
                <div
                  className="team-card-premium accent-top"
                  style={{ borderTop: "5px solid #f59e0b" }}
                  data-bs-toggle="modal"
                  data-bs-target="#bioModal"
                  data-name="Chairman Name"
                  data-role="Chairman"
                  data-img="https://placehold.co/400x400/eeeeee/333333?text=Chairman+Photo"
                  data-bio="Our Chairman leads with vision and purpose, guiding the JCOM Zone towards unparalleled growth and excellence."
                >
                  <div className="card-header-top">
                    <div className="profile-box">
                      <img src="https://placehold.co/400x400/eeeeee/333333?text=Chairman+Photo" alt="Chairman" />
                    </div>
                    <div className="header-info">
                      <span className="status-badge" style={{ background: "#fef3c7", color: "#d97706" }}>
                        <span className="status-dot" style={{ background: "#d97706" }}></span> Zone Chairman
                      </span>
                      <h3 className="member-name">Chairman Name</h3>
                      <span className="member-company" style={{ color: "#d97706" }}>JCOM Chairman</span>
                    </div>

                    <div className="card-quick-actions">
                      <a href="tel:+" className="action-icon-btn btn-call-mini" style={{ background: "#d97706" }} title="Call">
                        <i className="bi bi-telephone-fill"></i>
                      </a>
                      <a href="https://wa.me/+" className="action-icon-btn btn-whatsapp-mini" title="WhatsApp">
                        <i className="bi bi-whatsapp"></i>
                      </a>
                      <a href="mailto:info@jcom.org" className="action-icon-btn btn-email-mini" style={{ background: "#ea4335" }} title="Email">
                        <i className="bi bi-envelope-fill"></i>
                      </a>
                    </div>
                  </div>

                  <div className="card-body-mid">
                    <span className="domain-label" style={{ color: "#d97706" }}>Business Domain</span>
                    <p className="domain-text">Zone Governance & Strategic Vision</p>
                    <div className="location-text">
                      <i className="bi bi-geo-alt-fill"></i>
                      <span>JCOM Zone, India</span>
                    </div>
                  </div>

                  <div className="card-footer-btns border-top-0 pt-0 pb-4 px-4 bg-transparent mt-auto" style={{ display: "block" }}>
                    <button className="btn btn-primary w-100 rounded-pill fw-bold" style={{ background: "linear-gradient(90deg, #d97706, #b45309), #d97706", border: "none", padding: "10px 0" }}>
                      View Profile <i className="bi bi-arrow-right ms-2"></i>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Advisory / Past Chairman Card */}
            <div className="col-lg-4 col-md-6 col-12">
              {dbPastChairman ? (
                // Database Past Chairman Card
                <div
                  className="team-card-premium accent-top"
                  style={{ borderTop: "5px solid #64748b" }}
                  data-bs-toggle="modal"
                  data-bs-target="#bioModal"
                  data-name={dbPastChairman.name}
                  data-role={dbPastChairman.role}
                  data-img={dbPastChairman.imageUrl}
                  data-bio={dbPastChairman.bio || "Our Past Chairman provides invaluable advice and mentorship."}
                >
                  <div className="card-header-top">
                    <div className="profile-box">
                      <img src={dbPastChairman.imageUrl} alt={dbPastChairman.name} />
                    </div>
                    <div className="header-info">
                      <span className="status-badge" style={{ background: "#f1f5f9", color: "#475569" }}>
                        <span className="status-dot" style={{ background: "#64748b" }}></span> Advisory Role
                      </span>
                      <h3 className="member-name">{dbPastChairman.name}</h3>
                      <span className="member-company" style={{ color: "#475569" }}>{dbPastChairman.role}</span>
                    </div>

                    <div className="card-quick-actions">
                      {dbPastChairman.phone && (
                        <a href={`tel:${dbPastChairman.phone}`} className="action-icon-btn btn-call-mini" style={{ background: "#64748b" }} title="Call">
                          <i className="bi bi-telephone-fill"></i>
                        </a>
                      )}
                      {dbPastChairman.whatsapp && (
                        <a href={`https://wa.me/${dbPastChairman.whatsapp.replace(/\+/g, '').replace(/ /g, '')}`} className="action-icon-btn btn-whatsapp-mini" title="WhatsApp">
                          <i className="bi bi-whatsapp"></i>
                        </a>
                      )}
                      <a href="mailto:info@jcom.org" className="action-icon-btn btn-email-mini" style={{ background: "#ea4335" }} title="Email">
                        <i className="bi bi-envelope-fill"></i>
                      </a>
                    </div>
                  </div>

                  <div className="card-body-mid">
                    <span className="domain-label" style={{ color: "#475569" }}>Business Domain</span>
                    <p className="domain-text">Advisory & Long-Term Strategy</p>
                    <div className="location-text">
                      <i className="bi bi-geo-alt-fill"></i>
                      <span>JCOM Zone, India</span>
                    </div>
                  </div>

                  <div className="card-footer-btns border-top-0 pt-0 pb-4 px-4 bg-transparent mt-auto" style={{ display: "block" }}>
                    <button className="btn btn-primary w-100 rounded-pill fw-bold" style={{ background: "linear-gradient(90deg, #64748b, #475569), #64748b", border: "none", padding: "10px 0" }}>
                      View Profile <i className="bi bi-arrow-right ms-2"></i>
                    </button>
                  </div>
                </div>
              ) : (
                // Static Fallback Past Chairman Card
                <div
                  className="team-card-premium accent-top"
                  style={{ borderTop: "5px solid #64748b" }}
                  data-bs-toggle="modal"
                  data-bs-target="#bioModal"
                  data-name="Past Chairman Name"
                  data-role="Past Chairman"
                  data-img="https://placehold.co/400x400/eeeeee/333333?text=Past+Chairman"
                  data-bio="Our Past Chairman laid the strong foundation for JCOM's current success and continues to provide valuable mentorship."
                >
                  <div className="card-header-top">
                    <div className="profile-box">
                      <img src="https://placehold.co/400x400/eeeeee/333333?text=Past+Chairman" alt="Past Chairman" />
                    </div>
                    <div className="header-info">
                      <span className="status-badge" style={{ background: "#f1f5f9", color: "#475569" }}>
                        <span className="status-dot" style={{ background: "#64748b" }}></span> Advisory Role
                      </span>
                      <h3 className="member-name">Past Chairman</h3>
                      <span className="member-company" style={{ color: "#475569" }}>JCOM Past Chairman</span>
                    </div>

                    <div className="card-quick-actions">
                      <a href="tel:+" className="action-icon-btn btn-call-mini" style={{ background: "#64748b" }} title="Call">
                        <i className="bi bi-telephone-fill"></i>
                      </a>
                      <a href="https://wa.me/+" className="action-icon-btn btn-whatsapp-mini" style={{ background: "#10b981" }} title="WhatsApp">
                        <i className="bi bi-whatsapp"></i>
                      </a>
                      <a href="mailto:info@jcom.org" className="action-icon-btn btn-email-mini" style={{ background: "#ea4335" }} title="Email">
                        <i className="bi bi-envelope-fill"></i>
                      </a>
                    </div>
                  </div>

                  <div className="card-body-mid">
                    <span className="domain-label" style={{ color: "#475569" }}>Business Domain</span>
                    <p className="domain-text">Advisory & Long-Term Strategy</p>
                    <div className="location-text">
                      <i className="bi bi-geo-alt-fill"></i>
                      <span>JCOM Zone, India</span>
                    </div>
                  </div>

                  <div className="card-footer-btns border-top-0 pt-0 pb-4 px-4 bg-transparent mt-auto" style={{ display: "block" }}>
                    <button className="btn btn-primary w-100 rounded-pill fw-bold" style={{ background: "linear-gradient(90deg, #64748b, #475569), #64748b", border: "none", padding: "10px 0" }}>
                      View Profile <i className="bi bi-arrow-right ms-2"></i>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <h2 className="team2-title mt-3 pt-3">OUR TABLE</h2>

          {/* TABLE MEMBERS ROW */}
          <div className="row justify-content-center g-4 mb-3" id="governing-board-row">
            {dbBoardMembers.length > 0
              ? // Database Board Members
                dbBoardMembers.map((member) => {
                  const roleLower = member.role.toLowerCase();
                  const isPresident = roleLower.includes("president") && !roleLower.includes("vice");
                  const borderStyle = isPresident
                    ? "5px solid #10b981"
                    : "1px solid rgba(226, 232, 240, 0.6)";

                  return (
                    <div className="col-lg-4 col-md-6 col-12" key={member.id}>
                      <div
                        className="team-card-premium"
                        style={{ borderTop: borderStyle }}
                        data-bs-toggle="modal"
                        data-bs-target="#bioModal"
                        data-name={member.name}
                        data-role={member.role}
                        data-img={member.imageUrl}
                        data-bio={member.bio || "Active JCOM Board Member."}
                      >
                        <div className="card-header-top">
                          <div className="profile-box">
                            <img
                              src={member.imageUrl}
                              alt={member.name}
                            />
                          </div>
                          <div className="header-info">
                            <span className="status-badge">
                              <span className="status-dot"></span> Active Member
                            </span>
                            <h3 className="member-name">{member.name}</h3>
                            <span className="member-company">{member.role}</span>
                          </div>

                          <div className="card-quick-actions">
                            {member.phone && (
                              <a href={`tel:${member.phone}`} className="action-icon-btn btn-call-mini" title="Call">
                                <i className="bi bi-telephone-fill"></i>
                              </a>
                            )}
                            {member.whatsapp && (
                              <a
                                href={`https://wa.me/${member.whatsapp.replace(/\+/g, "").replace(/ /g, "")}`}
                                className="action-icon-btn btn-whatsapp-mini"
                                title="WhatsApp"
                              >
                                <i className="bi bi-whatsapp"></i>
                              </a>
                            )}
                          </div>
                        </div>

                        <div className="card-body-mid">
                          <span className="domain-label">Business Domain</span>
                          <p className="domain-text">
                            {member.bio
                              ? member.bio.substring(0, 50) + (member.bio.length > 50 ? "..." : "")
                              : "Leadership & Business Development"}
                          </p>
                          <div className="location-text">
                            <i className="bi bi-geo-alt-fill"></i>
                            <span>JCOM Zone, India</span>
                          </div>
                        </div>

                        <div className="card-footer-btns border-top-0 pt-0 pb-4 px-4 bg-transparent mt-auto" style={{ display: "block" }}>
                          <button className="btn btn-primary w-100 rounded-pill fw-bold" style={{ background: "linear-gradient(90deg, #1da1f2, #0077b5), #1da1f2", border: "none", padding: "10px 0" }}>
                            View Profile <i className="bi bi-arrow-right ms-2"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              : // Static Fallback Board Members
                staticBoardMembers.map((member, index) => {
                  const borderStyle = index % 2 === 0 ? "accent-top" : "accent-bottom";

                  return (
                    <div className="col-lg-4 col-md-6 col-12" key={index}>
                      <div
                        className={`team-card-premium ${borderStyle}`}
                        data-bs-toggle="modal"
                        data-bs-target="#bioModal"
                        data-name={member.name}
                        data-role={member.role}
                        data-img={member.imageUrl}
                        data-bio={member.bio}
                      >
                        <div className="card-header-top">
                          <div className="profile-box">
                            <img src={member.imageUrl} alt={member.name} />
                          </div>
                          <div className="header-info">
                            <span className="status-badge">
                              <span className="status-dot"></span> Active Member
                            </span>
                            <h3 className="member-name">{member.name}</h3>
                            <span className="member-company">{member.role}</span>
                          </div>

                          <div className="card-quick-actions">
                            <a href={`tel:${member.phone}`} className="action-icon-btn btn-call-mini" title="Call">
                              <i className="bi bi-telephone-fill"></i>
                            </a>
                            <a
                              href={`https://wa.me/${member.whatsapp.replace(/\+/g, "").replace(/ /g, "")}`}
                              className="action-icon-btn btn-whatsapp-mini"
                              title="WhatsApp"
                            >
                              <i className="bi bi-whatsapp"></i>
                            </a>
                          </div>
                        </div>

                        <div className="card-body-mid">
                          <span className="domain-label">Business Domain</span>
                          <p className="domain-text">{member.domain}</p>
                          <div className="location-text">
                            <i className="bi bi-geo-alt-fill"></i>
                            <span>{member.location}</span>
                          </div>
                        </div>

                        <div className="card-footer-btns border-top-0 pt-0 pb-4 px-4 bg-transparent mt-auto" style={{ display: "block" }}>
                          <button className="btn btn-primary w-100 rounded-pill fw-bold" style={{ background: "linear-gradient(90deg, #1da1f2, #0077b5), #1da1f2", border: "none", padding: "10px 0" }}>
                            View Profile <i className="bi bi-arrow-right ms-2"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>
      </section>

      {/* ZONE 18 TABLES SECTION */}
      <section className="zone-tables-section py-5" style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
        <div className="container" style={{ maxWidth: "1400px" }}>
          <div className="text-center mb-5">
            <h2 className="fw-bold" style={{ fontSize: "40px", color: "#0f172a" }}>ZONE 18 TABLE NAMES</h2>
            <p className="text-muted">Explore our network of 15 dynamic tables across the zone</p>
          </div>

          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-4">
            {zoneTables.map((table, idx) => (
              <div className="col" key={idx}>
                <div className="table-name-card">
                  <div className="card-icon"><i className="bi bi-diagram-3-fill"></i></div>
                  <h4 className="t-name">{table.name}</h4>
                  <div className="d-flex justify-content-center gap-2 mb-3">
                    <a href={`tel:${table.phone}`} className="btn btn-sm btn-outline-primary rounded-circle" title="Call">
                      <i className="bi bi-telephone-fill"></i>
                    </a>
                    <a href={`https://wa.me/${table.phone}`} className="btn btn-sm btn-outline-success rounded-circle" title="WhatsApp">
                      <i className="bi bi-whatsapp"></i>
                    </a>
                    <a href={`mailto:${table.email}`} className="btn btn-sm btn-outline-danger rounded-circle" title="Email">
                      <i className="bi bi-envelope-fill"></i>
                    </a>
                  </div>
                  <a href="#" className="view-table-link">View Members <i className="bi bi-arrow-right ms-1"></i></a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER SECTION */}
      <section className="newsletter-section">
        <div className="newsletter-container">
          <div className="newsletter-content">
            <p className="newsletter-label">Subscribe Newsletter</p>
            <h2 className="newsletter-title">Stay Updated with the Latest News!</h2>
          </div>

          <form className="newsletter-form-wrapper" id="newsletterForm">
            <input type="email" className="newsletter-input" placeholder="Enter Email Address" required id="newsletterEmail" />
            <button type="submit" className="newsletter-btn">Subscribe Now</button>
          </form>
        </div>
      </section>

      {/* BIO MODAL */}
      <div className="modal fade" id="bioModal" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content p-4 text-center">
            <img id="modalImg" className="rounded mb-3 mx-auto" width="120" src="https://placehold.co/400x400" alt="Bio modal image" />
            <h5 id="modalName" className="fw-bold mb-1"></h5>
            <p className="text-muted mb-3" id="modalRole"></p>
            <p id="modalBio" className="text-dark small lh-base"></p>
          </div>
        </div>
      </div>

      {/* Client-side event delegation handler */}
      <TeamModalHandler />
    </>
  );
}
