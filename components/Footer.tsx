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
          {/* BRAND */}
          <div className="col-lg-3 col-md-12">
            {/* JCI INDIA */}
            <div className="footer-logo d-flex align-items-center mb-2">
              <img src="/logo/jciindia.png" alt="JCI India Logo" style={{ maxHeight: "50px" }} />
            </div>
            <p className="footer-desc mb-4" style={{ fontSize: "0.9rem" }}>
              JCI India is the largest youth organization providing leadership and development opportunities for youngsters within the age of 18 to 40.
            </p>

            {/* JCOM */}
            <div className="footer-logo d-flex align-items-center mb-2 mt-2">
              <img src="/images/logo1.png" alt="JCOM Logo" style={{ maxHeight: "40px" }} />
            </div>
            <p className="footer-desc" style={{ fontSize: "0.9rem" }}>
              JCOM is a dynamic leadership and business development platform empowering individuals to grow personally, professionally, and socially.
            </p>
            
            <div className="social-links mt-3">
              <a href="https://www.facebook.com/share/1Dg5N9fAMX/" className="social-icon" style={{ width: "32px", height: "32px", fontSize: "14px" }}><i className="bi bi-facebook"></i></a>
              <a href="https://www.instagram.com/jcom_zone18?utm_source=qr&igsh=MWkzY3g2Znpwd3Z6YQ==" className="social-icon" style={{ width: "32px", height: "32px", fontSize: "14px" }}><i className="bi bi-instagram"></i></a>
            </div>
          </div>

          {/* QUICK LINKS 1 */}
          <div className="col-lg-2 col-md-4 col-sm-6">
            <h5 className="footer-title">Quick Links</h5>
            <ul className="footer-links" style={{ fontSize: "0.9rem" }}>
              <li><Link href="/">Home</Link></li>
              <li><Link href="#">About JCI</Link></li>
              <li><Link href="#">JCI Creed</Link></li>
              <li><Link href="#">About JCI India</Link></li>
              <li><Link href="#">Benefits for Members</Link></li>
              <li><Link href="#">Join JCI INDIA</Link></li>
              <li><Link href="#">Privacy Policy</Link></li>
              <li><Link href="#">Terms & Conditions</Link></li>
              <li><Link href="#">Data Deletion Request</Link></li>
            </ul>
          </div>

         

          {/* CONTACT */}
          <div className="col-lg-3 col-md-12">
            <h5 className="footer-title">Contact Us</h5>
            <ul className="footer-contact" style={{ fontSize: "0.9rem" }}>
              <li><i className="bi bi-geo-alt-fill"></i> JCOM Headquarters, India</li>
              <li><i className="bi bi-envelope-fill"></i> zone18jcom@gmail.com</li>
              <li><i className="bi bi-telephone-fill"></i> +91 9003948500</li>
            </ul>
          </div>

          {/* DOWNLOAD APP */}
          <div className="col-lg-4 col-md-4 col-sm-12">
            <h5 className="footer-title">Get Our App</h5>
            <div className="d-flex flex-column gap-3 mt-2">
              <a href="#" className="app-badge-link" target="_blank" rel="noopener noreferrer">
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" style={{ height: "65px", maxWidth: "100%", background: "transparent" }} />
              </a>
              <a href="#" className="app-badge-link" target="_blank" rel="noopener noreferrer">
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="Download on the App Store" style={{ height: "65px", maxWidth: "100%", background: "transparent" }} />
              </a>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="footer-bottom d-flex flex-wrap justify-content-between align-items-center mt-3 pt-3 border-top border-secondary border-opacity-25">
          <p className="mb-0 fw-semibold text-white" style={{ fontSize: '0.95rem' }}>© Copyright 2026, All Rights Reserved by JCOM India</p>
      
          <p className="mb-0 text-white-50" style={{ fontSize: '0.95rem' }}>
            Made with <span className="fw-bold text-white">Kaira Technologies</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
