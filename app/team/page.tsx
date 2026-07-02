import { db } from "@/lib/db";
import Link from "next/link";
import TeamModalHandler from "./TeamModalHandler";
import { seedDatabaseIfEmpty } from "@/lib/seed";

export const revalidate = 0; // ensure page is always dynamically rendered

export default async function TeamPage() {
  // Run database seed check
  await seedDatabaseIfEmpty();

  // Fetch dynamic members from PostgreSQL
  let dbMembers: any[] = [];
  try {
    dbMembers = await db.teamMember.findMany({
      orderBy: { createdAt: "asc" },
    });
  } catch (error) {
    console.error("Error fetching team members from DB:", error);
  }

  // Fetch dynamic tables from PostgreSQL
  let dbTables: any[] = [];
  try {
    dbTables = await db.jcomTable.findMany({
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("Error fetching JCOM tables from DB:", error);
  }

  // Find chairman and past chairman from DB
  const dbChairmen = dbMembers.filter(
    (m) =>
      m.role.toLowerCase().includes("chairman") &&
      !m.role.toLowerCase().includes("past")
  );
  const dbPastChairmen = dbMembers.filter(
    (m) =>
      m.role.toLowerCase().includes("past") &&
      m.role.toLowerCase().includes("chairman")
  );

  // Filter board members (everyone who is not a chairman or past chairman)
  const dbBoardMembers = dbMembers.filter(
    (m) => !m.role.toLowerCase().includes("chairman")
  );


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
            {dbChairmen.map((chairman) => (
              <div className="col-lg-4 col-md-6 col-12" key={chairman.id}>
                <div
                  className="team-card-premium accent-top"
                  style={{ borderTop: "5px solid #f59e0b" }}
                  data-bs-toggle="modal"
                  data-bs-target="#bioModal"
                  data-name={chairman.name}
                  data-role={chairman.role}
                  data-img={chairman.imageUrl}
                  data-bio={chairman.bio || "JCOM Zone Chairman."}
                >
                  <div className="card-header-top">
                    <div className="profile-box">
                      <img src={chairman.imageUrl} alt={chairman.name} />
                    </div>
                    <div className="header-info">
                      <span className="status-badge" style={{ background: "#fef3c7", color: "#d97706" }}>
                        <span className="status-dot" style={{ background: "#d97706" }}></span> Zone Chairman
                      </span>
                      <h3 className="member-name">{chairman.name}</h3>
                      <span className="member-company" style={{ color: "#d97706" }}>{chairman.role}</span>
                    </div>

                    <div className="card-quick-actions">
                      {chairman.phone && (
                        <a href={`tel:${chairman.phone}`} className="action-icon-btn btn-call-mini" style={{ background: "#d97706" }} title="Call">
                          <i className="bi bi-telephone-fill"></i>
                        </a>
                      )}
                      {chairman.whatsapp && (
                        <a href={`https://wa.me/${chairman.whatsapp.replace(/\+/g, '').replace(/ /g, '')}`} className="action-icon-btn btn-whatsapp-mini" title="WhatsApp">
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
                    <p className="domain-text">
                      {chairman.bio ? chairman.bio.substring(0, 50) + (chairman.bio.length > 50 ? "..." : "") : "Zone Governance & Strategic Vision"}
                    </p>
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
              </div>
            ))}

            {dbPastChairmen.map((pastChairman) => (
              <div className="col-lg-4 col-md-6 col-12" key={pastChairman.id}>
                <div
                  className="team-card-premium accent-top"
                  style={{ borderTop: "5px solid #64748b" }}
                  data-bs-toggle="modal"
                  data-bs-target="#bioModal"
                  data-name={pastChairman.name}
                  data-role={pastChairman.role}
                  data-img={pastChairman.imageUrl}
                  data-bio={pastChairman.bio || "Our Past Chairman provides invaluable advice and mentorship."}
                >
                  <div className="card-header-top">
                    <div className="profile-box">
                      <img src={pastChairman.imageUrl} alt={pastChairman.name} />
                    </div>
                    <div className="header-info">
                      <span className="status-badge" style={{ background: "#f1f5f9", color: "#475569" }}>
                        <span className="status-dot" style={{ background: "#64748b" }}></span> Advisory Role
                      </span>
                      <h3 className="member-name">{pastChairman.name}</h3>
                      <span className="member-company" style={{ color: "#475569" }}>{pastChairman.role}</span>
                    </div>

                    <div className="card-quick-actions">
                      {pastChairman.phone && (
                        <a href={`tel:${pastChairman.phone}`} className="action-icon-btn btn-call-mini" style={{ background: "#64748b" }} title="Call">
                          <i className="bi bi-telephone-fill"></i>
                        </a>
                      )}
                      {pastChairman.whatsapp && (
                        <a href={`https://wa.me/${pastChairman.whatsapp.replace(/\+/g, '').replace(/ /g, '')}`} className="action-icon-btn btn-whatsapp-mini" title="WhatsApp">
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
                    <p className="domain-text">
                      {pastChairman.bio ? pastChairman.bio.substring(0, 50) + (pastChairman.bio.length > 50 ? "..." : "") : "Advisory & Long-Term Strategy"}
                    </p>
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
              </div>
            ))}
          </div>

          <h2 className="team2-title mt-3 pt-3">OUR ZGB</h2>

          {/* TABLE MEMBERS ROW */}
          <div className="row justify-content-center g-4 mb-3" id="governing-board-row">
            {dbBoardMembers.length > 0 ? (
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
            ) : (
              <div className="text-center py-5 text-muted col-12">
                No board members found in database.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ZONE 18 TABLES SECTION */}
      <section className="zone-tables-section py-5" style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
        <div className="container" style={{ maxWidth: "1400px" }}>
          <div className="text-center mb-5">
            <h2 className="fw-bold" style={{ fontSize: "40px", color: "#0f172a" }}>ZONE 18 TABLE NAMES</h2>
            <p className="text-muted">Explore our network of dynamic tables across the zone</p>
          </div>

          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-4">
            {dbTables.length > 0 ? (
              dbTables.map((table) => (
                <div className="col" key={table.id}>
                  <div className="table-name-card">
                    <div className="card-icon"><i className="bi bi-diagram-3-fill"></i></div>
                    <h4 className="t-name">{table.name}</h4>
                    <div className="d-flex justify-content-center gap-2 mb-3">
                      {table.phone && (
                        <>
                          <a href={`tel:${table.phone}`} className="btn btn-sm btn-outline-primary rounded-circle" title="Call">
                            <i className="bi bi-telephone-fill"></i>
                          </a>
                          <a href={`https://wa.me/${table.phone.replace(/[^0-9]/g, '')}`} className="btn btn-sm btn-outline-success rounded-circle" title="WhatsApp">
                            <i className="bi bi-whatsapp"></i>
                          </a>
                        </>
                      )}
                      {table.email && (
                        <a href={`mailto:${table.email}`} className="btn btn-sm btn-outline-danger rounded-circle" title="Email">
                          <i className="bi bi-envelope-fill"></i>
                        </a>
                      )}
                    </div>
                    <Link href={`/team/members?table=${encodeURIComponent(table.name)}`} className="view-table-link">
                      View Members <i className="bi bi-arrow-right ms-1"></i>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center w-100 py-5 text-muted col-12">
                No JCOM Tables found in database.
              </div>
            )}
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
