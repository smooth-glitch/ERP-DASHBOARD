# Axpert ERP Admin Dashboard

A modern, responsive **ERP-style admin dashboard** built with HTML, CSS, and JavaScript—featuring a clean topbar + sidebar layout, multi-view navigation (Sales/Purchase/Assets/Reports/Settings), Chart.js analytics, and a smooth dark/light experience. [file:11][file:12][file:13]

> Built as a front-end dashboard demo inspired by common Axpert ERP navigation patterns (TStruct / IView links). [file:13]

---

## Preview

- Login screen + client-side demo auth (no backend). [file:11][file:13]
- Overview KPIs with sparklines + interactive charts. [file:11][file:13]
- Sales / Purchase / Assets analytics sections. [file:11][file:13]
- Reports tiles + CSV export. [file:11][file:13]
- Settings: Theme + Motion + Workspace actions. [file:11][file:12][file:13]

---

## 💻 Tech Stack

<p align="center">
  <!-- Core -->
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5"/>
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=000" alt="JavaScript"/>

  <!-- UI -->
  <img src="https://img.shields.io/badge/Bootstrap%205-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white" alt="Bootstrap 5"/>
  <img src="https://img.shields.io/badge/Bootstrap%20Icons-000000?style=for-the-badge&logo=bootstrap&logoColor=white" alt="Bootstrap Icons"/>

  <!-- Charts -->
  <img src="https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white" alt="Chart.js"/>

  <!-- Storage -->
  <img src="https://img.shields.io/badge/LocalStorage-334155?style=for-the-badge" alt="LocalStorage"/>

  <!-- Hosting & Tools -->
  <img src="https://img.shields.io/badge/GitHub-121011?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"/>
  <img src="https://img.shields.io/badge/Git-F05033?style=for-the-badge&logo=git&logoColor=white" alt="Git"/>
  <img src="https://img.shields.io/badge/GitHub%20Pages-222222?style=for-the-badge&logo=githubpages&logoColor=white" alt="GitHub Pages"/>
  <img src="https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white" alt="Netlify"/>
</p>

---

## Features

- **Multi-view dashboard**: Overview, Sales, Purchase, Assets, Reports, Settings. [file:11]
- **Theme toggle**: Dark/Light using `data-bs-theme` with custom styling. [file:11][file:12][file:13]
- **Motion preference**: Auto/Reduced motion behavior. [file:11][file:13]
- **Smart filters**: Period + Branch + Search + Type/Status filters for transactions. [file:11][file:13]
- **Charts that click-through**: Chart panels open related “IView” links (demo URL builder). [file:11][file:13]
- **Approvals queue** derived from transactions (Draft/Pending). [file:11][file:13]
- **CSV export** of the currently visible/filtered table. [file:13]
- Responsive sidebar (collapsible + mobile drawer). [file:12][file:13]
- Toasts, modals, dropdown notifications & profile menu (Bootstrap). [file:11][file:13]

---

## Demo credentials

Use any of these accounts (client-side only): [file:13]

| Email | Password | Role |
|------|----------|------|
| `admin@erp.local` | `admin123` | Admin |
| `student@erp.local` | `student123` | Student Developer |

---

## Run locally

This is a static project—no build step required. [file:11][file:13]

### Option A: Just open it
1. Download/clone the repo.  
2. Open `index.html` in your browser. [file:11]

### Option B: Run a local server (recommended)
Using VS Code:
1. Install “Live Server”.
2. Right-click `index.html` → **Open with Live Server**. [file:11]

---

## Project structure

├─ index.html # UI layout (login + app shell + views)
​
├─ styles.css # Theme + layout + component styling
​
└─ app.js # Demo auth, state, rendering, charts, events
​
---

## How “Axpert links” work (demo)

Buttons generate URLs like:
- `tstruct.aspx?transid=<eot>&recordid=<id>` (TStruct) [file:13]
- `iview.aspx?ivname=<ivname>` (IView) [file:13]

If running inside an Axpert container, it attempts `window.parent.createPopup(...)` when available; otherwise it uses `window.open(...)`. [file:13]

---

## Customization tips

- Update branding text (top-left) in `index.html` (brand title/subtitle). [file:11]
- Change theme colors in `:root` CSS variables inside `styles.css`. [file:12]
- Replace demo seeded data (transactions/analytics/notifications) in `seedData()` in `app.js`. [file:13]
- Adjust table pagination via `state.pageSize` in `app.js`. [file:13]

---


### 2️⃣ Run locally (no build needed)
Option A: Open `index.html` directly in browser.  

Option B (recommended): Use VS Code Live Server  
- Install the “Live Server” extension  
- Right-click `index.html` → **Open with Live Server**

---

## 🌍 Deployment

### GitHub Pages (fastest)
1. Push this repo to GitHub.
2. Go to **Settings → Pages**
3. Select branch: `main` and folder: `/root`
4. Your site will be live at:
   `https://YOUR_GITHUB_USERNAME.github.io/ERP-DASHBOARD/`

### Netlify (drag & drop)
1. Go to Netlify → **Add new site**
2. Drag-drop the project folder (must contain `index.html`)
3. Netlify gives a live `*.netlify.app` URL

---

## 📜 License

- **Code**: MIT License — see [`LICENSE`](LICENSE).  
- **Branding / non-code assets**: All Rights Reserved — see [`NOTICE`](NOTICE).

---

## 👨‍💻 Author

**YOUR NAME**  
🌐 LinkedIn: YOUR_LINKEDIN_URL

---

## 🧠 Learnings & Highlights

- Building a clean dashboard layout using Bootstrap utilities + custom CSS.
- Managing UI state (theme, motion, filters, sidebar) with LocalStorage.
- Rendering responsive charts and data-driven UI with Vanilla JS.

---

## 🏁 Future Enhancements

- 🔐 Real authentication (JWT / OAuth) + role-based access
- 📡 Real API integration (Axpert endpoints / backend)
- 📅 Date range picker + advanced filters
- 📄 PDF export for reports

## Badges

![Status](https://img.shields.io/badge/status-active-success?style=for-the-badgehttps://img.shields.io/badge/made%20with-vanilla%20js-yellow?stylehttps://img.shields.io/github/license/USERNAME/REPO?style=for-the-badge
