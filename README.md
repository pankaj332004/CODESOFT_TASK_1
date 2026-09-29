# Job Board - Full-Stack MERN Application

A modern, high-performance job board platform built with React + Vite, Node.js + Express, and MongoDB, styled entirely with Tailwind CSS v3 and Lucide React icons.

![Job Board Architecture](client/public/images/logo.svg)

---

## 🌟 Key Features

1. **Home Page**: Hero section with quick search, live stats counter (4,536+ Jobs, 1,200+ Companies, 3,000+ Candidates, 500+ Hires), featured job cards, and categorized disciplines.
2. **Job Listings & Multi-Filter Search**: Full-text keyword search, location filtering, job type checkboxes, domain categories, experience levels, and sorting.
3. **Comprehensive Job Details**: Complete role overview, responsibilities, requirements, company info card, salary, and instant apply action.
4. **Candidate & Employer Authentication**: Dedicated role switcher, secure JWT authentication with bcrypt password hashing, and instant demo login autofill.
5. **Candidate Dashboard & My Applications**: Overview of submitted applications, statuses (`Applied`, `Under Review`, `Interview`, `Offer`, `Rejected`), and quick job bookmarking.
6. **Employer Dashboard & Job Management**: Post new job openings with custom requirements, view applicant pipelines, change candidate statuses in real-time, and monitor monthly application metrics.
7. **Job Application & Resume Upload**: Multi-part resume uploader supporting PDF, DOC, and DOCX files with size validation.
8. **Automated Email Notifications**: Candidate submission confirmations and employer alerts with fallback preview logging.
9. **Responsive Design**: Flawless experience across mobile, tablet, and desktop viewports.

---

## 🏗️ Architecture & Folder Structure

```
job-board/
├── client/
│   ├── public/
│   │   └── images/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ApplicationRow.jsx
│   │   │   ├── CategoryCard.jsx
│   │   │   ├── DashboardSidebar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── JobCard.jsx
│   │   │   ├── JobFilters.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── SearchBar.jsx
│   │   ├── pages/
│   │   │   ├── ApplyJob.jsx
│   │   │   ├── CandidateDashboard.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── EmployerDashboard.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── JobDetails.jsx
│   │   │   ├── Jobs.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── MyApplications.jsx
│   │   │   ├── PostJob.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Register.jsx
│   │   ├── layouts/
│   │   │   ├── MainLayout.jsx
│   │   │   └── DashboardLayout.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── jobService.js
│   │   │   └── applicationService.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   └── useJobs.js
│   │   ├── utils/
│   │   │   ├── constants.js
│   │   │   └── helpers.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Job.js
│   │   │   └── Application.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── jobController.js
│   │   │   ├── applicationController.js
│   │   │   └── userController.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── jobRoutes.js
│   │   │   ├── applicationRoutes.js
│   │   │   └── userRoutes.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   ├── roleMiddleware.js
│   │   │   └── uploadMiddleware.js
│   │   ├── services/
│   │   │   ├── emailService.js
│   │   │   └── notificationService.js
│   │   └── server.js
│   ├── uploads/
│   │   └── resumes/
│   ├── package.json
│   └── .env
│
├── README.md
├── .gitignore
└── package.json
```

---

## 🎨 UI Design Tokens

```css
:root {
  --primary: #1288e8;
  --primary-dark: #0876d8;
  --success: #08cf72;
  --text: #17324f;
  --muted: #718096;
  --background: #f6f9fc;
  --white: #ffffff;
  --border: #e6edf4;
  --radius: 7px;
}
```

---

## 🚀 Getting Started

### 1. Install All Dependencies
From the repository root:
```bash
npm run install:all
```

### 2. Run Concurrently (Client + Server)
```bash
npm run dev
```
- **React Frontend**: `http://localhost:5173`
- **Node/Express API**: `http://localhost:5000`

---

## 🔑 Demo Accounts

Use the pre-seeded accounts or register a new one:

| Role | Email | Password |
|---|---|---|
| **Candidate** | `john@example.com` | `password123` |
| **Employer** | `jane@employer.com` | `password123` |
