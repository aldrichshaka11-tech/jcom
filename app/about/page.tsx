"use client";

import Link from "next/link";

export default function About() {
  return (
    <div>
      {/* Page Header Banner */}
      <section className="page-header-banner">
        <div className="container">
          <h1 className="page-header-title">About Us</h1>
          
        </div>
      </section>

      {/* ===== STATIC MISSION & VISION SECTION ===== */}
      <section className="static-mv-section" id="mvTrigger">
        <div className="mv-decor-circle circle-top-left"></div>
        <div className="container">
          <div className="row g-4">
            {/* Vision Card */}
            <div className="col-md-6">
              <div className="mv-card">
                <h2 className="mv-label">
                  <i className="bi bi-eye"></i> Vision
                </h2>
                <p className="mv-desc">
                 To be the Leading Chamber of Commerce of Young JCI Entrepreneurs
                </p>
              </div>
            </div>
            {/* Mission Card */}
            <div className="col-md-6">
              <div className="mv-card">
                <h2 className="mv-label">
                  <i className="bi bi-bullseye"></i> Mission
                </h2>
                <p className="mv-desc">
                  To provide Business Development opportunities that empower young Entrepreneurs towards Business Growth
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== JCOM TABLES SECTION V2 ===== */}
      <section className="tables-section-v2">
        <div className="container">
          <div className="row align-items-center">
            {/* Left Side: Content */}
            <div className="col-lg-7">
              <h2 className="tables-v2-title">JCOM Tables: Unified Business Groups</h2>
              <p className="tables-v2-desc">
                The core organizational unit of JCOM, designed to empower individual business groups with professional structure and global connectivity.
              </p>
              <ul className="tables-v2-list">
                <li>
                  <div className="check-circle"><i className="bi bi-check"></i></div>
                  One Individual business group in a Town/City is called as "Table".
                </li>
                <li>
                  <div className="check-circle"><i className="bi bi-check"></i></div>
                  One Town/City may have any number of "Table"s.
                </li>
                <li>
                  <div className="check-circle"><i className="bi bi-check"></i></div>
                  Tables are not LO specific. When "Table" is created, anyone from any LO can join the "Table".
                </li>
              </ul>
            </div>
            {/* Right Side: Image */}
            <div className="col-lg-5">
              <div className="tables-v2-img-frame">
                <img src="/images/meet.jpg" alt="JCOM Partnership" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TABLE TYPES SECTION ===== */}
      <section className="table-types-section">
        <div className="container">
          <div className="row mb-5 text-center">
            <div className="col-12">
              <h2 className="types-main-title">4 Different Types of Tables</h2>
            </div>
          </div>
          <div className="row g-4">
            {/* Card 1 */}
            <div className="col-lg-3 col-md-6">
              <div className="table-type-card-wrap">
                <div className="table-type-card">
                  <h3 className="table-type-title">Live Table</h3>
                  <p className="table-type-desc">Members of the same area will meet physically every week on a fixed day.</p>
                </div>
              </div>
            </div>
            {/* Card 2 */}
            <div className="col-lg-3 col-md-6">
              <div className="table-type-card-wrap">
                <div className="table-type-card">
                  <h3 className="table-type-title">Virtual Table</h3>
                  <p className="table-type-desc">Members anywhere from same country will meet virtually every week on a fixed day.</p>
                </div>
              </div>
            </div>
            {/* Card 3 */}
            <div className="col-lg-3 col-md-6">
              <div className="table-type-card-wrap">
                <div className="table-type-card">
                  <h3 className="table-type-title">Association Table</h3>
                  <p className="table-type-desc">Members of the same type of business area will meet physically once in a fortnight on a fixed day.</p>
                </div>
              </div>
            </div>
            {/* Card 4 */}
            <div className="col-lg-3 col-md-6">
              <div className="table-type-card-wrap">
                <div className="table-type-card">
                  <h3 className="table-type-title">International Virtual Table</h3>
                  <p className="table-type-desc">Members anywhere from the world will meet virtually every week on a fixed day.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 4 WEEKS MEETINGS TIMELINE SECTION ===== */}
      <section className="meetings-timeline-section">
        <div className="container">
          <div className="row text-center">
            <div className="col-12">
              <h2 className="meetings-title">4 weeks 4 different type of Table meetings</h2>
            </div>
          </div>

          <div className="timeline-wrapper">
            {/* connecting line */}
            <div className="timeline-horizontal-line d-none d-lg-block"></div>
            
            <div className="row g-4 justify-content-center">
              {/* Step 01 */}
              <div className="col-lg-3 col-md-6">
                <div className="timeline-item">
                  <div className="timeline-vertical-line d-none d-lg-block"></div>
                  <div className="timeline-circle">01</div>
                  
                  
                  <div className="timeline-flip-box">
                    <div className="timeline-flip-inner">
                      <div className="timeline-flip-front">
                        <img src="https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=2074" alt="Growth Plan" />
                      </div>
                      <div className="timeline-flip-back">
                        <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015" alt="Growth Charts" />
                      </div>
                    </div>
                  </div>
                  <div className="timeline-badge">Week 1 - 100 min for 100 %</div>
                  <h4 className="timeline-item-title">Growth plan and Growth Call Meet</h4>
                  <p className="timeline-item-desc">Members will give and seek for business connections to each other as per need of other members</p>
                </div>
              </div>

              {/* Step 02 */}
              <div className="col-lg-3 col-md-6">
                <div className="timeline-item">
                  <div className="timeline-vertical-line d-none d-lg-block"></div>
                  <div className="timeline-circle">02</div>
             
                  
                  <div className="timeline-flip-box">
                    <div className="timeline-flip-inner">
                      <div className="timeline-flip-front">
                        <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070" alt="Solution Board" />
                      </div>
                      <div className="timeline-flip-back">
                        <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070" alt="Team Brainstorming" />
                      </div>
                    </div>
                  </div>
     <div className="timeline-badge">Week 2 - 100 min for 100 %</div>
                  <h4 className="timeline-item-title">Solution Board meet</h4>
                  <p className="timeline-item-desc">Any 5 business challenges of members will be discussed, and solutions board will provide solutions</p>
                </div>
              </div>

              {/* Step 03 */}
              <div className="col-lg-3 col-md-6">
                <div className="timeline-item">
                  <div className="timeline-vertical-line d-none d-lg-block"></div>
                  <div className="timeline-circle">03</div>
                  
                  
                  <div className="timeline-flip-box">
                    <div className="timeline-flip-inner">
                      <div className="timeline-flip-front">
                        <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070" alt="Learning Meet" />
                      </div>
                      <div className="timeline-flip-back">
                        <img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070" alt="Learning Library" />
                      </div>
                    </div>
                  </div>
