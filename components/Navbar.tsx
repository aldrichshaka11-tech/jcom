"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Events", href: "/events" },
    { name: "Team", href: "/team" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className={`fixed-header ${scrolled ? "scrolled" : ""}`}>
      <nav className="navbar navbar-expand-lg">
        <div className="container">
          <Link href="/" className="navbar-brand d-flex align-items-center" style={{ textDecoration: "none" }} onClick={handleLinkClick}>
            <img src="/images/logo1.png" alt="Logo Icon" style={{ height: "65px", marginRight: "10px" }} />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-controls="navMenu"
            aria-expanded={isOpen}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`} id="navMenu">
            <ul className="navbar-nav mx-auto">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href} className="nav-item">
                    <Link
                      href={link.href}
                      className={`nav-link ${isActive ? "active" : ""}`}
                      onClick={handleLinkClick}
                    >
                      {link.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="d-none d-lg-flex ms-3">
              <Link href="/memberships" className="btn btn-primary shadow-sm" style={{ borderRadius: '50px', padding: '8px 24px', fontWeight: 600, background: '#00a4ef', border: 'none' }}>
                Join Now
              </Link>
            </div>
            {/* Mobile Join Now */}
            <div className="d-lg-none mt-3 pb-3">
              <Link href="/memberships" className="btn btn-primary w-100 shadow-sm" style={{ borderRadius: '50px', padding: '10px 24px', fontWeight: 600, background: '#00a4ef', border: 'none' }}>
                Join Now
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
