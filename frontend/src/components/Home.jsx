import React, { useState } from 'react';

export default function Home({ publicAlumni, page, setPage, token, handleLogout, sendConnectionRequest }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [connectingId, setConnectingId] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  // Extract unique companies
  const uniqueCompanies = [
    ...new Set(publicAlumni.map(a => a.company).filter(Boolean))
  ];

  // Filter alumni
  const filteredAlumni = publicAlumni.filter(a => {
    const term = searchTerm.toLowerCase();

    const matchesSearch =
      (a.name && a.name.toLowerCase().includes(term)) ||
      (a.company && a.company.toLowerCase().includes(term)) ||
      (a.jobTitle && a.jobTitle.toLowerCase().includes(term));

    const matchesCompany = selectedCompany
      ? a.company === selectedCompany
      : true;

    return matchesSearch && matchesCompany;
  });

  const isSearching =
    searchTerm.trim() !== '' || selectedCompany !== '';

  const displayedAlumni = isSearching
    ? filteredAlumni
    : publicAlumni.slice(0, 6);

  const handleConnect = async (id) => {
    if (connectingId) return;
    setConnectingId(id);
    try {
      await sendConnectionRequest(id);
    } finally {
      setTimeout(() => setConnectingId(null), 600);
    }
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "What is Alumni Student Mentorship?",
      a: "It's an institutional platform bridging current students with experienced alumni mentors to provide career guidance, technical mentorship, and professional networking."
    },
    {
      q: "Who can become a mentor?",
      a: "Verified alumni of our institution who are currently working across diverse industry domains and want to support the next generation."
    },
    {
      q: "How do students contact alumni?",
      a: "Students can search for mentors by name, role, or company, and send a direct connection request with a personalized message."
    },
    {
      q: "Can alumni choose which students to mentor?",
      a: "Yes! Alumni have complete control over their mentorship capacity and can accept or decline connection requests from their dashboard."
    },
    {
      q: "Is mentorship free?",
      a: "Absolutely. This is a community initiative designed to give back to the institution and support student growth at zero cost."
    },
    {
      q: "How are alumni profiles verified?",
      a: "All alumni profiles undergo administrative review and approval before becoming active on the public mentor directory."
    }
  ];

  return (
    <>
      <style>{`
        :root {
          --ac-purple: #7b2cbf;
          --ac-purple-dark: #5a189a;
          --ac-orange: #ff742f;
          --ac-yellow: #ffc800;
          --ac-black: #171717;
          --ac-white: #ffffff;
          --ac-bg: #f6f5f7;
          --ac-text: #181818;
          --ac-muted: #666;
        }

        * {
          box-sizing: border-box;
        }

        body {
          background: var(--ac-bg);
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          margin: 0;
          -webkit-font-smoothing: antialiased;
        }

        .ac-home {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 12% 8%,
              rgba(123, 44, 191, 0.08),
              transparent 30%
            ),
            radial-gradient(
              circle at 88% 25%,
              rgba(255, 200, 0, 0.09),
              transparent 28%
            ),
            var(--ac-bg);
          overflow-x: hidden;
          position: relative;
        }

        /* ==============================
            NAVBAR — PREMIUM PRODUCT UX
        ============================== */

        .ac-navbar {
          background: rgba(255, 255, 255, 0.82);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          padding: 16px 7%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 1000;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .ac-nav-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          font-weight: 850;
          font-size: 17px;
          color: var(--ac-black);
          letter-spacing: -0.4px;
          cursor: pointer;
          transition: opacity 0.2s ease;
        }

        .ac-nav-brand:hover {
          opacity: 0.85;
        }

        .ac-brand-badge {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, var(--ac-purple), var(--ac-orange));
          border-radius: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 16px;
          font-weight: 900;
          box-shadow: 0 6px 16px rgba(123, 44, 191, 0.28);
          flex-shrink: 0;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .ac-nav-brand:hover .ac-brand-badge {
          transform: scale(1.06) rotate(-3deg);
        }

        .ac-nav-links {
          display: flex;
          align-items: center;
          gap: 32px;
        }

        .ac-nav-link {
          text-decoration: none;
          color: var(--ac-muted);
          font-size: 14px;
          font-weight: 600;
          background: none;
          border: none;
          cursor: pointer;
          transition: color 0.2s ease;
          padding: 4px 0;
          position: relative;
        }

        .ac-nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--ac-purple);
          transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          border-radius: 2px;
        }

        .ac-nav-link:hover {
          color: var(--ac-black);
        }

        .ac-nav-link:hover::after {
          width: 100%;
        }

        .ac-nav-auth-actions {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .ac-nav-btn-login {
          text-decoration: none;
          color: var(--ac-black);
          font-size: 14px;
          font-weight: 700;
          padding: 9px 18px;
          background: transparent;
          border: 1.5px solid #e2e2e5;
          border-radius: 11px;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .ac-nav-btn-login:hover {
          border-color: var(--ac-purple);
          color: var(--ac-purple);
          background: rgba(123, 44, 191, 0.03);
          transform: translateY(-1px);
        }

        .ac-nav-btn-register {
          text-decoration: none;
          background: var(--ac-black);
          color: white;
          font-size: 14px;
          font-weight: 700;
          padding: 10px 22px;
          border: none;
          border-radius: 11px;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 14px rgba(23, 23, 23, 0.18);
        }

        .ac-nav-btn-register:hover {
          background: var(--ac-purple);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(123, 44, 191, 0.35);
        }

        .ac-mobile-toggle {
          display: none;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: var(--ac-black);
        }

        .ac-mobile-menu {
          display: none;
          flex-direction: column;
          gap: 16px;
          background: white;
          padding: 22px 28px;
          border-bottom: 1px solid rgba(0,0,0,0.06);
          box-shadow: 0 14px 30px rgba(0,0,0,0.06);
          position: sticky;
          top: 73px;
          z-index: 999;
          animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .ac-mobile-menu.open {
          display: flex;
        }

        /* ==============================
            HERO — CINEMATIC LIVING ENVIRONMENT
        ============================== */

        .ac-hero {
          position: relative;
          min-height: 580px;
          margin: 0 0 60px;
          padding: 90px 7% 70px;
          background: var(--ac-white);
          overflow: hidden;
          display: flex;
          align-items: center;
          isolation: isolate;
          border-bottom: 1px solid rgba(0,0,0,0.04);
          box-shadow: 0 10px 40px rgba(0,0,0,0.015);
        }

        .ac-hero-content {
          position: relative;
          z-index: 5;
          max-width: 680px;
          animation: fadeSlideIn 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .ac-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 8px 16px;
          border-radius: 50px;
          background: rgba(123, 44, 191, 0.08);
          border: 1px solid rgba(123, 44, 191, 0.14);
          color: var(--ac-purple);
          font-size: 12px;
          font-weight: 750;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          margin-bottom: 24px;
          backdrop-filter: blur(4px);
          animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .ac-eyebrow-dot {
          width: 7px;
          height: 7px;
          background: var(--ac-orange);
          border-radius: 50%;
          animation: pulseDot 2s infinite ease-in-out;
          box-shadow: 0 0 10px rgba(255, 116, 47, 0.6);
        }

        .ac-title {
          font-size: clamp(44px, 6vw, 76px);
          line-height: 0.98;
          letter-spacing: -2.5px;
          font-weight: 900;
          color: var(--ac-black);
          margin: 0 0 24px;
          animation: fadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .ac-title-purple {
          color: var(--ac-purple);
          position: relative;
        }

        .ac-title-orange {
          color: var(--ac-orange);
        }

        .ac-description {
          max-width: 560px;
          font-size: 17px;
          line-height: 1.75;
          color: #555;
          margin-bottom: 34px;
          animation: fadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          font-weight: 450;
        }

        .ac-hero-button {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 16px 28px;
          background: var(--ac-black);
          color: white;
          border: none;
          border-radius: 14px;
          font-size: 15px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          animation: fadeUp 1.1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          position: relative;
          overflow: hidden;
          box-shadow: 0 6px 20px rgba(23, 23, 23, 0.18);
        }

        .ac-hero-button::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transform: translateX(-100%);
          transition: transform 0.6s ease;
        }

        .ac-hero-button:hover {
          background: var(--ac-purple);
          color: white;
          transform: translateY(-4px);
          box-shadow: 0 16px 35px rgba(123, 44, 191, 0.3);
        }

        .ac-hero-button:hover::after {
          transform: translateX(100%);
        }

        .ac-arrow {
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .ac-hero-button:hover .ac-arrow {
          transform: translateX(6px);
        }

        /* Living Hero Artwork & Floating Depth */
        .ac-hero-art {
          position: absolute;
          right: 4%;
          bottom: 0;
          width: 520px;
          height: 520px;
          pointer-events: none;
          z-index: 2;
        }

        .ac-art-shape {
          position: absolute;
          will-change: transform;
          filter: drop-shadow(0 12px 24px rgba(0,0,0,0.1));
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .ac-art-purple {
          width: 200px;
          height: 290px;
          background: var(--ac-purple);
          right: 190px;
          bottom: 0;
          clip-path: polygon(0 22%, 100% 0, 100% 100%, 0 100%);
          animation: floatShape 6s ease-in-out infinite, breathePurple 8s ease-in-out infinite;
        }

        .ac-art-orange {
          width: 230px;
          height: 180px;
          background: var(--ac-orange);
          right: 275px;
          bottom: 0;
          border-radius: 120px 120px 0 0;
          animation: floatShape 5s ease-in-out infinite, breatheOrange 7s ease-in-out infinite;
        }

        .ac-art-black {
          width: 110px;
          height: 260px;
          background: var(--ac-black);
          right: 125px;
          bottom: 0;
          border-radius: 14px 14px 0 0;
          animation: floatShape 5.5s ease-in-out infinite, breatheBlack 9s ease-in-out infinite;
        }

        .ac-art-yellow {
          width: 160px;
          height: 275px;
          background: var(--ac-yellow);
          right: 0;
          bottom: 0;
          border-radius: 100px 100px 0 0;
          animation: floatShape 6.5s ease-in-out infinite, breatheYellow 8.5s ease-in-out infinite;
        }

        .ac-face {
          position: absolute;
          width: 13px;
          height: 13px;
          background: var(--ac-black);
          border-radius: 50%;
          z-index: 4;
          animation: blink 4.5s infinite;
          transform-origin: center;
        }

        .face-purple-1 { right: 305px; bottom: 220px; }
        .face-purple-2 { right: 250px; bottom: 220px; }
        .face-orange { right: 435px; bottom: 95px; }
        .face-black { right: 190px; bottom: 190px; }
        .face-yellow-1 { right: 98px; bottom: 205px; }
        .face-yellow-2 { right: 50px; bottom: 205px; }

        .ac-floating {
          position: absolute;
          border-radius: 50%;
          z-index: 3;
          will-change: transform;
        }

        .ac-floating-one {
          width: 55px; height: 55px; right: 375px; top: 75px;
          background: var(--ac-yellow);
          animation: orbitOne 7.5s ease-in-out infinite, glowYellow 3.5s ease-in-out infinite;
        }

        .ac-floating-two {
          width: 36px; height: 36px; right: 90px; top: 100px;
          background: var(--ac-orange);
          animation: orbitTwo 6.5s ease-in-out infinite, glowOrange 4s ease-in-out infinite;
        }

        .ac-floating-three {
          width: 24px; height: 24px; right: 185px; top: 45px;
          background: var(--ac-purple);
          animation: orbitThree 5.5s ease-in-out infinite, glowPurple 4.5s ease-in-out infinite;
        }

        /* ==============================
            MAIN SECTION & SEARCH
        ============================== */

        .ac-main {
          max-width: 1280px;
          margin: auto;
          padding: 0 25px 90px;
        }

        .ac-search-section {
          background: white;
          padding: 32px;
          border-radius: 26px;
          box-shadow: 0 16px 50px rgba(0, 0, 0, 0.05);
          margin-bottom: 50px;
          border: 1px solid rgba(0, 0, 0, 0.04);
          position: relative;
          z-index: 10;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .ac-search-section:hover {
          box-shadow: 0 22px 65px rgba(123, 44, 191, 0.08);
          transform: translateY(-2px);
          border-color: rgba(123, 44, 191, 0.12);
        }

        .ac-search-title {
          font-size: 17px;
          font-weight: 800;
          color: var(--ac-black);
          margin-bottom: 16px;
          letter-spacing: -0.3px;
        }

        .ac-search-row {
          display: grid;
          grid-template-columns: 1fr 280px;
          gap: 16px;
        }

        .ac-input,
        .ac-select {
          height: 56px !important;
          border: 2px solid #eaeaea !important;
          border-radius: 14px !important;
          padding: 0 20px !important;
          font-size: 15px !important;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
          box-shadow: none !important;
          outline: none !important;
          background: #fff;
          color: var(--ac-black);
          font-weight: 500;
        }

        .ac-input:focus,
        .ac-select:focus {
          border-color: var(--ac-purple) !important;
          box-shadow: 0 0 0 4px rgba(123, 44, 191, 0.1) !important;
          background: #fff;
        }

        .ac-input::placeholder {
          color: #aaa;
        }

        .ac-section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 30px;
        }

        .ac-section-heading {
          margin: 0;
          font-size: 32px;
          font-weight: 900;
          color: var(--ac-black);
          letter-spacing: -1.2px;
        }

        .ac-section-heading span {
          color: var(--ac-purple);
        }

        .ac-count {
          color: #666;
          font-size: 13px;
          font-weight: 600;
          background: rgba(123,44,191,0.06);
          border: 1px solid rgba(123,44,191,0.1);
          padding: 7px 14px;
          border-radius: 999px;
        }

        /* ==============================
            ALUMNI CARDS — ULTRA-PREMIUM TREATMENT
        ============================== */

        .ac-card {
          position: relative;
          height: 100%;
          background: white;
          border-radius: 26px;
          padding: 30px;
          overflow: hidden;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.05);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          border: 1px solid rgba(0,0,0,0.04);
          display: flex;
          flex-direction: column;
        }

        .ac-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, var(--ac-purple), var(--ac-orange), var(--ac-yellow));
        }

        .ac-card:hover {
          transform: translateY(-8px) scale(1.01);
          box-shadow: 0 24px 60px rgba(123, 44, 191, 0.15);
          border-color: rgba(123,44,191,0.2);
        }

        .ac-profile-wrapper {
          display: flex;
          justify-content: center;
          margin: 6px 0 20px;
        }

        .ac-profile {
          width: 98px;
          height: 98px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid white;
          box-shadow: 0 0 0 3px rgba(123, 44, 191, 0.12), 0 12px 28px rgba(0, 0, 0, 0.1);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease;
        }

        .ac-card:hover .ac-profile {
          transform: scale(1.06) rotate(-2deg);
          box-shadow: 0 0 0 4px rgba(123, 44, 191, 0.22), 0 16px 32px rgba(0, 0, 0, 0.14);
        }

        .ac-avatar {
          width: 98px;
          height: 98px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--ac-purple), var(--ac-purple-dark));
          color: white;
          font-size: 34px;
          font-weight: 850;
          box-shadow: 0 0 0 4px rgba(123, 44, 191, 0.12), 0 12px 28px rgba(0, 0, 0, 0.1);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease;
        }

        .ac-card:hover .ac-avatar {
          transform: scale(1.06) rotate(2deg);
          box-shadow: 0 0 0 5px rgba(123, 44, 191, 0.22), 0 16px 32px rgba(0, 0, 0, 0.14);
        }

        .ac-name {
          font-size: 20px;
          font-weight: 850;
          color: var(--ac-black);
          margin-bottom: 4px;
          transition: color 0.25s ease;
          letter-spacing: -0.3px;
        }

        .ac-card:hover .ac-name {
          color: var(--ac-purple);
        }

        .ac-email {
          color: #777;
          font-size: 12.5px;
          margin-bottom: 22px;
          word-break: break-word;
          font-weight: 500;
        }

        .ac-info {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 10px;
          font-size: 14px;
          color: #555;
        }

        .ac-info-icon {
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9px;
          background: rgba(123, 44, 191, 0.07);
          color: var(--ac-purple);
          font-size: 13px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          flex-shrink: 0;
        }

        .ac-card:hover .ac-info-icon {
          transform: scale(1.1) rotate(6deg);
          background: rgba(123, 44, 191, 0.14);
        }

        .ac-info strong {
          color: var(--ac-black);
          font-weight: 700;
        }

        .ac-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin: 16px 0 20px;
          padding: 7px 14px;
          background: rgba(255, 200, 0, 0.14);
          border: 1px solid rgba(255, 200, 0, 0.25);
          color: #8c6a00;
          border-radius: 50px;
          font-size: 11.5px;
          font-weight: 800;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .ac-card:hover .ac-badge {
          transform: scale(1.04);
          background: rgba(255, 200, 0, 0.22);
        }

        .ac-badge-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #f0b900;
          box-shadow: 0 0 8px rgba(240, 185, 0, 0.8);
          animation: pulseDot 2.2s infinite ease-in-out;
        }

        .ac-connect {
          width: 100%;
          height: 50px;
          border: none;
          border-radius: 13px;
          background: var(--ac-black);
          color: white;
          font-weight: 750;
          font-size: 14px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
          margin-top: auto;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(23, 23, 23, 0.15);
        }

        .ac-connect::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transform: translateX(-100%);
          transition: transform 0.5s ease;
        }

        .ac-connect:hover:not(:disabled) {
          background: var(--ac-purple);
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(123, 44, 191, 0.3);
        }

        .ac-connect:hover:not(:disabled)::after {
          transform: translateX(100%);
        }

        .ac-connect:active:not(:disabled) {
          transform: translateY(0) scale(0.98);
        }

        .ac-connect:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .ac-connect-loading {
          display: inline-block;
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          margin-right: 8px;
          vertical-align: middle;
        }

        /* ==============================
            NEW PLATFORM SECTIONS STYLING
        ============================== */

        .ac-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 80px;
        }

        .ac-stat-card {
          background: white;
          padding: 30px 20px;
          border-radius: 20px;
          text-align: center;
          border: 1px solid rgba(0,0,0,0.04);
          box-shadow: 0 8px 30px rgba(0,0,0,0.03);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .ac-stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 14px 40px rgba(123,44,191,0.08);
          border-color: rgba(123,44,191,0.15);
        }

        .ac-stat-number {
          font-size: 36px;
          font-weight: 900;
          color: var(--ac-purple);
          margin-bottom: 6px;
          letter-spacing: -1px;
        }

        .ac-stat-label {
          font-size: 14px;
          font-weight: 600;
          color: var(--ac-muted);
        }

        /* How It Works & Steps */
        .ac-how-container {
          background: white;
          border-radius: 30px;
          padding: 50px 40px;
          margin-bottom: 80px;
          border: 1px solid rgba(0,0,0,0.04);
          box-shadow: 0 16px 50px rgba(0,0,0,0.04);
        }

        .ac-steps-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 40px;
          margin-top: 30px;
        }

        .ac-step-track {
          background: var(--ac-bg);
          padding: 24px;
          border-radius: 20px;
          border: 1px solid rgba(0,0,0,0.03);
        }

        .ac-step-track h4 {
          font-size: 18px;
          font-weight: 850;
          color: var(--ac-black);
          margin-bottom: 16px;
        }

        .ac-step-flow {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
        }

        .ac-step-pill {
          background: white;
          padding: 8px 14px;
          border-radius: 10px;
          font-size: 12.5px;
          font-weight: 700;
          color: var(--ac-black);
          box-shadow: 0 4px 12px rgba(0,0,0,0.04);
          border: 1px solid rgba(0,0,0,0.04);
        }

        .ac-step-arrow {
          color: var(--ac-purple);
          font-weight: 900;
        }

        /* Journey Timeline */
        .ac-journey-section {
          background: linear-gradient(135deg, var(--ac-black), #2a1b4e);
          color: white;
          border-radius: 30px;
          padding: 60px 40px;
          margin-bottom: 80px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .ac-journey-grid {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 40px;
          position: relative;
          gap: 15px;
        }

        .ac-journey-step {
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.12);
          padding: 24px 16px;
          border-radius: 18px;
          flex: 1;
          transition: transform 0.3s ease;
        }

        .ac-journey-step:hover {
          transform: translateY(-5px);
          background: rgba(255,255,255,0.12);
        }

        .ac-journey-icon {
          font-size: 28px;
          margin-bottom: 12px;
        }

        .ac-journey-title {
          font-size: 15px;
          font-weight: 800;
          color: white;
        }

        /* Mentorship Categories Grid */
        .ac-categories-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 80px;
        }

        .ac-category-card {
          background: white;
          padding: 28px 22px;
          border-radius: 20px;
          border: 1px solid rgba(0,0,0,0.04);
          box-shadow: 0 8px 30px rgba(0,0,0,0.03);
          transition: all 0.3s ease;
        }

        .ac-category-card:hover {
          transform: translateY(-5px);
          border-color: rgba(123,44,191,0.2);
          box-shadow: 0 14px 40px rgba(123,44,191,0.1);
        }

        .ac-category-icon {
          font-size: 32px;
          margin-bottom: 14px;
        }

        .ac-category-name {
          font-size: 16px;
          font-weight: 800;
          color: var(--ac-black);
          margin-bottom: 6px;
        }

        .ac-category-desc {
          font-size: 13px;
          color: var(--ac-muted);
          line-height: 1.5;
        }

        /* Why Join Us & Mentor Help Cards */
        .ac-why-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 30px;
          margin-bottom: 80px;
        }

        .ac-why-box {
          background: white;
          border-radius: 26px;
          padding: 36px;
          border: 1px solid rgba(0,0,0,0.04);
          box-shadow: 0 12px 40px rgba(0,0,0,0.03);
        }

        .ac-why-box h3 {
          font-size: 22px;
          font-weight: 850;
          color: var(--ac-black);
          margin-bottom: 20px;
        }

        .ac-why-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .ac-why-list li {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 15px;
          font-weight: 600;
          color: #444;
        }

        .ac-why-check {
          width: 22px;
          height: 22px;
          background: rgba(123,44,191,0.1);
          color: var(--ac-purple);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 900;
          flex-shrink: 0;
        }

        /* Success Stories */
        .ac-stories-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-bottom: 80px;
        }

        .ac-story-card {
          background: white;
          border-radius: 24px;
          padding: 30px;
          border: 1px solid rgba(0,0,0,0.04);
          box-shadow: 0 10px 35px rgba(0,0,0,0.03);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .ac-story-text {
          font-size: 15px;
          color: #444;
          line-height: 1.7;
          margin-bottom: 24px;
          font-style: italic;
        }

        .ac-story-author {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .ac-story-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--ac-purple), var(--ac-orange));
          color: white;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }

        .ac-story-info h5 {
          font-size: 15px;
          font-weight: 800;
          color: var(--ac-black);
          margin: 0 0 2px;
        }

        .ac-story-info p {
          font-size: 12.5px;
          color: var(--ac-muted);
          margin: 0;
          font-weight: 600;
        }

        /* FAQ Section */
        .ac-faq-container {
          max-width: 800px;
          margin: 0 auto 80px;
        }

        .ac-faq-item {
          background: white;
          border-radius: 16px;
          margin-bottom: 14px;
          border: 1px solid rgba(0,0,0,0.04);
          box-shadow: 0 6px 20px rgba(0,0,0,0.02);
          overflow: hidden;
          transition: border-color 0.2s ease;
        }

        .ac-faq-item.active {
          border-color: rgba(123,44,191,0.25);
        }

        .ac-faq-question {
          width: 100%;
          padding: 20px 24px;
          background: none;
          border: none;
          text-align: left;
          font-size: 16px;
          font-weight: 800;
          color: var(--ac-black);
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
        }

        .ac-faq-answer {
          padding: 0 24px 20px;
          font-size: 14.5px;
          color: #555;
          line-height: 1.7;
          margin: 0;
        }

        /* Final CTA Banner */
        .ac-cta-banner {
          background: linear-gradient(135deg, var(--ac-purple), var(--ac-purple-dark));
          border-radius: 30px;
          padding: 60px 40px;
          text-align: center;
          color: white;
          margin-bottom: 80px;
          box-shadow: 0 20px 60px rgba(123,44,191,0.25);
          position: relative;
          overflow: hidden;
        }

        .ac-cta-banner h2 {
          font-size: clamp(28px, 4vw, 42px);
          font-weight: 900;
          margin-bottom: 16px;
          letter-spacing: -1px;
        }

        .ac-cta-banner p {
          font-size: 17px;
          max-width: 600px;
          margin: 0 auto 30px;
          opacity: 0.9;
          line-height: 1.6;
        }

        .ac-cta-actions {
          display: flex;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .ac-cta-btn-primary {
          background: white;
          color: var(--ac-purple);
          padding: 15px 30px;
          border-radius: 14px;
          font-weight: 800;
          font-size: 15px;
          border: none;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        }

        .ac-cta-btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.25);
        }

        .ac-cta-btn-secondary {
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(10px);
          color: white;
          padding: 15px 30px;
          border-radius: 14px;
          font-weight: 800;
          font-size: 15px;
          border: 1px solid rgba(255,255,255,0.3);
          cursor: pointer;
          transition: transform 0.3s ease, background 0.3s ease;
        }

        .ac-cta-btn-secondary:hover {
          transform: translateY(-3px);
          background: rgba(255,255,255,0.25);
        }

        /* 4-Column Professional Footer */
        .ac-footer {
          background: white;
          border-top: 1px solid rgba(0,0,0,0.06);
          padding: 70px 7% 30px;
        }

        .ac-footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 40px;
          margin-bottom: 50px;
        }

        .ac-footer-col h5 {
          font-size: 16px;
          font-weight: 850;
          color: var(--ac-black);
          margin-bottom: 20px;
          letter-spacing: -0.3px;
        }

        .ac-footer-col p {
          font-size: 14px;
          color: var(--ac-muted);
          line-height: 1.7;
          margin-top: 12px;
        }

        .ac-footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .ac-footer-links a {
          text-decoration: none;
          color: var(--ac-muted);
          font-size: 14px;
          font-weight: 600;
          transition: color 0.2s ease;
        }

        .ac-footer-links a:hover {
          color: var(--ac-purple);
        }

        .ac-footer-bottom {
          border-top: 1px solid rgba(0,0,0,0.06);
          padding-top: 25px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13.5px;
          color: var(--ac-muted);
          font-weight: 500;
        }

        /* ==============================
            KEYFRAME ANIMATIONS
        ============================== */

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes floatShape {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }

        @keyframes pulseDot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.6; }
        }

        @keyframes blink {
          0%, 44%, 56%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.1); }
        }

        @keyframes orbitOne {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-24px, 24px) rotate(180deg); }
        }

        @keyframes orbitTwo {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -24px); }
        }

        @keyframes orbitThree {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-16px, 24px); }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes breathePurple {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 10px 18px rgba(123,44,191,0.22)); }
          50% { transform: scale(1.02); filter: drop-shadow(0 14px 22px rgba(123,44,191,0.32)); }
        }

        @keyframes breatheOrange {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 10px 18px rgba(255,116,47,0.22)); }
          50% { transform: scale(1.02); filter: drop-shadow(0 14px 22px rgba(255,116,47,0.32)); }
        }

        @keyframes breatheBlack {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 10px 18px rgba(23,23,23,0.22)); }
          50% { transform: scale(1.02); filter: drop-shadow(0 14px 22px rgba(23,23,23,0.32)); }
        }

        @keyframes breatheYellow {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 10px 18px rgba(255,200,0,0.22)); }
          50% { transform: scale(1.02); filter: drop-shadow(0 14px 22px rgba(255,200,0,0.32)); }
        }

        @keyframes glowPurple {
          0%, 100% { box-shadow: 0 0 0 rgba(123,44,191,0); }
          50% { box-shadow: 0 0 20px rgba(123,44,191,0.5); }
        }

        @keyframes glowOrange {
          0%, 100% { box-shadow: 0 0 0 rgba(255,116,47,0); }
          50% { box-shadow: 0 0 20px rgba(255,116,47,0.5); }
        }

        @keyframes glowYellow {
          0%, 100% { box-shadow: 0 0 0 rgba(255,200,0,0); }
          50% { box-shadow: 0 0 20px rgba(255,200,0,0.5); }
        }

        /* ==============================
            RESPONSIVE ADAPTATIONS
        ============================== */

        @media (max-width: 1100px) {
          .ac-hero { padding: 70px 6%; }
          .ac-hero-art { opacity: 0.28; right: -80px; }
          .ac-hero-content { max-width: 720px; }
          .ac-stats-grid, .ac-categories-grid { grid-template-columns: repeat(2, 1fr); }
          .ac-footer-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 900px) {
          .ac-search-row { grid-template-columns: 1fr; }
          .ac-steps-grid, .ac-why-grid, .ac-stories-grid, .ac-journey-grid { grid-template-columns: 1fr; }
          .ac-journey-grid { flex-direction: column; }
        }

        @media (max-width: 768px) {
          .ac-nav-links, .ac-nav-auth-actions { display: none; }
          .ac-mobile-toggle { display: block; }
          .ac-hero { min-height: 600px; padding: 50px 22px 35px; }
          .ac-title { letter-spacing: -2px; }
          .ac-hero-art { right: -140px; bottom: -40px; transform: scale(0.85); opacity: 0.2; }
          .ac-section-header { align-items: flex-start; flex-direction: column; gap: 12px; }
          .ac-main { padding-left: 18px; padding-right: 18px; }
          .ac-search-section { padding: 22px; }
          .ac-stats-grid, .ac-categories-grid { grid-template-columns: 1fr; }
          .ac-footer-grid { grid-template-columns: 1fr; gap: 30px; }
          .ac-footer-bottom { flex-direction: column; gap: 10px; text-align: center; }
        }

        @media (max-width: 480px) {
          .ac-title { font-size: 42px; }
          .ac-description { font-size: 16px; }
          .ac-hero { min-height: 560px; }
          .ac-search-section { padding: 18px; }
          .ac-section-heading { font-size: 26px; }
        }
      `}</style>

      <div className="ac-home">
        {/* ======================================
            NAVIGATION BAR
        ====================================== */}
        <nav className="ac-navbar">
          <a className="ac-nav-brand" onClick={() => setPage('home')}>
            <div className="ac-brand-badge">A</div>
            Alumni Student Mentorship
          </a>

          <div className="ac-nav-links">
            <button className="ac-nav-link" onClick={() => setPage('home')}>Home</button>
            <a href="#how-it-works" className="ac-nav-link">How It Works</a>
            <a href="#categories" className="ac-nav-link">Categories</a>
            <a href="#mentors" className="ac-nav-link">Mentors</a>
            <a href="#faq" className="ac-nav-link">FAQ</a>
          </div>

          <div className="ac-nav-auth-actions">
            {token ? (
              <>
                <button className="ac-nav-btn-login" onClick={() => setPage('dashboard')}>Dashboard</button>
                <button className="ac-nav-btn-register" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <button className="ac-nav-btn-login" onClick={() => setPage('login')}>Login</button>
                <button className="ac-nav-btn-register" onClick={() => setPage('register')}>Register</button>
              </>
            )}
          </div>

          <button 
            className="ac-mobile-toggle" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </nav>

        {/* Mobile Dropdown Menu */}
        <div className={`ac-mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <button className="ac-nav-link text-start" onClick={() => { setPage('home'); setMobileMenuOpen(false); }}>Home</button>
          <a href="#how-it-works" className="ac-nav-link text-start" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
          <a href="#categories" className="ac-nav-link text-start" onClick={() => setMobileMenuOpen(false)}>Categories</a>
          <a href="#mentors" className="ac-nav-link text-start" onClick={() => setMobileMenuOpen(false)}>Mentors</a>
          <a href="#faq" className="ac-nav-link text-start" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
          {token ? (
            <>
              <button className="ac-nav-btn-login w-100" onClick={() => { setPage('dashboard'); setMobileMenuOpen(false); }}>Dashboard</button>
              <button className="ac-nav-btn-register w-100 text-center" onClick={() => { handleLogout(); setMobileMenuOpen(false); }}>Logout</button>
            </>
          ) : (
            <>
              <button className="ac-nav-btn-login w-100" onClick={() => { setPage('login'); setMobileMenuOpen(false); }}>Login</button>
              <button className="ac-nav-btn-register w-100 text-center" onClick={() => { setPage('register'); setMobileMenuOpen(false); }}>Register</button>
            </>
          )}
        </div>

        {/* ======================================
            HERO SECTION
        ====================================== */}
        <section className="ac-hero">
          <div className="ac-hero-content">
            <div className="ac-eyebrow">
              <span className="ac-eyebrow-dot"></span>
              ALUMNI • STUDENT CONNECTION
            </div>

            <h1 className="ac-title">
              Connect.
              <br />
              Learn.
              <br />
              <span className="ac-title-purple">Grow</span>
              <span className="ac-title-orange">.</span>
            </h1>

            <p className="ac-description">
              Connect with experienced alumni mentors, discover career
              opportunities, and get guidance from people who have already
              walked the path you’re about to take.
            </p>

            <a href="#mentors" className="ac-hero-button">
              Explore Alumni
              <span className="ac-arrow">→</span>
            </a>
          </div>

          <div className="ac-hero-art">
            <div className="ac-floating ac-floating-one"></div>
            <div className="ac-floating ac-floating-two"></div>
            <div className="ac-floating ac-floating-three"></div>

            <div className="ac-art-shape ac-art-orange"></div>
            <div className="ac-art-shape ac-art-purple"></div>
            <div className="ac-art-shape ac-art-black"></div>
            <div className="ac-art-shape ac-art-yellow"></div>

            <div className="ac-face face-orange"></div>
            <div className="ac-face face-purple-1"></div>
            <div className="ac-face face-purple-2"></div>
            <div className="ac-face face-black"></div>
            <div className="ac-face face-yellow-1"></div>
            <div className="ac-face face-yellow-2"></div>
          </div>
        </section>

        {/* ======================================
            MAIN CONTENT & SECTIONS
        ====================================== */}
        <main className="ac-main">

          {/* 3. Platform Statistics */}
          <div className="ac-stats-grid">
            <div className="ac-stat-card">
              <div className="ac-stat-number">500+</div>
              <div className="ac-stat-label">Students</div>
            </div>
            <div className="ac-stat-card">
              <div className="ac-stat-number">120+</div>
              <div className="ac-stat-label">Alumni Mentors</div>
            </div>
            <div className="ac-stat-card">
              <div className="ac-stat-number">250+</div>
              <div className="ac-stat-label">Connections</div>
            </div>
            <div className="ac-stat-card">
              <div className="ac-stat-number">15+</div>
              <div className="ac-stat-label">Career Domains</div>
            </div>
          </div>

          {/* 1. How It Works Section */}
          <div className="ac-how-container" id="how-it-works">
            <div className="text-center mb-4">
              <h2 className="ac-section-heading">How It <span>Works</span></h2>
              <p className="text-muted mt-2">Simple, streamlined mentorship workflows for students and alumni.</p>
            </div>

            <div className="ac-steps-grid">
              <div className="ac-step-track">
                <h4>For Students</h4>
                <div className="ac-step-flow">
                  <span className="ac-step-pill">Create Profile</span>
                  <span className="ac-step-arrow">→</span>
                  <span className="ac-step-pill">Discover Alumni</span>
                  <span className="ac-step-arrow">→</span>
                  <span className="ac-step-pill">Send Request</span>
                  <span className="ac-step-arrow">→</span>
                  <span className="ac-step-pill">Connect &amp; Get Guidance</span>
                </div>
              </div>

              <div className="ac-step-track">
                <h4>For Alumni</h4>
                <div className="ac-step-flow">
                  <span className="ac-step-pill">Create Profile</span>
                  <span className="ac-step-arrow">→</span>
                  <span className="ac-step-pill">Set Expertise</span>
                  <span className="ac-step-arrow">→</span>
                  <span className="ac-step-pill">Receive Requests</span>
                  <span className="ac-step-arrow">→</span>
                  <span className="ac-step-pill">Mentor Students</span>
                </div>
              </div>
            </div>
          </div>

          {/* 🔥 "From Campus to Career" Journey Timeline */}
          <div className="ac-journey-section">
            <h3 style={{ fontSize: '26px', fontWeight: '900', marginBottom: '8px' }}>“From Campus to Career” Journey</h3>
            <p style={{ opacity: '0.8', fontSize: '15px' }}>Your step-by-step path from student to successful professional.</p>
            
            <div className="ac-journey-grid">
              <div className="ac-journey-step">
                <div className="ac-journey-icon">🎓</div>
                <div className="ac-journey-title">Student</div>
              </div>
              <div className="ac-journey-step">
                <div className="ac-journey-icon">🔎</div>
                <div className="ac-journey-title">Find the Right Alumni</div>
              </div>
              <div className="ac-journey-step">
                <div className="ac-journey-icon">🤝</div>
                <div className="ac-journey-title">Build a Connection</div>
              </div>
              <div className="ac-journey-step">
                <div className="ac-journey-icon">💬</div>
                <div className="ac-journey-title">Receive Guidance</div>
              </div>
              <div className="ac-journey-step">
                <div className="ac-journey-icon">🚀</div>
                <div className="ac-journey-title">Grow Your Career</div>
              </div>
            </div>
          </div>

          {/* 2. Mentorship Categories */}
          <div className="mb-5" id="categories">
            <div className="text-center mb-4">
              <h2 className="ac-section-heading">Mentorship <span>Categories</span></h2>
              <p className="text-muted mt-2">Explore the dedicated domains and areas of expertise available.</p>
            </div>

            <div className="ac-categories-grid">
              <div className="ac-category-card">
                <div className="ac-category-icon">💼</div>
                <div className="ac-category-name">Career Guidance</div>
                <div className="ac-category-desc">Navigate industry pathways and long-term career planning.</div>
              </div>
              <div className="ac-category-card">
                <div className="ac-category-icon">📄</div>
                <div className="ac-category-name">Resume &amp; LinkedIn</div>
                <div className="ac-category-desc">Get expert feedback to build a standout professional profile.</div>
              </div>
              <div className="ac-category-card">
                <div className="ac-category-icon">🎯</div>
                <div className="ac-category-name">Interview Preparation</div>
                <div className="ac-category-desc">Mock interviews, coding rounds, and recruiter expectations.</div>
              </div>
              <div className="ac-category-card">
                <div className="ac-category-icon">💻</div>
                <div className="ac-category-name">Technical Skills</div>
                <div className="ac-category-desc">Deep dives into modern stacks, frameworks, and architecture.</div>
              </div>
              <div className="ac-category-card">
                <div className="ac-category-icon">🏢</div>
                <div className="ac-category-name">Industry Insights</div>
                <div className="ac-category-desc">Understand corporate culture, workflows, and standards.</div>
              </div>
              <div className="ac-category-card">
                <div className="ac-category-icon">🎓</div>
                <div className="ac-category-name">Higher Studies</div>
                <div className="ac-category-desc">Advice on Master’s degrees, applications, and research.</div>
              </div>
              <div className="ac-category-card">
                <div className="ac-category-icon">🌐</div>
                <div className="ac-category-name">Internship Guidance</div>
                <div className="ac-category-desc">Tips and referrals to secure top-tier internships.</div>
              </div>
              <div className="ac-category-card">
                <div className="ac-category-icon">🚀</div>
                <div className="ac-category-name">Entrepreneurship</div>
                <div className="ac-category-desc">Startup advice, ideation, and scaling strategies.</div>
              </div>
            </div>
          </div>

          {/* Mentor Search Section */}
          <section className="ac-search-section" id="mentors">
            <div className="ac-search-title">
              Find your mentor
            </div>

            <div className="ac-search-row">
              <input
                type="text"
                className="form-control ac-input"
                placeholder="Search by name, role or company..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />

              <select
                className="form-select ac-select"
                value={selectedCompany}
                onChange={e => setSelectedCompany(e.target.value)}
              >
                <option value="">
                  All Companies
                </option>

                {uniqueCompanies.map((comp, idx) => (
                  <option key={idx} value={comp}>
                    {comp}
                  </option>
                ))}
              </select>
            </div>
          </section>

          <div className="ac-section-header">
            <div>
              <h2 className="ac-section-heading">
                {isSearching
                  ? <>Search <span>Results</span></>
                  : <>Featured <span>Mentors</span></>
                }
              </h2>
            </div>

            <span className="ac-count">
              {isSearching
                ? `Showing ${displayedAlumni.length} matching mentors`
                : `Showing latest ${displayedAlumni.length} of ${publicAlumni.length} approved mentors`
              }
            </span>
          </div>

          {displayedAlumni.length === 0 ? (
            <div className="ac-empty">
              <div className="ac-empty-icon">
                🔍
              </div>

              <h5>
                No alumni found
              </h5>

              <p className="mb-0">
                Try searching with a different name, role or company.
              </p>
            </div>
          ) : (
            <div className="row g-4 mb-5">
              {displayedAlumni.map(a => (
                <div
                  className="col-md-6 col-lg-4"
                  key={a._id}
                >
                  <div className="ac-card">
                    <div>
                      <div className="ac-profile-wrapper">
                        {a.profilePic ? (
                          <img
                            src={a.profilePic}
                            alt={a.name}
                            className="ac-profile"
                          />
                        ) : (
                          <div className="ac-avatar">
                            {a.name
                              ? a.name.charAt(0).toUpperCase()
                              : 'A'
                            }
                          </div>
                        )}
                      </div>

                      <div className="text-center">
                        <h5 className="ac-name">
                          {a.name || 'Alumni'}
                        </h5>
                        <p className="ac-email">
                          {a.email}
                        </p>
                      </div>

                      <div className="ac-info">
                        <span className="ac-info-icon">
                          ◈
                        </span>
                        <span>
                          <strong>Company:</strong>{' '}
                          {a.company || 'N/A'}
                        </span>
                      </div>

                      <div className="ac-info">
                        <span className="ac-info-icon">
                          ◆
                        </span>
                        <span>
                          <strong>Role:</strong>{' '}
                          {a.jobTitle || 'N/A'}
                        </span>
                      </div>

                      <div className="ac-info">
                        <span className="ac-info-icon">
                          ✦
                        </span>
                        <span>
                          <strong>Experience:</strong>{' '}
                          {a.experience
                            ? `${a.experience} Years`
                            : 'N/A'
                          }
                        </span>
                      </div>

                      <div className="text-center">
                        <span className="ac-badge">
                          <span className="ac-badge-dot"></span>
                          Verified Mentor
                        </span>
                      </div>
                    </div>

                    <button
                      className="ac-connect"
                      onClick={() => handleConnect(a._id)}
                      disabled={connectingId === a._id}
                    >
                      {connectingId === a._id ? (
                        <>
                          <span className="ac-connect-loading"></span>
                          Connecting...
                        </>
                      ) : (
                        'Connect with Mentor →'
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 5. What Can Your Mentor Help With? */}
          <div className="mb-5">
            <div className="text-center mb-4">
              <h2 className="ac-section-heading">What Can Your Mentor <span>Help With?</span></h2>
              <p className="text-muted mt-2">More than just career advice. Get guidance from people who have already walked the path.</p>
            </div>

            <div className="ac-categories-grid">
              <div className="ac-category-card">
                <div className="ac-category-icon">🧭</div>
                <div className="ac-category-name">Career Decisions</div>
                <div className="ac-category-desc">Understand different career paths and explore new opportunities.</div>
              </div>
              <div className="ac-category-card">
                <div className="ac-category-icon">📝</div>
                <div className="ac-category-name">Resume &amp; Profile</div>
                <div className="ac-category-desc">Get feedback to make your professional profile significantly stronger.</div>
              </div>
              <div className="ac-category-card">
                <div className="ac-category-icon">💡</div>
                <div className="ac-category-name">Interview Preparation</div>
                <div className="ac-category-desc">Learn how real interviews work and what recruiters look for.</div>
              </div>
              <div className="ac-category-card">
                <div className="ac-category-icon">🏢</div>
                <div className="ac-category-name">Industry Knowledge</div>
                <div className="ac-category-desc">Understand workplace expectations and current industry trends.</div>
              </div>
            </div>
          </div>

          {/* 6. Why Join Us? */}
          <div className="ac-why-grid">
            <div className="ac-why-box">
              <h3>For Students</h3>
              <ul className="ac-why-list">
                <li><span className="ac-why-check">✓</span> Get real-world career guidance</li>
                <li><span className="ac-why-check">✓</span> Receive resume and profile feedback</li>
                <li><span className="ac-why-check">✓</span> Discover internship opportunities</li>
                <li><span className="ac-why-check">✓</span> Learn from industry experience</li>
                <li><span className="ac-why-check">✓</span> Build meaningful professional connections</li>
              </ul>
            </div>

            <div className="ac-why-box">
              <h3>For Alumni</h3>
              <ul className="ac-why-list">
                <li><span className="ac-why-check">✓</span> Give back to your institution</li>
                <li><span className="ac-why-check">✓</span> Share your professional experience</li>
                <li><span className="ac-why-check">✓</span> Expand your professional network</li>
                <li><span className="ac-why-check">✓</span> Support the next generation</li>
                <li><span className="ac-why-check">✓</span> Discover emerging campus talent</li>
              </ul>
            </div>
          </div>

          {/* 7. Success Stories */}
          <div className="mb-5">
            <div className="text-center mb-4">
              <h2 className="ac-section-heading">Success <span>Stories</span></h2>
              <p className="text-muted mt-2">Hear from students who transformed their careers through mentorship.</p>
            </div>

            <div className="ac-stories-grid">
              <div className="ac-story-card">
                <div className="ac-story-text">
                  “My mentor helped me understand which career path suited my interests and guided me through my first interview.”
                </div>
                <div className="ac-story-author">
                  <div className="ac-story-avatar">A</div>
                  <div className="ac-story-info">
                    <h5>Anjali</h5>
                    <p>MCA Student</p>
                  </div>
                </div>
              </div>

              <div className="ac-story-card">
                <div className="ac-story-text">
                  “The resume review sessions gave me the confidence to apply for top tech roles and secure an internship.”
                </div>
                <div className="ac-story-author">
                  <div className="ac-story-avatar">R</div>
                  <div className="ac-story-info">
                    <h5>Rahul</h5>
                    <p>Computer Science Student</p>
                  </div>
                </div>
              </div>

              <div className="ac-story-card">
                <div className="ac-story-text">
                  “Connecting with an alumnus working at my dream company opened doors I never knew existed.”
                </div>
                <div className="ac-story-author">
                  <div className="ac-story-avatar">D</div>
                  <div className="ac-story-info">
                    <h5>Devika</h5>
                    <p>MCA Graduate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 9. FAQ */}
          <div className="ac-faq-container" id="faq">
            <div className="text-center mb-4">
              <h2 className="ac-section-heading">Frequently Asked <span>Questions</span></h2>
              <p className="text-muted mt-2">Got questions? We've got answers.</p>
            </div>

            {faqs.map((faq, idx) => (
              <div key={idx} className={`ac-faq-item ${openFaq === idx ? 'active' : ''}`}>
                <button className="ac-faq-question" onClick={() => toggleFaq(idx)}>
                  <span>{faq.q}</span>
                  <span>{openFaq === idx ? '−' : '+'}</span>
                </button>
                {openFaq === idx && (
                  <p className="ac-faq-answer">{faq.a}</p>
                )}
              </div>
            ))}
          </div>

          {/* 8. A Powerful CTA Before the Footer */}
          <div className="ac-cta-banner">
            <h2>Your Next Opportunity Could Start With One Conversation.</h2>
            <p>Connect with an alumnus who has already walked the path you're about to take.</p>
            <div className="ac-cta-actions">
              <button className="ac-cta-btn-primary" onClick={() => setPage('register')}>Find a Mentor</button>
              <button className="ac-cta-btn-secondary" onClick={() => setPage('register')}>Become a Mentor</button>
            </div>
          </div>

        </main>

        {/* 10. Professional 4-Column Footer */}
        <footer className="ac-footer">
          <div className="ac-footer-grid">
            <div className="ac-footer-col">
              <div className="ac-nav-brand mb-3" onClick={() => setPage('home')}>
                <div className="ac-brand-badge">A</div>
                Alumni Student Mentorship
              </div>
              <p>Bridging students and alumni through meaningful mentorship and professional career guidance.</p>
            </div>

            <div className="ac-footer-col">
              <h5>Platform</h5>
              <ul className="ac-footer-links">
                <li><a href="#mentors">Find Alumni</a></li>
                <li><a href="#mentors">Become a Mentor</a></li>
                <li><a href="#how-it-works">How It Works</a></li>
                <li><a href="#categories">Success Stories</a></li>
              </ul>
            </div>

            <div className="ac-footer-col">
              <h5>Support</h5>
              <ul className="ac-footer-links">
                <li><a href="#faq">FAQ</a></li>
                <li><a href="#faq">Contact Us</a></li>
                <li><a href="#faq">Privacy Policy</a></li>
                <li><a href="#faq">Terms</a></li>
              </ul>
            </div>

            <div className="ac-footer-col">
              <h5>Connect</h5>
              <ul className="ac-footer-links">
                <li><span>Email: support@alumnimentor.edu</span></li>
                <li><span>Phone: +91 (555) 019-2834</span></li>
                <li><a href="#linkedin">LinkedIn</a></li>
                <li><a href="#instagram">Instagram</a></li>
              </ul>
            </div>
          </div>

          <div className="ac-footer-bottom">
            <span>© 2026 Alumni Student Mentorship. All rights reserved.</span>
            <span>Crafted for student success.</span>
          </div>
        </footer>
      </div>
    </>
  );
}