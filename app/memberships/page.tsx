"use client";

import React, { useState } from "react";
import { submitMembership } from "./actions";

export default function MembershipsPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    company: "",
    industry: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id.replace("m_", "")]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await submitMembership(formData);

    if (result.success) {
      alert("Your JCOM membership application was submitted successfully! The Governing Board will contact you shortly.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        whatsapp: "",
        company: "",
        industry: "",
        message: "",
      });
    } else {
      alert("Submission Error: " + (result.error || "Failed to submit application."));
    }
    setLoading(false);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .benefit-card {
            background: #ffffff;
            border-radius: 20px;
            padding: 30px;
            border: 1px solid rgba(0, 0, 0, 0.05);
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.01);
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            height: 100%;
        }
        .benefit-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 35px rgba(0, 164, 239, 0.12) !important;
            border-color: rgba(0, 164, 239, 0.2) !important;
        }
        .benefit-icon {
            width: 60px;
            height: 60px;
            border-radius: 16px;
            background: rgba(0, 164, 239, 0.08);
            color: #00a4ef;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 26px;
            margin-bottom: 20px;
            transition: all 0.3s ease;
        }
        .benefit-card:hover .benefit-icon {
            background: #00a4ef;
            color: #ffffff;
            transform: rotate(5deg) scale(1.05);
        }
        .form-card {
            background: #ffffff;
            border-radius: 24px;
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.04);
            border: 1px solid rgba(0, 0, 0, 0.06);
        }
        .faq-item {
            border-bottom: 1px dashed rgba(0,0,0,0.1);
            padding-bottom: 15px;
            margin-bottom: 15px;
        }
        .benefits-section { 
            padding: 100px 0; 
            background: linear-gradient(135deg, #0b1120 0%, #0f172a 100%);
            color: #fff;
            position: relative;
            overflow: hidden;
        }
        .benefits-header {
            text-align: left;
            margin-bottom: 60px;
            max-width: 900px;
        }
        .benefits-title {
            font-size: 3rem;
            font-weight: 800;
            margin-bottom: 25px;
            color: #fff;
            letter-spacing: -1px;
        }
        .benefits-subtitle {
            font-size: 1.2rem;
            line-height: 1.7;
            color: #e0e0e0;
        }
        .benefits-grid-wrap {
            display: flex;
            align-items: center;
            position: relative;
            padding: 40px 0;
        }
        .benefits-column {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 40px;
        }
        .benefits-item {
            display: flex;
            align-items: center;
            gap: 20px;
        }
        .benefits-num-wrap {
            flex-shrink: 0;
            width: 60px;
            height: 60px;
            border: 1px solid rgba(255,255,255,0.3);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }
        .benefits-num {
            background: #1da1f2;
            color: #fff;
            width: 34px;
            height: 34px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: 700;
        }
        .benefits-num-wrap::after {
            content: '';
            position: absolute;
            width: 40px;
            height: 1px;
            background: rgba(255,255,255,0.3);
        }
        .left-col .benefits-num-wrap::after { right: -40px; }
        .right-col .benefits-num-wrap::after { left: -40px; }
        .benefits-text {
            font-size: 1.1rem;
            line-height: 1.7;
            color: rgba(255,255,255,0.95);
        }
        .benefits-center {
            flex-shrink: 0;
            width: 350px;
            height: 350px;
            margin: 0 40px;
            position: relative;
        }
        .benefits-center-circle {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            border: 2px solid #1da1f2;
            overflow: hidden;
            padding: 15px;
        }
        .benefits-center-circle img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 50%;
        }
        .benefits-column-title {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 35px;
            letter-spacing: 1px;
            color: #00a4ef;
        }
        .left-col { text-align: left; }
        .right-col { text-align: left; }
        .right-col .benefits-item { flex-direction: row-reverse; }
        @media (max-width: 1200px) {
            .benefits-center { width: 280px; height: 280px; }
        }
        @media (max-width: 991px) {
            .benefits-grid-wrap { flex-direction: column; gap: 60px; }
            .benefits-center { margin: 40px auto; }
            .benefits-num-wrap::after { display: none; }
            .benefits-title { font-size: 2.2rem; }
        }
      ` }} />

      {/* Page Header */}
      <section className="page-header-banner">
        <div className="container">
          <h1 className="page-header-title">JCOM US</h1>
        </div>
      </section>

      {/* Benefits / Importance of Membership */}
      <section className="py-5" style={{ background: "#f8fafc" }}>
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="text-primary fw-bold text-uppercase tracking-wider small">Why Join JCOM?</span>
            <h2 className="fw-bold mt-1 text-dark fs-1">The Importance of Membership</h2>
            <p className="text-muted col-lg-7 mx-auto">Being a JCOM member connects you with an elite community of business owners, leaders, and change-makers committed to regional development and business success.</p>
          </div>

          <div className="row g-4">
            {/* Benefit 1 */}
            <div className="col-md-4">
              <div className="benefit-card">
                <div className="benefit-icon"><i className="bi bi-people-fill"></i></div>
                <h4 className="fw-bold text-dark mb-3">Elite Business Network</h4>
                <p className="text-muted">Direct access to local business entrepreneurs, national advisors, and corporate partners across Zone 18 and other regions.</p>
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="col-md-4">
              <div className="benefit-card">
                <div className="benefit-icon"><i className="bi bi-graph-up-arrow"></i></div>
                <h4 className="fw-bold text-dark mb-3">Business Referral Swap</h4>
                <p className="text-muted">Participate in dedicated weekly referral mixers designed to trade high-quality cross-table business connections and leads.</p>
              </div>
            </div>

            {/* Benefit 3 */}
            <div className="col-md-4">
              <div className="benefit-card">
                <div className="benefit-icon"><i className="bi bi-mortarboard-fill"></i></div>
                <h4 className="fw-bold text-dark mb-3">Masterclasses & Skills</h4>
                <p className="text-muted">Enhance your professional growth with regular, interactive training sessions on marketing, finance, corporate laws, and AI.</p>
              </div>
            </div>

            {/* Benefit 4 */}
            <div className="col-md-4">
              <div className="benefit-card">
                <div className="benefit-icon"><i className="bi bi-ticket-perforated-fill"></i></div>
                <h4 className="fw-bold text-dark mb-3">VIP Event Access</h4>
                <p className="text-muted">Enjoy free or discounted VIP reservations to all Zone 18 business leadership summits, conventions, and trade fairs.</p>
              </div>
            </div>

            {/* Benefit 5 */}
            <div className="col-md-4">
              <div className="benefit-card">
                <div className="benefit-icon"><i className="bi bi-globe"></i></div>
                <h4 className="fw-bold text-dark mb-3">Brand Promotion</h4>
                <p className="text-muted">Display your logo and business credentials in the JCOM official directory, expanding your corporate reach to digital audiences.</p>
              </div>
            </div>

            {/* Benefit 6 */}
            <div className="col-md-4">
              <div className="benefit-card">
                <div className="benefit-icon"><i className="bi bi-heart-fill"></i></div>
                <h4 className="fw-bold text-dark mb-3">Community Impact</h4>
                <p className="text-muted">Collaborate on social impact projects to bring positive societal change, enhancing corporate social responsibility (CSR).</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* JCI & JCOM Membership Advantages */}
      <section className="benefits-section">
        <div className="container">
          <div className="benefits-header">
            <h2 className="benefits-title">JCI & JCOM Membership Advantages</h2>
            <p className="benefits-subtitle">
              Unlock exclusive access to a global network of high-performing tables, professional consulting, and strategic resources designed for business growth and social impact.
            </p>
          </div>

          <div className="benefits-grid-wrap">
            {/* Left Column */}
            <div className="benefits-column left-col">
              <h3 className="benefits-column-title">Membership Advantages</h3>
              
              <div className="benefits-item">
                <div className="benefits-num-wrap"><div className="benefits-num">01</div></div>
                <p className="benefits-text"><strong>Unique Structure:</strong> Only JCOM has 4 different types of specialized Tables.</p>
              </div>

              <div className="benefits-item">
                <div className="benefits-num-wrap"><div className="benefits-num">02</div></div>
                <p className="benefits-text"><strong>Global Impact:</strong> Access a vast network of 50,000+ members worldwide through JCI.</p>
              </div>

              <div className="benefits-item">
                <div className="benefits-num-wrap"><div className="benefits-num">03</div></div>
                <p className="benefits-text"><strong>Excellence:</strong> The strength and legacy of world-class JCI Training programs.</p>
              </div>

              <div className="benefits-item">
                <div className="benefits-num-wrap"><div className="benefits-num">04</div></div>
                <p className="benefits-text"><strong>Scale:</strong> Direct access to pool purchase programs through Association Tables.</p>
              </div>
            </div>

            {/* Center Circle */}
            <div className="benefits-center">
              <div className="benefits-center-circle">
                <img src="https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=2074" alt="JCI Community" />
              </div>
            </div>

            {/* Right Column */}
            <div className="benefits-column right-col">
              <h3 className="benefits-column-title">Strategic Networking</h3>

              <div className="benefits-item">
                <div className="benefits-num-wrap"><div className="benefits-num">01</div></div>
                <p className="benefits-text"><strong>Expert Support:</strong> Overcome challenges with guidance from consultants and experts.</p>
              </div>

              <div className="benefits-item">
                <div className="benefits-num-wrap"><div className="benefits-num">02</div></div>
                <p className="benefits-text"><strong>Social Connect:</strong> Socialize and grow within a truly unique corporate business group.</p>
              </div>

              <div className="benefits-item">
                <div className="benefits-num-wrap"><div className="benefits-num">03</div></div>
                <p className="benefits-text"><strong>Global Range:</strong> International network - Empowering Local growth for Global reach.</p>
              </div>

              <div className="benefits-item">
                <div className="benefits-num-wrap"><div className="benefits-num">04</div></div>
                <p className="benefits-text"><strong>Jvc Connect:</strong> Virtual Community for social connect with global members.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-5" style={{ background: "#ffffff" }}>
        <div className="container py-4">
          <div className="row g-5 align-items-stretch">
            {/* Info / FAQs */}
            <div className="col-lg-5 d-flex flex-column justify-content-center">
              <div className="mb-4">
                <span className="badge bg-light text-primary border px-3 py-2 rounded-pill fw-bold mb-2">Apply Now</span>
                <h2 className="fw-bold text-dark fs-1">Start Your JCOM Journey Today</h2>
                <p className="text-muted mt-3">Complete the application form to request membership in JCOM. Your application will be forwarded to the governing board for review, and we will contact you shortly.</p>
              </div>

              <div className="pe-lg-4 mt-2">
                <h5 className="fw-bold text-dark mb-3"><i className="bi bi-question-circle-fill text-primary me-2"></i> FAQ</h5>
                
                <div className="faq-item">
                  <h6 className="fw-bold text-dark mb-2">Who is eligible to join?</h6>
                  <p className="text-muted small m-0">Business owners, entrepreneurs, corporate managers, and professionals aged between 18 and 40 who are eager to grow their networks and serve the community.</p>
                </div>
                
                <div className="faq-item">
                  <h6 className="fw-bold text-dark mb-2">How long does review take?</h6>
                  <p className="text-muted small m-0">The Zone Governing Board typically reviews applications and updates candidate members within 5 to 7 business days.</p>
                </div>

                <div className="faq-item border-0">
                  <h6 className="fw-bold text-dark mb-2">Is there an interview process?</h6>
                  <p className="text-muted small m-0">Yes, candidate members are invited to attend a JCOM chapter breakfast meet or call for a quick mutual introduction.</p>
                </div>
              </div>
            </div>

            {/* Application Form */}
            <div className="col-lg-7">
              <div className="form-card p-4 p-md-5">
                <h3 className="fw-bold text-dark mb-4"><i className="bi bi-file-earmark-text text-primary me-2"></i> Application Form</h3>
                
                <form id="membershipForm" onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label text-dark fw-semibold">Full Name</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0"><i className="bi bi-person text-muted"></i></span>
                        <input type="text" className="form-control border-start-0 ps-0" id="m_name" required placeholder="Enter your name" value={formData.name} onChange={handleChange} />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-dark fw-semibold">Email Address</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0"><i className="bi bi-envelope text-muted"></i></span>
                        <input type="email" className="form-control border-start-0 ps-0" id="m_email" required placeholder="Enter email" value={formData.email} onChange={handleChange} />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-dark fw-semibold">Phone Number</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0"><i className="bi bi-telephone text-muted"></i></span>
                        <input type="tel" className="form-control border-start-0 ps-0" id="m_phone" required placeholder="e.g. +91 9876543210" value={formData.phone} onChange={handleChange} />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-dark fw-semibold">WhatsApp Number</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0"><i className="bi bi-whatsapp text-muted"></i></span>
                        <input type="tel" className="form-control border-start-0 ps-0" id="m_whatsapp" required placeholder="e.g. 919876543210" value={formData.whatsapp} onChange={handleChange} />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-dark fw-semibold">Company / Business Name</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0"><i className="bi bi-building text-muted"></i></span>
                        <input type="text" className="form-control border-start-0 ps-0" id="m_company" placeholder="Company Name" value={formData.company} onChange={handleChange} />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-dark fw-semibold">Business Industry / Domain</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0"><i className="bi bi-briefcase text-muted"></i></span>
                        <input type="text" className="form-control border-start-0 ps-0" id="m_industry" placeholder="e.g. IT, Real Estate, Retail" value={formData.industry} onChange={handleChange} />
                      </div>
                    </div>

                    <div className="col-12">
                      <label className="form-label text-dark fw-semibold">Tell us why you want to join JCOM</label>
                      <textarea className="form-control" id="m_message" rows={4} required placeholder="Briefly state your purpose or business domains you'd like to collaborate with..." value={formData.message} onChange={handleChange}></textarea>
                    </div>

                    <div className="col-12 mt-4">
                      <button type="submit" className="btn btn-primary btn-explore w-100 justify-content-center fw-bold py-3" id="applySubmitBtn" disabled={loading}>
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span> Submitting...
                          </>
                        ) : (
                          <>
                            Apply for Membership <i className="bi bi-arrow-right ms-2"></i>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
