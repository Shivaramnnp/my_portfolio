# Cyberpunk OS Developer Portfolio & Recruiter Engine

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)

An immersive, high-performance developer portfolio styled as an interactive **Cyberpunk Operating System (OS)**. Built using **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, and **Supabase**, this project goes beyond a standard static portfolio to provide an automated lead-funnel for recruiters and managers.

---

## 🚀 Key Features

*   **Immersive Cyberpunk OS theme:** Rich visual styling with glassmorphic dashboards, customizable terminal interfaces, and high-frequency neon layout glowing accents.
*   **Recruiter CTA & Resume Customization:** Built-in engine designed to generate dynamically optimized resume keywords and tracks recruiter engagement analytics.
*   **Advanced Project Gallery (CMS):** Supports multiple screenshots and image attachments per project. Includes a fluid Framer Motion carousel with lightbox zooming features.
*   **Dynamic Social Integration:** Centered, floating social links container above the page footer resolving LinkedIn, GitHub, Instagram, and Message/Email options directly from Supabase databases.
*   **Robust Admin Dashboard:** Full administration suite with secure authentication allowing real-time edits for project details, profile metadata, timeline events, and visitor logs.

---

## 🛠️ Technology Stack

*   **Frontend:** React 19, Next.js 16 (App Router)
*   **Styling:** Tailwind CSS v4, Vanilla CSS variables, Framer Motion (for physics-based transitions)
*   **Backend Database:** Supabase PostgreSQL
*   **File Storage:** Supabase Storage (for avatars and project screenshot uploads)
*   **Development Server:** Webpack Dev Server (configured as fallback to bypass project workspace path collisions)

---

## 💻 Getting Started

### 1. Prerequisites
Ensure you have the following installed:
*   [Node.js (v18.x or newer)](https://nodejs.org/)
*   [Git](https://git-scm.com/)

### 2. Installation
Clone the repository and install the dependencies:
```bash
# Clone the repository
git clone https://github.com/Shivaramnnp/my_portfolio.git
cd my_portfolio

# Install NPM dependencies
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory of your project:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### 4. Running the Development Server
Due to local path configurations (like having `.git` folders in home directories), the default dev compiler utilizes standard Webpack compiler stability.

Start the dev server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) inside your browser to view your Cyberpunk OS Portfolio.

---

## 🗄️ Database Setup & Migrations

All SQL schemas are located inside the `supabase/migrations/` directory.

To apply migrations manually or configure your local database:
1. Initialize your tables using the schemas in:
   *   [20260621000000_initial_schema.sql](file:///Users/shivarampatel/Desktop/my_portfolio/supabase/migrations/20260621000000_initial_schema.sql)
   *   [20260621110000_analytics_schema.sql](file:///Users/shivarampatel/Desktop/my_portfolio/supabase/migrations/20260621110000_analytics_schema.sql)
   *   [20260621120000_resume_variants.sql](file:///Users/shivarampatel/Desktop/my_portfolio/supabase/migrations/20260621120000_resume_variants.sql)
2. Enable RLS (Row Level Security) and configure read-access policies.

---

## 📁 Architecture Overview

```text
├── public/                 # Static assets (SVGs, icons)
├── src/
│   ├── app/                # Next.js App Router (pages and API endpoints)
│   │   ├── (admin)/        # Secure Admin Panel routes
│   │   ├── api/            # Server Actions & API endpoints
│   │   └── page.tsx        # Portfolio main home dashboard
│   ├── components/
│   │   ├── admin/          # Form layouts, uploader, admin buttons
│   │   ├── public/         # OS interface, timeline, chat panel
│   │   └── shared/         # Navbar, Custom dynamic Footer
│   ├── hooks/              # Custom React hooks (analytics, theme)
│   └── lib/                # Supabase configurations & helpers
└── supabase/               # SQL migrations and database setup
```
