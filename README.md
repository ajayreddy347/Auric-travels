<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# 👑 Auric Travels
### *Bespoke Global Journeys & AI-Powered Luxury Travel Platform*

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Render-gold?style=for-the-badge&logo=render)](https://auric-travels-y948.onrender.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)

</div>

---

## 🌐 Live Demo

Explore the live production application here:  
👉 **[https://auric-travels-y948.onrender.com](https://auric-travels-y948.onrender.com)**

---

## 📖 About Auric Travels

**Auric Travels** is a full-stack, AI-native luxury travel platform designed to craft tailored travel experiences, book royal heritage properties, and plan custom multi-day expeditions. Powered by **Google Gemini AI**, interactive **Google Maps & Places APIs**, and a **PostgreSQL database engine**, Auric Travels blends bespoke gold-and-obsidian aesthetics with performance and enterprise-grade security.

---

## ✨ Key Features

- 🏛️ **Auric Stay Booking Engine**: Real-time property and suite selection, dynamic date validation, night calculations, and authoritative server-side pricing with PostgreSQL persistence.
- 🤖 **AI-Powered Trip Planner**: Custom multi-day itinerary generation using **Google Gemini AI**, with personalized travel styles, budget tiers, and activity curation.
- 🔐 **Dual Authentication & Security**:
  - Google OAuth 2.0 Web Client integration with instant zero-flash session restoral.
  - Email/Password authentication with salted `bcryptjs` hashing.
  - Cryptographically secure, single-use, 15-minute expiring password reset tokens.
  - HTTP-based transactional email delivery via **Resend API**.
- 🗺️ **Interactive Global Map Explorer**: Integrated Google Maps Platform with place autocomplete, coordinates, and visual pin markers.
- 🎒 **Curated Luxury Experiences & Destinations**: 58 iconic destinations and 28 handpicked luxury adventures across cultural, wildlife, and royal heritage landscapes.
- 📑 **My Bookings Vault & Management**: Secure user-isolated booking records with instant confirmation, live status tracking, and owner cancellation privileges.
- 🌓 **Bespoke Theme System**: Seamless dark and light themes with responsive layouts optimized for mobile, tablet, and desktop screens.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS + Custom Obsidian/Gold Luxury Theme
- **Animations**: Motion (Framer Motion)
- **Icons**: Lucide React
- **Maps**: `@vis.gl/react-google-maps`

### **Backend & APIs**
- **Runtime**: Node.js + Express
- **Language**: TypeScript (compiled via `esbuild` & `tsx`)
- **Database**: PostgreSQL (Hosted on Supabase) with parameterized connection pooling (`pg`)
- **Authentication**: JSON Web Tokens (JWT) + `bcryptjs`
- **Email Service**: Resend REST API (HTTPS) + Nodemailer SMTP fallback
- **AI Engine**: Google Gemini API (`@google/genai`)
- **Places & Geocoding**: Google Maps Platform & Places API (New)

---

## 🚀 Run Locally

### **Prerequisites**
- Node.js (v18+)
- PostgreSQL database (or Supabase)

### **Installation**
1. **Clone the repository**:
   ```bash
   git clone https://github.com/ajayreddy347/Auric-travels.git
   cd Auric-travels
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and fill in your keys:
   ```bash
   cp .env.example .env
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for Production**:
   ```bash
   npm run build
   npm run start
   ```

---

## 🌐 Deployment Information

- **Frontend & Backend Hosting**: [Render](https://render.com)
- **Production URL**: [https://auric-travels-y948.onrender.com](https://auric-travels-y948.onrender.com)
- **Database**: Hosted PostgreSQL on Supabase (with auto-migrating tables)
- **CI/CD**: Continuous deployment directly from GitHub `main` branch.

---

<div align="center">
  <sub>Crafted for luxury travel enthusiasts &bull; Auric Travels &copy; 2026</sub>
</div>