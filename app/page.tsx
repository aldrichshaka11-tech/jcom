"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getHomeEvents } from "./homeActions";

export default function Home() {
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [completedEvents, setCompletedEvents] = useState<any[]>([]);

  useEffect(() => {
    getHomeEvents().then((data) => {
      setUpcomingEvents(data.upcomingEvents);
      setCompletedEvents(data.completedEvents);
    });
  }, []);

  useEffect(() => {
    if (upcomingEvents.length > 0 && typeof window !== "undefined" && (window as any).Swiper) {
      // Destroy existing instance if it exists to prevent duplicates
      const existingElement = document.querySelector(".newsSwiper") as any;
      if (existingElement && existingElement.swiper) {
        existingElement.swiper.destroy(true, true);
      }

      new (window as any).Swiper(".newsSwiper", {
        slidesPerView: 1,
        loop: upcomingEvents.length > 1,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        },
        pagination: {
          el: ".newsSwiper .swiper-pagination",
          clickable: true,
        },
      });
    }
  }, [upcomingEvents]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const initScripts = () => {
        const Swiper = (window as any).Swiper;
        const gsap = (window as any).gsap;

        if (!Swiper || !gsap) {
          setTimeout(initScripts, 100);
          return;
        }

        // Hero Swiper
        const heroSwiper = new Swiper(".heroSwiper", {
          loop: true,
          effect: "fade",
          fadeEffect: {
            crossFade: true,
          },
          autoplay: {
            delay: 5000,
            disableOnInteraction: false,
          },
          pagination: {
            el: ".swiper-pagination",
            clickable: true,
          },
          navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          },
          on: {
            init: function (this: any) {
              animateHeroContent(this.slides[this.activeIndex], gsap);
            },
            slideChangeTransitionStart: function () {
              gsap.set("[data-gsap]", { opacity: 0, x: -50, scale: 0.8 });
            },
            slideChangeTransitionEnd: function (this: any) {
              animateHeroContent(this.slides[this.activeIndex], gsap);
            },
          },
        });

        // Chapters Swiper
        new Swiper(".chaptersSwiper", {
          slidesPerView: 1,
          spaceBetween: 20,
          loop: true,
          navigation: {
            nextEl: ".chapters-next",
            prevEl: ".chapters-prev",
          },
          breakpoints: {
            576: {
              slidesPerView: 2,
              spaceBetween: 15,
            },
            992: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            1400: {
              slidesPerView: 5,
              spaceBetween: 25,
            },
          },
        });
      };

      initScripts();

      function animateHeroContent(activeSlide: HTMLElement, gsap: any) {
        if (!gsap || !activeSlide) return;
        const elements = activeSlide.querySelectorAll("[data-gsap]");
        elements.forEach((el) => {
          const effect = el.getAttribute("data-gsap");
          const delay = parseFloat(el.getAttribute("data-gsap-delay") || "0");

          if (effect === "fade-right") {
            gsap.fromTo(
              el,
              { opacity: 0, x: -50 },
              { opacity: 1, x: 0, duration: 1, delay: delay, ease: "power3.out" }
            );
          } else if (effect === "zoom-in") {
            gsap.fromTo(
              el,
              { opacity: 0, scale: 0.5, x: 0 },
              { opacity: 1, scale: 1, x: 0, duration: 1.2, delay: delay, ease: "back.out(1.7)" }
            );
          }
        });
      }

      // Chapters Carousel Navigation Logic
      const track = document.getElementById("carouselTrack");
      const cards = document.querySelectorAll(".kk_associate-card");
      let index = 0;

      function gap() {
        return window.innerWidth < 768 ? 16 : 24;
      }

      function cardWidth() {
        if (!cards.length) return 0;
        return (cards[0] as HTMLElement).offsetWidth + gap();
      }

      (window as any).nextSlide = function () {
        if (track && index < cards.length - 2) {
          index++;
          track.style.transform = `translateX(-${index * cardWidth()}px)`;
        }
      };

      (window as any).prevSlide = function () {
        if (track && index > 0) {
          index--;
          track.style.transform = `translateX(-${index * cardWidth()}px)`;
        }
      };

      window.addEventListener("resize", () => {
        if (track && cards.length) {
          track.style.transform = `translateX(-${index * cardWidth()}px)`;
        }
      });
    }
  }, []);

  return (
    <div>
      {/* Dynamic News Marquee */}
      <section id="events" className="news-section">
        <div className="container d-flex align-items-center h-100 p-0">
          <div className="news-label" style={{ zIndex: 2 }}>News & Events Recruitment</div>
          <div className="news-marquee">
            <div className="news-track">
              <div className="news-item">
                <img src="/images/new.gif" alt="New gif" style={{ height: '30px', marginRight: '10px' }} />
                <span className="news-dot">•</span>
                <a className="text-decoration-none text-light fw-bold" href="#">
                  Empowering Business Leaders Through Networking & Opportunities
                </a>
              </div>
              <div className="news-item">
                <span className="news-dot">•</span>
                <a className="text-decoration-none text-light fw-bold" href="#">
                  A platform where business meets opportunity. Network, collaborate, and unlock new possibilities with JCOM Zone
                </a>
              </div>
              <div className="news-item">
                <span className="news-dot">•</span>
                <a className="text-decoration-none text-light fw-bold" href="#">
                  Connect • Collaborate • Create Opportunities • Grow Together
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PREMIUM HERO SLIDER ================= */}
      <section id="home" className="hero-slider-section">
        <div className="swiper heroSwiper">
          <div className="swiper-wrapper">
            {/* Slide 1 */}
            <div className="swiper-slide">
              <div className="hero-slide-content slide-alt">
                <div className="container">
                  <div className="row align-items-center">
                    <div className="col-lg-6 hero-text-col">
                      <div className="hero-badge" data-gsap="fade-right">
                        LEADERSHIP EXCELLENCE
                      </div>
                      <h1 className="hero-title" data-gsap="fade-right" data-gsap-delay="0.2">
                        Empowering The Next <br />
                        <span>Generation of Leaders.</span>
                      </h1>
                      <p className="hero-desc" data-gsap="fade-right" data-gsap-delay="0.4">
                        JCOM provides the essential platform, resources, and mentorship you need to excel in your professional journey.
                      </p>
                      <div className="hero-btns d-flex flex-wrap gap-3" data-gsap="fade-right" data-gsap-delay="0.6">
                        <Link href="/memberships" className="btn btn-premium">
                          Get Started Today <i className="bi bi-chevron-right"></i>
                        </Link>
                        <Link href="/events" className="btn btn-premium-outline">
                          Explore Events <i className="bi bi-calendar-event"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="hero-image-split">
                  <img src="/team/group2.png" alt="Leadership Excellence" />
                </div>
              </div>
            </div>

            {/* Slide 2 */}
            <div className="swiper-slide">
              <div className="hero-slide-content">
                <div className="container">
                  <div className="row align-items-center">
                    <div className="col-lg-6 hero-text-col">
                      <div className="hero-badge" data-gsap="fade-right">
                        COLLECTIVE GROWTH
                      </div>
                      <h1 className="hero-title">
                        Achieve More <br />
                        <span>Together.</span>
                      </h1>
                      <p className="hero-desc">Connecting Communities, Creating Impact.</p>
                      <div className="hero-btns d-flex flex-wrap gap-3">
                        <Link href="/about" className="btn btn-premium">
                          Discover More <i className="bi bi-chevron-right"></i>
                        </Link>
                        <Link href="/contact" className="btn btn-premium-outline">
                          Contact Us <i className="bi bi-envelope"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="hero-image-split">
                  <img src="/team/group3.png" alt="Collective Growth" />
                </div>
              </div>
            </div>
          </div>

          <div className="swiper-button-next"></div>
          <div className="swiper-button-prev"></div>
          <div className="swiper-pagination"></div>
        </div>
      </section>

      {/* Dynamic Info Cards Section */}
      <div className="container py-5">
        <div className="row">
          {/* LEFT: UPCOMING */}
          <div className="col-md-6">
            <h3 className="section-title">Upcoming Events</h3>
            <div className="swiper newsSwiper" key={`news-${upcomingEvents.length}`}>
              <div className="swiper-wrapper">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event) => (
                    <div className="swiper-slide" key={event.id}>
                      <div className="news-card">
                        <img src={event.imageUrl || "https://placehold.co/600x400?text=JCOM"} alt={event.title} />
                        <div className="news-body">
                          <h6>
                            {event.title} - {new Date(event.date).toLocaleDateString()}
                            <br />
                            <small className="text-muted fw-normal">{event.description?.substring(0, 80)}...</small>
                          </h6>
                        </div>
                        <Link href="/events" className="read-more text-dark fw-bold text-decoration-none">Explore More</Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="swiper-slide">
                    <div className="news-card p-4 text-center">
                      <div className="news-body">
                        <h6>No upcoming events at the moment.</h6>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="swiper-pagination position-relative mt-3"></div>
            </div>
          </div>

          {/* RIGHT: COMPLETED */}
          <div className="col-md-6">
            <h3 className="section-title">Our Completed Events</h3>
            <div className="bulletin-box d-flex flex-column" style={{ height: "430px" }}>
              <div className="bulletin-track flex-grow-1" style={{ overflowY: "auto" }}>
                {completedEvents.length > 0 ? (
                  completedEvents.map((event) => (
                    <div className="bulletin-item" key={event.id}>
                      <strong>{event.title}</strong>
                      <p>{new Date(event.date).toLocaleDateString()} {event.location ? `| ${event.location}` : ""}</p>
                    </div>
                  ))
                ) : (
                  <div className="bulletin-item">
                    <strong>No recent events</strong>
                    <p>Check back later for updates</p>
                  </div>
                )}
              </div>
              <Link href="/events" className="read-more text-dark fw-bold text-decoration-none" style={{ borderTop: "1px solid #ddd", background: "#ffffff", display: "block" }}>
                Explore More
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ABOUT JCOM */}
      <section id="about" className="cc_section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6" style={{ position: "relative", zIndex: 10 }}>
              <div className="about-content">
                <div className="about-label">ABOUT JCOM</div>
                <h2 className="about-heading">
                  Welcome to <span>JCOM</span>
                </h2>
                <p className="about-description">
                  JCOM (Jaycees Chamber of Commerce / Junior Chamber Organisation for Members) is a dynamic leadership and business
                  development platform that empowers individuals to grow personally, professionally, and socially. Through structured
                  training, business networking, community service, and leadership opportunities, JCOM nurtures confident leaders who create
                  positive impact in society.
                </p>

                <div className="about-cards">
                  <div className="about-card">
                    <div className="icon-wrapper">
                      <i className="bi bi-geo-alt-fill"></i>
                    </div>
                    <h5>
                      Countries
                      <br />
                      Embassies
                    </h5>
                    <p>Building global presence across countries.</p>
                  </div>
                  <div className="about-card">
                    <div className="icon-wrapper">
                      <i className="bi bi-people-fill"></i>
                    </div>
                    <h5>
                      Associate
                      <br />
                      Members
                    </h5>
                    <p>A strong network of passionate members.</p>
                  </div>
                  <div className="about-card">
                    <div className="icon-wrapper">
                      <i className="bi bi-diagram-3-fill"></i>
                    </div>
                    <h5>
                      Organizations
                      <br />
                      Connected
                    </h5>
                    <p>Partners and organizations working together.</p>
                  </div>
                </div>

                <Link href="/about" className="btn-explore">
                  Explore More <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            </div>

            <div className="col-lg-6 mt-5 mt-lg-0 position-relative">
              <div className="large-circle-decor"></div>
              <div className="dots-bg-top"></div>
              <div className="dots-bg-bottom"></div>
              <div className="about-hexagon-wrap">
                <div className="hexagon-container">
                  <img src="/images/event.jpg" alt="About JCOM" className="hexagon-img" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW JCOM WORKS (Carousel Track) */}
      <section id="features" className="kk_associates-section team-section1">
        <div className="container container1">
          <div className="row align-items-center">
            <div className="col-md-4 mb-4 mb-md-0">
              <h2 className="kk_associates-title">
                <span className="kk_our text-light">How JCOM Works?</span>
                <br />
              </h2>
              <p className="text-light opacity-75 small mt-3">
                JCOM table meetings are designed in such a manner so that JCOM members can fulfill all these requirements with their active
                participation in JCOM table meetings and suggested activities.
              </p>
            </div>

            <div className="col-md-8">
              <div className="kk_carousel-wrapper">
                <div className="kk_carousel-track" id="carouselTrack">
                  <div className="kk_associate-card text-dark">
                    <img
                      src="https://img.icons8.com/?size=100&id=tyfqup8e652P&format=png&color=000000"
                      style={{ height: "100px", width: "100px" }}
                      alt="Connections"
                    />
                    <h4 className="mt-3">New connections</h4>
                    <p>Build valuable professional and personal networks through active JCOM engagement.</p>
                  </div>

                  <div className="kk_associate-card text-dark">
                    <img
                      src="https://img.icons8.com/?size=100&id=114317&format=png&color=000000"
                      style={{ height: "100px", width: "100px" }}
                      alt="Solutions"
                    />
                    <h4 className="mt-3">Solutions of challenges</h4>
                    <p>Collaborate with mentors and peers to find effective solutions for business and community hurdles.</p>
                  </div>

                  <div className="kk_associate-card text-dark">
                    <img
                      src="https://img.icons8.com/?size=100&id=114323&format=png&color=000000"
                      style={{ height: "100px", width: "100px" }}
                      alt="Improvements"
                    />
                    <h4 className="mt-3">Capability improvements</h4>
                    <p>Enhance your leadership and professional skills through structured training and practice.</p>
                  </div>

                  <div className="kk_associate-card text-dark">
                    <img
                      src="https://img.icons8.com/?size=100&id=37913&format=png&color=000000"
                      style={{ height: "100px", width: "100px" }}
                      alt="Expansion"
                    />
                    <h4 className="mt-3">Expansion possibilities</h4>
                    <p>Discover new avenues for growth and expand your reach within local and global communities.</p>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-center gap-3 mt-4 mar-left">
                <button className="kk_carousel-btn" onClick={() => (window as any).prevSlide()}>
                  ‹
                </button>
                <button className="kk_carousel-btn" onClick={() => (window as any).nextSlide()}>
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHO ARE WE */}
      <section className="ms_section">
        <div className="container">
          <div className="row align-items-start">
            <div className="col-lg-6">
              <div className="ms_video">
                <img src="/images/group.jpg" alt="Team collaborating" />
              </div>
            </div>

            <div className="col-lg-6">
              <div className="ms_content ps-lg-5 text-dark">
                <h2 className="mb-4">Who are we?</h2>
                <p className="mb-4 text-dark">
                  JCOM is one of the world’s largest youth organizations of young leaders, entrepreneurs and active citizens with nearly
                  2,00,000+ active members and millions of alumni in more than 6,000 communities in over 120 countries.
                </p>

                <div className="ms_features mt-4 d-flex gap-4">
                  <div className="ms_feature_item d-flex align-items-center gap-2">
                    <i className="bi bi-briefcase fs-4 text-primary"></i>
                    <span className="fw-bold">Backed by Experience</span>
                  </div>
                  <div className="ms_feature_item d-flex align-items-center gap-2">
                    <i className="bi bi-patch-check fs-4 text-primary"></i>
                    <span className="fw-bold">Guided by Values</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section id="benefits" className="benefits-premium-section">
        <div className="benefits-inner-container">
          <div className="row align-items-stretch">
            <div className="col-lg-7">
              <div className="benefits-img-wrapper">
                <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4" alt="Member Benefits" />
              </div>
            </div>

            <div className="col-lg-5">
              <div className="benefits-card">
                <div className="benefit-badge">Member Benefits</div>
                <h2 className="benefits-title">What You Get as a Member</h2>

                <div className="benefit-list">
                  <div className="benefit-item">
                    <div className="benefit-icon">
                      <i className="bi bi-people-fill"></i>
                    </div>
                    <div className="benefit-content">
                      <p>
                        <span className="benefit-title-inline">20-Chapter Meetings Per Year:</span> Our 90-minute meeting agenda provides a
                        platform to invite qualified guests for the benefit of other Members, ensuring time and energy is invested.
                      </p>
                    </div>
                  </div>

                  <div className="benefit-item">
                    <div className="benefit-icon">
                      <i className="bi bi-graph-up-arrow"></i>
                    </div>
                    <div className="benefit-content">
                      <p>
                        <span className="benefit-title-inline">Professional Business Growth:</span> Enables every JCOM member to grow their
                        business volume with confidence.
                      </p>
                    </div>
                  </div>

                  <div className="benefit-item">
                    <div className="benefit-icon">
                      <i className="bi bi-diagram-3-fill"></i>
                    </div>
                    <div className="benefit-content">
                      <p>
                        <span className="benefit-title-inline">Systematic Networking:</span> Provides networking platform with structured
                        and systematic meetings.
                      </p>
                    </div>
                  </div>

                  <div className="benefit-item">
                    <div className="benefit-icon">
                      <i className="bi bi-person-badge-fill"></i>
                    </div>
                    <div className="benefit-content">
                      <p>
                        <span className="benefit-title-inline">Dedicated Mentorship:</span> Handholding approach to ensure the business
                        growth of member.
                      </p>
                    </div>
                  </div>

                  <div className="benefit-item">
                    <div className="benefit-icon">
                      <i className="bi bi-handshake-fill"></i>
                    </div>
                    <div className="benefit-content">
                      <p>
                        <span className="benefit-title-inline">Strategic Collaboration:</span> Connections with members across the country for
                        collaboration to expand your business.
                      </p>
                    </div>
                  </div>

                  <div className="benefit-item">
                    <div className="benefit-icon">
                      <i className="bi bi-mortarboard-fill"></i>
                    </div>
                    <div className="benefit-content">
                      <p>
                        <span className="benefit-title-inline">Expert Training:</span> Business knowledge and skill development trainings with
                        experts.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PARALLAX JOIN */}
      <section className="parallax-join">
        <div className="container">
          <h2>WHO CAN JOIN?</h2>
          <p>
            Any individual (Professional/ Self employed/ Entrepreneur);<br />
            who is either active or associate/SMA or alumni member of JCI, can join JCOM through proper application.
          </p>
        </div>
      </section>

      {/* VIBRANT CHAPTERS CROSSROADS */}
      <section className="chapters-section">
        <div className="container">
          <div className="chapters-header-row mb-5">
            <div className="header-left">
              <span className="chapters-label-badge">Chapters</span>
              <h2 className="chapters-main-title mt-2">Our Vibrant Chapters Across Thoothukudi</h2>
            </div>
            <div className="header-divider d-none d-lg-block"></div>
            <div className="header-right d-none d-lg-block">
              <p>Connecting entrepreneurs, empowering local ecosystems - explore the growing family of JCOM chapters.</p>
            </div>
          </div>

          <div className="swiper chaptersSwiper">
            <div className="swiper-wrapper">
              <div className="swiper-slide">
                <div className="chapter-card-new pt-4">
                  <div className="card-body-new">
                    <img src="/team/rajamoorthy2.jpg" alt="Rajamoorthy R" className="chapter-img" />
                    <h5 className="text-center mt-3 mb-1" style={{ color: "#111", fontWeight: 800, fontSize: "16px" }}>
                      Rajamoorthy R
                    </h5>
                  </div>
                  <div className="card-footer-new">
                    <Link href="/team" className="btn-chapter-read">
                      Read More{" "}
                      <span className="arrow-circle-new">
                        <i className="bi bi-arrow-right"></i>
                      </span>
                    </Link>
                  </div>
                  <div className="card-accent-shape"></div>
                </div>
              </div>

              <div className="swiper-slide">
                <div className="chapter-card-new pt-4">
                  <div className="card-body-new">
                    <img src="/team/virtual-photoshoot-2 (6) - sundar rajan.jpg" alt="Sundar Rajan" className="chapter-img" />
                    <h5 className="text-center mt-3 mb-1" style={{ color: "#111", fontWeight: 800, fontSize: "16px" }}>
                      Sundar Rajan
                    </h5>
                  </div>
                  <div className="card-footer-new">
                    <Link href="/team" className="btn-chapter-read">
                      Read More{" "}
                      <span className="arrow-circle-new">
                        <i className="bi bi-arrow-right"></i>
                      </span>
                    </Link>
                  </div>
                  <div className="card-accent-shape"></div>
                </div>
              </div>

              <div className="swiper-slide">
                <div className="chapter-card-new pt-4">
                  <div className="card-body-new">
                    <img src="/team/Screenshot_20251201_210947_Photos - Gayathri Thirupathi.jpg" alt="Gayathri T" className="chapter-img" />
                    <h5 className="text-center mt-3 mb-1" style={{ color: "#111", fontWeight: 800, fontSize: "16px" }}>
                      Gayathri T.
                    </h5>
                  </div>
                  <div className="card-footer-new">
                    <Link href="/team" className="btn-chapter-read">
                      Read More{" "}
                      <span className="arrow-circle-new">
                        <i className="bi bi-arrow-right"></i>
                      </span>
                    </Link>
                  </div>
                  <div className="card-accent-shape"></div>
                </div>
              </div>

              <div className="swiper-slide">
                <div className="chapter-card-new pt-4">
                  <div className="card-body-new">
                    <img src="/team/LOGU assistant coach - JFD.G LOGANATHAN.png" alt="LOGANATHAN" className="chapter-img" />
                    <h5 className="text-center mt-3 mb-1" style={{ color: "#111", fontWeight: 800, fontSize: "16px" }}>
                      LOGANATHAN
                    </h5>
                  </div>
                  <div className="card-footer-new">
                    <Link href="/team" className="btn-chapter-read">
                      Read More{" "}
                      <span className="arrow-circle-new">
                        <i className="bi bi-arrow-right"></i>
                      </span>
                    </Link>
                  </div>
                  <div className="card-accent-shape"></div>
                </div>
              </div>

              <div className="swiper-slide">
                <div className="chapter-card-new pt-4">
                  <div className="card-body-new">
                    <img src="/team/JEETH PASSPOT SIZE PHOTO - Jeeth Pandien.jpg" alt="Jeeth Pandien" className="chapter-img" />
                    <h5 className="text-center mt-3 mb-1" style={{ color: "#111", fontWeight: 800, fontSize: "16px" }}>
                      Jeeth Pandien
                    </h5>
                  </div>
                  <div className="card-footer-new">
                    <Link href="/team" className="btn-chapter-read">
                      Read More{" "}
                      <span className="arrow-circle-new">
                        <i className="bi bi-arrow-right"></i>
                      </span>
                    </Link>
                  </div>
                  <div className="card-accent-shape"></div>
                </div>
              </div>
              <div className="swiper-slide">
                <div className="chapter-card-new pt-4">
                  <div className="card-body-new">
                    <img src="/team/60d2995a-584f-4cdd-84a8-4f8e0e0dab4a - Aravind Gowsik. (1).jpeg" alt="Aravind Gowsik" className="chapter-img" />
                    <h5 className="text-center mt-3 mb-1" style={{ color: "#111", fontWeight: 800, fontSize: "16px" }}>
                      Aravind Gowsik
                    </h5>
                  </div>
                  <div className="card-footer-new">
                    <Link href="/team" className="btn-chapter-read">
                      Read More{" "}
                      <span className="arrow-circle-new">
                        <i className="bi bi-arrow-right"></i>
                      </span>
                    </Link>
                  </div>
                  <div className="card-accent-shape"></div>
                </div>
              </div>

              <div className="swiper-slide">
                <div className="chapter-card-new pt-4">
                  <div className="card-body-new">
                    <img src="/team/e64633ab-76d4-4755-b5c1-51feede74430 - Pon Vijayan.jpeg" alt="Pon Vijayan" className="chapter-img" />
                    <h5 className="text-center mt-3 mb-1" style={{ color: "#111", fontWeight: 800, fontSize: "16px" }}>
                      Pon Vijayan
                    </h5>
                  </div>
                  <div className="card-footer-new">
                    <Link href="/team" className="btn-chapter-read">
                      Read More{" "}
                      <span className="arrow-circle-new">
                        <i className="bi bi-arrow-right"></i>
                      </span>
                    </Link>
                  </div>
                  <div className="card-accent-shape"></div>
                </div>
              </div>

              <div className="swiper-slide">
                <div className="chapter-card-new pt-4">
                  <div className="card-body-new">
                    <img src="/team/IMG_20260405_121710_263~2 - Aarojin Infant Raja.png" alt="Aarojin Infant Raja" className="chapter-img" />
                    <h5 className="text-center mt-3 mb-1" style={{ color: "#111", fontWeight: 800, fontSize: "16px" }}>
                      Aarojin Infant Raja
                    </h5>
                  </div>
                  <div className="card-footer-new">
                    <Link href="/team" className="btn-chapter-read">
                      Read More{" "}
                      <span className="arrow-circle-new">
                        <i className="bi bi-arrow-right"></i>
                      </span>
                    </Link>
                  </div>
                  <div className="card-accent-shape"></div>
                </div>
              </div>
            </div>

            <div className="swiper-button-next chapters-next"></div>
            <div className="swiper-button-prev chapters-prev"></div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="newsletter-section">
        <div className="newsletter-container">
          <div className="newsletter-content">
            <p className="newsletter-label">Subscribe Newsletter</p>
            <h2 className="newsletter-title">Stay Updated with the Latest News!</h2>
          </div>

          <form className="newsletter-form-wrapper" onSubmit={(e) => { e.preventDefault(); alert("Subscribed!"); }}>
            <input type="email" className="newsletter-input" placeholder="Enter Email Address" required />
            <button type="submit" className="newsletter-btn">
              Subscribe Now
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
