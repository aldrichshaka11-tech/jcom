"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  // Hide Footer on Admin pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }
  return (
    <footer className="footer-jcom mt-auto">
      <div className="container">
        <div className="row g-4 footer-top">
          {/* BRAND */}
          <div className="col-lg-4 col-md-6">
            <div className="footer-logo d-flex align-items-center mb-3">
              <img src="/images/logo1.png" alt="JCOM Logo" style={{ maxHeight: "60px" }} />
            </div>
            <p className="footer-desc">
              JCOM is a dynamic leadership and business development platform empowering individuals to grow personally, professionally, and socially.
            </p>
            <div className="social-links mt-3">
              <a href="#" className="social-icon"><i className="bi bi-facebook"></i></a>
              <a href="#" className="social-icon"><i className="bi bi-twitter"></i></a>
              <a href="#" className="social-icon"><i className="bi bi-instagram"></i></a>
              <a href="#" className="social-icon"><i className="bi bi-linkedin"></i></a>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className="col-lg-2 col-md-6">
            <h5 className="footer-title">Quick Links</h5>
            <ul className="footer-links">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/team">Our Team</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* RESOURCES */}
          <div className="col-lg-3 col-md-6">
            <h5 className="footer-title">Resources</h5>
            <ul className="footer-links">
              <li><a href="#">Events & Workshops</a></li>
              <li><a href="#">Business Networking</a></li>
              <li><a href="#">Leadership Programs</a></li>
              <li><a href="#">Community Service</a></li>
            </ul>
          </div>

          {/* CONTACT */}
          <div className="col-lg-3 col-md-6">
            <h5 className="footer-title">Contact Us</h5>
            <ul className="footer-contact">
              <li><i className="bi bi-geo-alt-fill"></i> JCOM Headquarters, India</li>
              <li><i className="bi bi-envelope-fill"></i> info@jcom.org</li>
              <li><i className="bi bi-telephone-fill"></i> +91 98765 43210</li>
            </ul>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="footer-bottom text-center">
          <p className="mb-0">© 2026 JCOM. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
