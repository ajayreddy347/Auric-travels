import React, { useState, useEffect } from 'react';
import { Shield, Lock, FileText, Download, X, ExternalLink } from 'lucide-react';

export type LegalDocType = 'privacy' | 'terms' | 'security' | null;

interface LegalModalProps {
  isOpen: boolean;
  type: LegalDocType;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, type, onClose }) => {
  const [viewMode, setViewMode] = useState<'pdf' | 'text'>('pdf');
  const [key, setKey] = useState(0); // Force reload iframe on type change

  // Detect mobile width to default to 'text' view for better compatibility
  useEffect(() => {
    if (isOpen) {
      const isMobile = window.innerWidth < 768;
      setViewMode(isMobile ? 'text' : 'pdf');
      setKey(prev => prev + 1); // Reset iframe src key
    }
  }, [isOpen, type]);

  if (!isOpen || !type) return null;

  const getDocData = () => {
    switch (type) {
      case 'privacy':
        return {
          title: 'Privacy Policy',
          subtitle: 'Auric Travels Luxury Data Protection & Privacy Governance',
          icon: <Shield className="w-5 h-5 text-[#C5A059]" />,
          pdfPage: 6,
          sections: [
            {
              heading: '1. Executive Summary & Scope',
              content: 'Auric Travels is committed to safeguarding the personal data and privacy of our distinguished clientele. This Privacy Policy details how we collect, store, process, and protect your personal identification, payment, travel, and location data when you utilize our concierge, trip planning, and booking services.'
            },
            {
              heading: '2. Information We Collect',
              content: 'We collect information provided directly by you during registration, itinerary creation, and booking checkout. This includes your full name, email address, contact phone number, billing address, dietary preferences, passport information for international reservations, and tailored travel requirements.'
            },
            {
              heading: '3. Real-Time Location & Google Places Usage',
              content: 'To deliver tailored recommendations and precise map visualizers, Auric Travels integrates Google Places APIs. Your search queries and location coordinates are utilized solely to fetch authentic venue details, geographic coordinates, and regional transit estimations.'
            },
            {
              heading: '4. Security, JWT & Data Protection',
              content: 'All user authentication utilizes cryptographically signed JSON Web Tokens (JWT) transmitted over industry-standard TLS encryption. Sensitive credentials are salted and hashed using bcrypt. We implement strict role-based access control ensuring users only access their personal itineraries and reservations.'
            },
            {
              heading: '5. Data Retention & Client Rights',
              content: 'Your account data is retained for as long as your profile remains active. You maintain the right to inspect, correct, export, or request immediate deletion of your personal records and past bookings by contacting our privacy compliance desk.'
            }
          ]
        };
      case 'terms':
        return {
          title: 'Terms of Luxury Service',
          subtitle: 'Client Agreement & Service Provision Terms',
          icon: <FileText className="w-5 h-5 text-[#C5A059]" />,
          pdfPage: 9,
          sections: [
            {
              heading: '1. Acceptance of Terms',
              content: 'By accessing Auric Travels and utilizing our bespoke itinerary planner, boutique hotel reservations, and curated experiences, you agree to be bound by these Terms of Luxury Service.'
            },
            {
              heading: '2. Trip Planning & Itinerary Curation',
              content: 'Itineraries curated through the Auric Travels platform represent customized travel schedules. Prices, operational hours, and availability of partner venues and private aviation are subject to real-time verification upon booking confirmation.'
            },
            {
              heading: '3. Bookings, Payments & Pricing',
              content: 'All transactions for verified experiences and luxury accommodations are processed in Indian Rupees (INR ₹) or supported global currencies with transparent breakdown of taxes, concierge fees, and service charges. Full payment or authorized deposit secures reservation vouchers.'
            },
            {
              heading: '4. Cancellations, Modifications & Refunds',
              content: 'Cancellation policies vary by luxury provider and tier. Standard boutique bookings allow flexible modification or refund up to 72 hours prior to scheduled arrival. Dedicated private charters and exclusive villas adhere to supplier-specific terms clearly outlined at checkout.'
            },
            {
              heading: '5. Client Responsibilities & Liability',
              content: 'Clients are responsible for maintaining valid travel documentation, visas, and health advisories for designated destinations. Auric Travels operates as a premier concierge service partnering with verified international operators.'
            }
          ]
        };
      case 'security':
        return {
          title: 'Security & Trust Architecture',
          subtitle: 'Enterprise-Grade Data Integrity, Cryptography & Privacy Standards',
          icon: <Lock className="w-5 h-5 text-[#C5A059]" />,
          pdfPage: 12,
          sections: [
            {
              heading: '1. Identity & Cryptographic Authentication',
              content: 'Auric Travels employs stateless JWT tokens with signed cryptographic payloads and configurable expiration. Passwords undergo high-entropy bcrypt hashing with individual cryptographic salts.'
            },
            {
              heading: '2. Database Isolation & Row-Level Authorization',
              content: 'Our PostgreSQL database tier enforces strict relational isolation. Trip items, user itineraries, and transaction bookings are linked to verified account IDs, preventing unauthorized cross-tenant record retrieval.'
            },
            {
              heading: '3. Payment & Transaction Confidentiality',
              content: 'Payment transactions adhere strictly to PCI-DSS Level 1 compliance guidelines. Payment instrument numbers are never stored in plaintext within our databases.'
            },
            {
              heading: '4. Google Maps & External API Privacy',
              content: 'External location and map searches query authorized Google Maps Platform APIs using secure server-side proxies or authorized client tokens, ensuring user metadata is never leaked to unverified endpoints.'
            },
            {
              heading: '5. Continuous Vulnerability Auditing',
              content: 'Our engineering systems undergo regular automated dependency scanning, code audits, and strict TLS 1.3 encrypted transit protocols across all client-server communications.'
            }
          ]
        };
      default:
        return null;
    }
  };

  const doc = getDocData();
  if (!doc) return null;

  const pdfUrl = `/Auric_Travels_Legal_Documents.pdf#page=${doc.pdfPage}`;

  const handleDownloadPDF = () => {
    // Open in a new tab for native browser viewing/downloading
    window.open('/Auric_Travels_Legal_Documents.pdf', '_blank');
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        id="legal-modal-content" 
        className="relative w-full max-w-5xl h-[90vh] sm:h-[85vh] flex flex-col rounded-3xl bg-white dark:bg-stone-900 border border-neutral-200 dark:border-white/10 shadow-2xl overflow-hidden transition-colors"
      >
        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 py-4 border-b border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-stone-900/80 gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#C5A059]">
              {doc.icon}
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-neutral-900 dark:text-white leading-tight">{doc.title}</h2>
              <p className="text-[10px] sm:text-xs text-neutral-500 dark:text-gray-400 font-mono uppercase tracking-wider">{doc.subtitle}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* View Mode Switcher */}
            <div className="inline-flex rounded-xl bg-neutral-200/60 dark:bg-white/5 p-0.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setViewMode('pdf')}
                className={`px-3 py-1 rounded-lg transition-all ${viewMode === 'pdf' ? 'bg-[#C5A059] text-black shadow-sm' : 'text-neutral-600 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white'}`}
              >
                PDF View
              </button>
              <button
                type="button"
                onClick={() => setViewMode('text')}
                className={`px-3 py-1 rounded-lg transition-all ${viewMode === 'text' ? 'bg-[#C5A059] text-black shadow-sm' : 'text-neutral-600 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white'}`}
              >
                Responsive Text
              </button>
            </div>

            <button
              id="close-legal-modal-btn"
              onClick={onClose}
              className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/60 dark:hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-hidden p-4 sm:p-6 bg-neutral-100 dark:bg-stone-950/40">
          {viewMode === 'pdf' ? (
            <div className="w-full h-full flex flex-col items-center justify-center relative bg-neutral-200 dark:bg-stone-950 rounded-2xl overflow-hidden border border-neutral-300 dark:border-white/5">
              {/* PDF Iframe */}
              <iframe
                key={`${key}-${type}`}
                src={pdfUrl}
                title={doc.title}
                className="w-full h-full block border-none bg-neutral-200 dark:bg-stone-950"
              />
              {/* Overlay message helper */}
              <div className="absolute bottom-4 right-4 z-10 flex gap-2">
                <a
                  href="/Auric_Travels_Legal_Documents.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/75 hover:bg-black/90 backdrop-blur-md border border-white/10 text-white text-[11px] font-semibold transition-all shadow-lg"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in New Tab</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="w-full h-full overflow-y-auto pr-1 space-y-6 text-neutral-800 dark:text-gray-200 custom-scrollbar scroll-smooth">
              {/* Warning template notice */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-800 dark:text-[#F3E5AB] text-xs leading-relaxed font-serif">
                <strong>Official Document Copy:</strong> Below is a high-fidelity plain text translation of the compiled legal register. Use the PDF view or download option to inspect the certified client copy.
              </div>

              {doc.sections.map((sec, idx) => (
                <div key={idx} className="space-y-2 p-5 rounded-2xl bg-white dark:bg-stone-900 border border-neutral-200 dark:border-white/5 shadow-sm">
                  <h3 className="text-sm sm:text-base font-serif font-bold text-neutral-900 dark:text-[#C5A059] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                    {sec.heading}
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-gray-300 pl-3.5">
                    {sec.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-stone-900/90">
          <div className="text-[10px] sm:text-xs text-neutral-500 dark:text-gray-400 font-mono tracking-wider">
            AURIC TRAVELS COMPLIANCE DEPT
          </div>
          <div className="flex items-center gap-3">
            <button
              id="legal-download-pdf-btn"
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-black bg-[#C5A059] hover:bg-[#F3E5AB] rounded-xl shadow-md hover:shadow-[#C5A059]/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download className="w-3.5 h-3.5 text-black" />
              <span>Open Certified PDF</span>
            </button>
            <button
              id="close-legal-action-btn"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-neutral-600 dark:text-gray-300 hover:bg-neutral-200/60 dark:hover:bg-white/5 rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