<div className="timeline-badge">Week 3 - 100 min for 100 %</div>
                  <h4 className="timeline-item-title">Learning meet</h4>
                  <p className="timeline-item-desc">Audio based learning meeting with subject expert/consultant to sharpen skills and gain knowledge</p>
                </div>
              </div>

              {/* Step 04 */}
              <div className="col-lg-3 col-md-6">
                <div className="timeline-item">
                  <div className="timeline-vertical-line d-none d-lg-block"></div>
                  <div className="timeline-circle">04</div>
                  
                  
                  <div className="timeline-flip-box">
                    <div className="timeline-flip-inner">
                      <div className="timeline-flip-front">
                        <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070" alt="Cross Business" />
                      </div>
                      <div className="timeline-flip-back">
                        <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32b7?q=80&w=2070" alt="Handshake Deal" />
                      </div>
                    </div>
                  </div>
<div className="timeline-badge">Week 4 - 100 min for 100 %</div>
                  <h4 className="timeline-item-title">Strategic Partner</h4>
                  <p className="timeline-item-desc">It will be joint meet with other JCOM Table to explore the opportunity for more business connections</p>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-10 mx-auto">
              <div className="creative-meet-box">
                <strong>Creative/Innovative Meet:</strong> when 5th weeks are there; Administrative board will decide the type of meeting with innovative ideas. Whenever National JCOM guidelines are given table will conduct meeting accordingly.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CLIENTS SECTION ===== */}
      <section className="clients-section-light">
        <div className="clients-bg-waves"></div>
        <div className="clients-bg-decor"></div>
        <div className="clients-bg-decor bottom-right"></div>
        <div className="vertical-clients-label-light">CLIENTS</div>
        
        <div className="clients-central-wrap">
          <div className="clients-header-center">
            <div className="clients-label-light">OUR CLIENTS</div>
            <h2 className="clients-title-light">Trusted By <span>Leading</span> Organizations</h2>
            <p className="clients-desc-light">We are proud to work with forward-thinking partners across industries and sectors.</p>
          </div>
          
          <div className="clients-grid">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((num) => (
              <div className="client-card-light" key={num}>
                <img src={`/logo/Capture${num === 0 ? "" : num}.PNG`} alt="Client Logo" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER SECTION ===== */}
      <section className="newsletter-section">
        <div className="newsletter-container">
          <div className="newsletter-content">
            <p className="newsletter-label">Subscribe Newsletter</p>
            <h2 className="newsletter-title">Stay Updated with the Latest News!</h2>
          </div>
          
          <form className="newsletter-form-wrapper" onSubmit={(e) => { e.preventDefault(); alert("Subscribed!"); }}>
            <input type="email" className="newsletter-input" placeholder="Enter Email Address" required />
            <button type="submit" className="newsletter-btn">Subscribe Now</button>
          </form>
        </div>
      </section>
    </div>
  );
}
