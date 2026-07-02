"use client";

import React, { useState, useEffect } from "react";
import { submitContactQuery } from "./actions";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [slideAway, setSlideAway] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id.replace("c_", "")]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await submitContactQuery(formData);

    if (result.success) {
      alert("Thank you for contacting us! Your message has been saved.");
      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } else {
      alert("Submission Error: " + (result.error || "Failed to send message."));
    }
    setLoading(false);
  };

  // Scroll and load-based sliding animation trigger
  useEffect(() => {
    // Trigger slide-away on page load after a short delay
    const loadTimer = setTimeout(() => {
      setSlideAway(true);
    }, 1000);

    // Scroll-based trigger
    const handleScroll = () => {
      const contactSection = document.querySelector(".contact-section") as HTMLElement | null;
      if (!contactSection) return;

      const sectionTop = contactSection.offsetTop;
      const sectionHeight = contactSection.offsetHeight;
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      if (scrollPosition > sectionTop && scrollPosition < sectionTop + sectionHeight) {
        setSlideAway(true);
      } else if (scrollPosition < sectionTop) {
        setSlideAway(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      clearTimeout(loadTimer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .spacer {
            height: 5vh;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            color: #666;
        }
        .contact-section {
            min-height: 550px;
            padding: 60px 0;
            position: relative;
            overflow: hidden;
            background: #fff;
        }
        .section-title {
            text-align: center;
            margin-bottom: 80px;
            color: #1e3a5f;
            font-size: 3rem;
            font-weight: 700;
        }
        .contact-container {
            position: relative;
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 15px;
            height: 500px;
        }
        .center-image-wrapper {
            position: relative;
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            z-index: 2;
        }
        .center-image {
            width: 100%;
            height: auto;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        .contact-info-box {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #1e3a5f;
            padding: 50px 40px;
            border-radius: 20px;
            box-shadow: 0 15px 50px rgba(0, 0, 0, 0.2);
            z-index: 3;
            width: 90%;
            max-width: 400px;
            transition: all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            height: 430px;
        }
        .contact-info-box.slide-away {
            left: 15%;
            transform: translate(-46%, -50%);
        }
        .contact-info-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 35px;
            color: white;
        }
        .contact-info-item:last-child {
            margin-bottom: 0;
        }
        .contact-icon {
            width: 50px;
            height: 50px;
            background: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 20px;
            flex-shrink: 0;
        }
        .contact-icon i {
            color: #1e3a5f;
            font-size: 1.3rem;
        }
        .contact-info-content h6 {
            font-size: 0.9rem;
            opacity: 0.8;
            margin-bottom: 5px;
            font-weight: 400;
        }
        .contact-info-content p {
            font-size: 1.1rem;
            font-weight: 600;
            margin: 0;
        }
        .contact-form-box {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 50px 40px;
            border-radius: 20px;
            box-shadow: 0 15px 50px rgba(0, 0, 0, 0.2);
            z-index: 3;
            width: 90%;
            max-width: 400px;
            transition: all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        .contact-form-box.slide-away {
            left: 85%;
            transform: translate(-50%, -50%);
        }
        .form-title {
            font-size: 1.6rem;
            color: #1e3a5f;
            margin-bottom: 25px;
            font-weight: 700;
        }
        .form-control {
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            padding: 12px;
            margin-bottom: 15px;
            font-size: 0.95rem;
            transition: border-color 0.3s;
        }
        .form-control:focus {
            border-color: #1e3a5f;
            box-shadow: 0 0 0 0.2rem rgba(30, 58, 95, 0.1);
        }
        textarea.form-control {
            min-height: 90px;
            resize: vertical;
        }
        .submit-btn {
            background: #1e3a5f;
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 10px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            width: 100%;
        }
        .submit-btn:hover {
            background: #000;
            transform: translateY(-2px);
            box-shadow: 0 5px 20px rgba(30, 58, 95, 0.3);
        }
        .map-title {
            text-align: center;
            margin-bottom: 50px;
            color: #1e3a5f;
            font-size: 2.5rem;
            font-weight: 700;
        }
        .map-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 15px;
        }
        .map-wrapper {
            position: relative;
            width: 100%;
            padding-bottom: 35%;
            height: 0;
            overflow: hidden;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
        }
        .map-wrapper iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: 0;
            border-radius: 20px;
        }
        .map-info-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 30px;
            margin-top: 50px;
            margin-bottom: 60px;
        }
        .map-info-card {
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            text-align: center;
            transition: transform 0.3s, box-shadow 0.3s;
        }
        .map-info-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
        }
        .map-info-card i {
            font-size: 2.5rem;
            color: #1e3a5f;
            margin-bottom: 15px;
        }
        .map-info-card h4 {
            font-size: 1.3rem;
            color: #1e3a5f;
            margin-bottom: 10px;
            font-weight: 600;
        }
        .map-info-card p {
            font-size: 1rem;
            color: #666;
            margin: 0;
            line-height: 1.6;
        }
        .clients-section {
            padding: 60px 0;
            background: white;
            overflow: hidden;
        }
        .clients-header {
            font-size: 2rem;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 40px;
            font-weight: 600;
            text-align: center;
        }
        .clients-slider {
            display: flex;
            align-items: center;
            gap: 80px;
            animation: scroll 30s linear infinite;
            width: max-content;
        }
        .client-logo {
            display: flex;
            align-items: center;
            gap: 12px;
            filter: grayscale(100%);
            opacity: 0.6;
            transition: all 0.3s;
            white-space: nowrap;
        }
        .client-logo:hover {
            filter: grayscale(0%);
            opacity: 1;
        }
        .client-name {
            font-size: 1.2rem;
            font-weight: 600;
            color: #2d3748;
        }
        @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
        .clients-container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 15px;
            text-align: center;
        }
        .clients-wrapper {
            overflow: hidden;
            position: relative;
        }
        .clients-wrapper::before,
        .clients-wrapper::after {
            content: '';
            position: absolute;
            top: 0;
            width: 100px;
            height: 100%;
            z-index: 2;
        }
        .clients-wrapper::before {
            left: 0;
            background: linear-gradient(to right, white, transparent);
        }
        .clients-wrapper::after {
            right: 0;
            background: linear-gradient(to left, white, transparent);
        }
        
        @media (max-width: 992px) {
            .contact-container {
                height: auto;
                display: flex;
                flex-direction: column;
                gap: 20px;
            }
            .contact-info-box,
            .contact-form-box {
                position: relative;
                left: 0 !important;
                top: 0 !important;
                transform: none !important;
                margin: 20px auto;
                width: 100%;
                max-width: 500px;
                height: auto;
            }
            .center-image-wrapper {
                margin: 20px auto;
                display: none;
            }
        }
      ` }} />

      {/* Page Header */}
      <section className="page-header-banner">
        <div className="container">
          <h1 className="page-header-title">Contact Us</h1>
        
        </div>
      </section>

      <div className="spacer"></div>

      {/* Contact Section */}
      <section className="contact-section">
        <h1 className="section-title">Contact Us</h1>
        
        <div className="contact-container">
          {/* Center Image */}
          <div className="center-image-wrapper">
            <img src="/contact.jpg" alt="Happy Couple" className="center-image" />
          </div>
          
          {/* Contact Info Box */}
          <div className={`contact-info-box ${slideAway ? "slide-away" : ""}`} id="contactInfo">
            <div className="contact-info-item">
              <div className="contact-icon"><i className="fas fa-phone"></i></div>
              <div className="contact-info-content">
                <h6>Call Us 24/7</h6>
                <p>+91 9003948500</p>
              </div>
            </div>
            
            <div className="contact-info-item">
              <div className="contact-icon"><i className="fas fa-envelope"></i></div>
              <div className="contact-info-content">
                <h6>Work with us</h6>
                <p>zone18jcom@gmail.com</p>
              </div>
            </div>
            
            <div className="contact-info-item">
              <div className="contact-icon"><i className="fas fa-map-marker-alt"></i></div>
              <div className="contact-info-content">
                <h6>Your location</h6>
                <p>JCOM Headquarters, India</p>
              </div>
            </div>
          </div>
          
          {/* Contact Form Box */}
          <div className={`contact-form-box ${slideAway ? "slide-away" : ""}`} id="contactForm">
            <h2 className="form-title">Get In Touch</h2>
            <form id="contactFormElement" onSubmit={handleSubmit}>
              <input type="text" id="c_name" className="form-control" placeholder="Your Name" required value={formData.name} onChange={handleChange} />
              <input type="email" id="c_email" className="form-control" placeholder="info@gmail.com" required value={formData.email} onChange={handleChange} />
              <textarea id="c_message" className="form-control" placeholder="Message" required value={formData.message} onChange={handleChange}></textarea>
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span> Sending...
                  </>
                ) : (
                  "Get in Touch"
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="map-section">
        <h2 className="map-title">Find Us Here</h2>
        
        <div className="map-container">
          <div className="map-wrapper">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31510.601388558593!2d77.85203909569803!3d9.170238217383107!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b06b26570998f29%3A0xd95cda8fab23619b!2sKovilpatti%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1769083403909!5m2!1sen!2sin" 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade">
            </iframe>
          </div>
          
          <div className="map-info-cards">
            <div className="map-info-card">
              <i className="bi bi-geo-alt-fill"></i>
              <h4>Office Address</h4>
              <p>JCOM Zone 18 Headquarters,<br />Tamil Nadu, India</p>
            </div>
            <div className="map-info-card">
              <i className="bi bi-envelope-fill"></i>
              <h4>Email Support</h4>
              <p>zone18jcom@gmail.com</p>
            </div>
            <div className="map-info-card">
              <i className="bi bi-telephone-fill"></i>
              <h4>Phone Number</h4>
              <p>+91 9003948500<br />Mon-Sat: 9am - 6pm</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Clients Section */}
      <section className="clients-section">
        <div className="clients-container">
          <h3 className="clients-header">OUR TRUSTED CLIENTS</h3>
          
          <div className="clients-wrapper">
            <div className="clients-slider"
              onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = "paused")}
              onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = "running")}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => {
                const names = ["Toy Jesh", "waleon", "calsa", "Contex", "Toy Jesh", "sefrov"];
                const name = names[(num - 1) % names.length];
                return (
                  <div className="client-logo" key={num}>
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {num % 3 === 0 && <circle cx="20" cy="20" r="14" fill="none" stroke="#4A5568" strokeWidth="2"/>}
                      {num % 3 === 0 && <path d="M20 6V20L28 28" stroke="#4A5568" strokeWidth="2" strokeLinecap="round"/>}
                      {num % 3 === 1 && <path d="M10 20C10 14.477 14.477 10 20 10C22.5 10 24.5 11 26 12.5L30 8.5C27 5.5 23.5 4 20 4C11.163 4 4 11.163 4 20C4 28.837 11.163 36 20 36C28.837 36 36 28.837 36 20H10Z" fill="#4A5568"/>}
                      {num % 3 === 2 && <circle cx="15" cy="20" r="10" fill="none" stroke="#4A5568" strokeWidth="2"/>}
                      {num % 3 === 2 && <circle cx="25" cy="20" r="10" fill="none" stroke="#4A5568" strokeWidth="2"/>}
                    </svg>
                    <span className="client-name">{name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
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

      <div className="spacer"></div>
    </>
  );
}
