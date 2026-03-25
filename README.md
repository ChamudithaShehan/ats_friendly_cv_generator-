# 🏷️ CV Hub Pro

> Build ATS-friendly, professional resumes in minutes with live preview, smart scoring, and export support.

CV Hub Pro is a modern resume builder designed for job seekers who want both recruiter-friendly formatting and polished visual templates.

---

# 📖 Project Description

CV Hub Pro helps users create high-quality resumes through a guided builder experience.

The app is focused on:

- Creating resumes that are optimized for ATS (Applicant Tracking Systems)
- Giving real-time visual feedback while editing
- Providing template flexibility for both ATS-first and design-focused resumes
- Offering practical analysis tools such as ATS score checks and keyword matching

### Main Purpose

To reduce the time and effort needed to create a strong, professional resume that performs well in modern hiring pipelines.

### Target Users

- Students and fresh graduates
- Mid-level professionals
- Career switchers
- Recruiter-facing candidates who need ATS compatibility

---

# ✨ Features

- Live resume builder with instant preview
- Multiple professional templates
- ATS Friendly and Normal CV template categories
- Drag-and-drop section reordering
- ATS score analysis panel
- Keyword matcher assistant
- Resume sections for:
	- Personal information
	- Summary
	- Experience
	- Education
	- Skills
	- Projects
	- Certifications
- Profile photo support for Normal CV templates
- Resume dashboard to manage multiple resumes
- Full preview page for final review
- Export utilities for PDF and DOCX
- Component-based modern UI powered by shadcn/ui
- Testing setup with Vitest and Playwright

---

# 🧠 Technologies Used

### Frontend

- Next.js (App Router)
- React 18
- TypeScript

### Backend

- No separate backend service in this repository
- Current app state is managed in the frontend context layer

### Styling and UI

- Tailwind CSS
- shadcn/ui component system
- Radix UI primitives
- Lucide React icons

### Other Libraries and Tools

- TanStack Query
- DnD Kit (drag-and-drop)
- jsPDF + html2canvas (PDF export)
- docx + file-saver (DOCX export)
- Sonner (notifications)
- ESLint
- Vitest + Testing Library
- Playwright

---

# 🖼️ Screenshots / UI Preview

Add screenshots to a `screenshots/` folder in the repository root and reference them below.

Suggested screenshot files:

- `screenshots/home.png`
- `screenshots/templates.png`
- `screenshots/builder.png`
- `screenshots/dashboard.png`
- `screenshots/preview.png`

Example markdown:

```md
![Home](screenshots/home.png)
![Templates](screenshots/templates.png)
![Builder](screenshots/builder.png)
![Dashboard](screenshots/dashboard.png)
![Preview](screenshots/preview.png)
```

### Recommended Screens to Capture

- Home/Landing page
- Templates gallery (ATS Friendly + Normal CV)
- Resume Builder with live preview
- Dashboard with saved resumes
- Final Preview page

---

# ⚙️ Installation

1. Clone the repository

```bash
git clone https://github.com/your-username/cv-hub-pro.git
cd cv-hub-pro
```

2. Install dependencies

```bash
npm install
```

3. Start development server

```bash
npm run dev
```

4. Open in browser

```text
http://localhost:3000
```

---

# 🚀 Usage

### Basic Workflow

1. Open the app and go to Dashboard
2. Create or select a resume
3. Choose a template from Templates
4. Fill sections in Builder
5. Watch live preview update in real time
6. Review ATS score and keyword suggestions
7. Save and open full Preview
8. Export to PDF/DOCX

### Available Scripts

```bash
npm run dev     # Run development server
npm run build   # Build production app
npm run start   # Start production server
npm run lint    # Run ESLint
npm run test    # Run Vitest suite
```

---

# 📁 Folder Structure

```text
cv-hub-pro/
├─ public/
├─ src/
│  ├─ app/
│  │  ├─ auth/
│  │  ├─ builder/
│  │  ├─ dashboard/
│  │  ├─ preview/[id]/
│  │  ├─ profile/
│  │  ├─ templates/
│  │  ├─ layout.tsx
│  │  └─ page.tsx
│  ├─ components/
│  │  ├─ ui/
│  │  ├─ ATSScorePanel.tsx
│  │  ├─ KeywordMatcher.tsx
│  │  ├─ Navbar.tsx
│  │  └─ ResumePreview.tsx
│  ├─ context/
│  │  ├─ ResumeContext.tsx
│  │  └─ ThemeContext.tsx
│  ├─ hooks/
│  ├─ lib/
│  │  ├─ ats-analyzer.ts
│  │  ├─ pdf.ts
│  │  ├─ docx.ts
│  │  └─ utils.ts
│  └─ test/
├─ package.json
├─ next.config.mjs
├─ tailwind.config.ts
└─ README.md
```

---

# 🔐 Environment Variables

This project currently runs without required environment variables.

You can still create a local env file for future integrations:

```bash
cp .env.example .env.local
```

Suggested optional variables (if you add integrations later):

```env
NEXT_PUBLIC_APP_NAME=CV Hub Pro
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

# 🛠️ Future Improvements

- Authentication and user accounts
- Cloud database for resume persistence
- AI-powered content suggestions
- Role-specific resume optimization packs
- Multi-language resume support
- Import from LinkedIn/profile files
- One-click shareable resume links
- Theme customization and branding kits
- Rich analytics for ATS and keyword trends

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/your-feature-name
```

3. Commit your changes

```bash
git commit -m "feat: add your feature"
```

4. Push to your fork

```bash
git push origin feature/your-feature-name
```

5. Open a Pull Request

### Contribution Tips

- Keep changes focused and modular
- Run lint/build/tests before opening PR
- Document any new config or behavior

---

# 📜 License

This project is licensed under the MIT License.

You can add a `LICENSE` file with standard MIT text if not already present.

---

# 👤 Author

- Name: Your Name
- GitHub: https://github.com/ChamudithaShehan
- Email: chamudithashahan@gmail.com

---

If you find this project helpful, consider giving it a star.
