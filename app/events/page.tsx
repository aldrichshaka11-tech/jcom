import { db } from "@/lib/db";
import Link from "next/link";
import EventsModalHandler from "./EventsModalHandler";

export const revalidate = 0; // ensure page is dynamically rendered

export default async function EventsPage() {
  // Query dynamic events from PostgreSQL
  let events: any[] = [];
  try {
    events = await db.event.findMany({
      orderBy: { date: "asc" },
    });
  } catch (error) {
    console.error("Error fetching events from DB:", error);
  }

  // Fallback default events
  const defaultEvents = [
    {
      id: "1",
      title: "JCOM Zone 18 Business Leadership Summit 2026",
      category: "Summit",
      date: new Date("2026-10-18"),
      time: "09:30 AM - 05:30 PM",
      location: "Zone 18 Convention Centre, Chennai",
      imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80",
      actionUrl: "/contact",
      description: "A high-impact summit featuring national business coaches, trade networking sessions, and panels on scaling businesses, digital transformation, and investment strategies.",
    },
    {
      id: "2",
      title: "JCOM Zone 18 B2B Expo & Trade Fair",
      category: "Trade Expo",
      date: new Date("2026-11-12"),
      time: "10:00 AM - 08:00 PM",
      location: "Grand Royal Palace Hall, Madurai",
      imageUrl: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&auto=format&fit=crop&q=80",
      actionUrl: "/contact",
      description: "Exhibit your business products, connect with potential distributors, and build franchise connections with over 500+ delegates from Zone 18 tables.",
    },
    {
      id: "3",
      title: "JCOM Masterclass: AI for Business Growth",
      category: "Workshop",
      date: new Date("2026-12-05"),
      time: "03:00 PM - 06:00 PM",
      location: "Virtual (Zoom Interactive Session)",
      imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80",
      actionUrl: "/contact",
      description: "Learn how to leverage Generative AI, automated CRM systems, and AI-driven marketing tools to scale your business operations and sales pipelines.",
    },
    {
      id: "4",
      title: "JCOM Zone 18 Presidents' Meet 2026",
      category: "Summit",
      date: new Date("2026-02-15"),
      time: "10:00 AM - 04:00 PM",
      location: "Heritage Palace Hall, Tuticorin",
      imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80",
      actionUrl: "#",
      description: "Annual strategic meet for all Zone 18 Table Presidents to align on growth milestones, membership benefits, and community initiatives.",
    },
    {
      id: "5",
      title: "JCOM Networking Breakfast Meet",
      category: "Networking",
      date: new Date("2026-04-10"),
      time: "08:00 AM - 11:00 AM",
      location: "Fortune Park Hotel, Virudhunagar",
      imageUrl: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&auto=format&fit=crop&q=80",
      actionUrl: "#",
      description: "Facilitated networking session with a focus on cross-chapter business referrals and strategic alliances.",
    },
    {
      id: "6",
      title: "JCOM Business Excellence Awards 2026",
      category: "Awards Night",
      date: new Date("2026-06-05"),
      time: "06:30 PM - 10:30 PM",
      location: "Taj Gateway Hotel, Coimbatore",
      imageUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80",
      actionUrl: "#",
      description: "Recognizing the outstanding business contributions, young entrepreneurs, and social impact leaders within Zone 18 tables.",
    },
  ];

  // If database events is empty, use defaultEvents
  const displayEvents = events.length > 0 ? events : defaultEvents;

  // Split into upcoming vs completed relative to current date (June 15, 2026)
  const currentDate = new Date("2026-06-15");

  const upcomingEvents = displayEvents.filter((event) => {
    const d = new Date(event.date);
    return isNaN(d.getTime()) ? true : d >= currentDate;
  });

  const completedEvents = displayEvents.filter((event) => {
    const d = new Date(event.date);
    return isNaN(d.getTime()) ? false : d < currentDate;
  });

  function formatDate(date: Date | string) {
    const d = new Date(date);
    if (isNaN(d.getTime())) return String(date);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function getBadgeClass(category: string) {
    if (!category) return "bg-primary";
    const cat = category.toLowerCase();
    if (cat.includes("summit")) return "badge-summit";
    if (cat.includes("expo") || cat.includes("trade")) return "badge-expo";
    if (cat.includes("workshop") || cat.includes("masterclass")) return "badge-workshop";
    if (cat.includes("networking") || cat.includes("breakfast")) return "badge-networking";
    if (cat.includes("award")) return "badge-awards";
    return "bg-primary";
  }

  return (
    <>


      {/* Page Header */}
      <section className="page-header-banner">
        <div className="container">
          <h1 className="page-header-title">JCOM ZONE 18 EVENTS</h1>
          <div className="page-breadcrumbs">
            <Link href="/">Home</Link>
            <span>/</span>
            <span className="current">Events</span>
          </div>
        </div>
      </section>

      {/* Events Main Container */}
      <div className="container" style={{ marginTop: "50px", minHeight: "60vh" }}>
        
        {/* Upcoming Events Title */}
        <div className="d-flex justify-content-between align-items-end mb-4 border-bottom pb-3">
          <h2 className="fw-bold m-0" style={{ color: "#0f172a" }}>Upcoming Events</h2>
          <span className="badge bg-primary px-3 py-2 rounded-pill fs-6">
            {upcomingEvents.length} Event{upcomingEvents.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Upcoming Events List */}
        <div className="row g-4 mb-5">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => (
              <div className="col-lg-12" key={event.id}>
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden event-card-upcoming">
                  <div className="row g-0">
                    <div className="col-md-4 position-relative">
                      <img
                        src={event.imageUrl || "https://placehold.co/600x400?text=JCOM+Event"}
                        className="img-fluid h-100 w-100 object-fit-cover event-img"
                        style={{ minHeight: "250px" }}
                        alt={event.title}
                      />
                      <span className={`badge position-absolute top-0 start-0 m-3 px-3 py-2 rounded-pill shadow-sm ${getBadgeClass(event.category)}`}>
                        {event.category || "Event"}
                      </span>
                    </div>
                    <div className="col-md-8">
                      <div className="card-body p-4 d-flex flex-column h-100">
                        <div className="d-flex align-items-center text-primary mb-2 fw-semibold">
                          <i className="bi bi-calendar3 me-2"></i> {formatDate(event.date)} {event.time ? ` | ${event.time}` : ""}
                        </div>
                        <h4 className="card-title fw-bold text-dark mb-3">{event.title}</h4>
                        <p className="card-text text-muted mb-4">{event.description}</p>
                        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mt-auto pt-3 border-top">
                          <div className="text-muted small">
                            <i className="bi bi-geo-alt-fill me-2 text-danger"></i> {event.location}
                          </div>
                          <div className="d-flex gap-2">
                            {event.galleryImages && event.galleryImages.length > 0 && (
                              <button
                                className="btn btn-outline-primary px-3 rounded-pill btn-sm fw-bold highlight-btn"
                                data-bs-toggle="modal"
                                data-bs-target="#galleryModal"
                                data-title={event.title}
                                data-img={event.imageUrl || "https://placehold.co/600x400"}
                                data-gallery={JSON.stringify(event.galleryImages || [])}
                                data-desc={event.description}
                              >
                                View Posters <i className="bi bi-images ms-1"></i>
                              </button>
                            )}
                            <Link href={event.actionUrl && event.actionUrl !== "#" ? event.actionUrl : "/contact"} className="btn btn-primary px-4 rounded-pill btn-sm fw-bold">
                              Register Now <i className="bi bi-arrow-right-short ms-1"></i>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center text-muted py-5">
              <i className="bi bi-calendar-x fs-2"></i>
              <p className="mt-2">No upcoming events scheduled at the moment.</p>
            </div>
          )}
        </div>

        {/* Section Divider */}
        <div className="section-divider"></div>

        {/* Completed Events Title */}
        <div className="d-flex justify-content-between align-items-end mb-4 border-bottom pb-3 mt-5 pt-4">
          <h2 className="fw-bold m-0" style={{ color: "#64748b" }}>Completed Events</h2>
          <span className="badge bg-secondary px-3 py-2 rounded-pill fs-6">
            {completedEvents.length} Event{completedEvents.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Completed Events List */}
        <div className="row row-cols-1 row-cols-md-3 g-4 mb-5">
          {completedEvents.length > 0 ? (
            completedEvents.map((event) => (
              <div className="col" key={event.id}>
                <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden event-card-completed">
                  <div className="position-relative overflow-hidden" style={{ height: "200px" }}>
                    <img
                      src={event.imageUrl || "https://placehold.co/600x400?text=JCOM+Event"}
                      className="card-img-top h-100 w-100 object-fit-cover event-img"
                      alt={event.title}
                    />
                    <span className={`badge position-absolute top-0 start-0 m-3 px-3 py-2 rounded-pill shadow-sm ${getBadgeClass(event.category)}`}>
                      {event.category || "Event"}
                    </span>
                  </div>
                  <div className="card-body p-4 d-flex flex-column">
                    <span className="badge bg-light text-secondary mb-3 border align-self-start">
                      <i className="bi bi-check-circle-fill text-success me-1"></i> Completed
                    </span>
                    <h5 className="card-title fw-bold text-dark mb-2">{event.title}</h5>
                    <p className="text-muted small mb-3">
                      <i className="bi bi-calendar3 me-1"></i> {formatDate(event.date)}
                    </p>
                    <p className="card-text text-muted small flex-grow-1">{event.description}</p>
                    <div className="text-muted small mb-3">
                      <i className="bi bi-geo-alt-fill me-1 text-danger"></i> {event.location}
                    </div>
                    <button
                      className="btn btn-light btn-sm text-primary fw-bold w-100 rounded-pill mt-auto highlight-btn"
                      data-bs-toggle="modal"
                      data-bs-target="#galleryModal"
                      data-title={event.title}
                      data-img={event.imageUrl || "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800"}
                      data-gallery={JSON.stringify(event.galleryImages || [])}
                      data-desc={event.description}
                    >
                      View Highlights <i className="bi bi-images ms-1"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center text-muted py-5">
              <i className="bi bi-calendar-x fs-2"></i>
              <p className="mt-2">No completed events found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Client-side gallery click handler & Modal Renderer */}
      <EventsModalHandler />
    </>
  );
}
