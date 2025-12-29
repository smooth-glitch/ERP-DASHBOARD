# Axpert ERP Admin Dashboard

A modern, responsive **ERP-style admin dashboard** built with HTML, CSS, and JavaScript—featuring a clean topbar + sidebar layout, multi-view navigation (Sales/Purchase/Assets/Reports/Settings), Chart.js analytics, and a smooth dark/light experience.

> Built as a front-end dashboard demo inspired by common Axpert ERP navigation patterns (TStruct / IView links).

---

## Preview

- Login screen + client-side demo auth (no backend).
- Overview KPIs with sparklines + interactive charts.
- Sales / Purchase / Assets analytics sections.
- Reports tiles + CSV export.
- Settings: Theme + Motion + Workspace actions.

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

- **Multi-view dashboard**: Overview, Sales, Purchase, Assets, Reports, Settings.
- **Theme toggle**: Dark/Light using `data-bs-theme` with custom styling.
- **Motion preference**: Auto/Reduced motion behavior.
- **Smart filters**: Period + Branch + Search + Type/Status filters for transactions.
- **Charts that click-through**: Chart panels open related “IView” links (demo URL builder).
- **Approvals queue** derived from transactions (Draft/Pending).
- **CSV export** of the currently visible/filtered table.
- Responsive sidebar (collapsible + mobile drawer).
- Toasts, modals, dropdown notifications & profile menu (Bootstrap).

---

## Demo credentials

Use any of these accounts (client-side only):

| Email | Password | Role |
|------|----------|------|
| `admin@erp.local` | `admin123` | admin |
| `student@erp.local` | `student123` | student developer |

---

## Run locally

This is a static project—no build step required.

### Option A: Just open it
1. Download/clone the repo.  
2. Open `index.html` in your browser.

### Option B: Run a local server (recommended)
Using VS Code:
1. Install “Live Server”.
2. Right-click `index.html` → **Open with Live Server**.

---

## Project structure

├─ index.html # UI layout (login + app shell + views)
​
├─ styles.css # Theme + layout + component styling
​
└─ app.js # Demo auth, state, rendering, charts, events
​
---

## How “Axpert links” work

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

## 📜 License

- **Code**: MIT License — see [`LICENSE`](LICENSE).  
- **Branding / non-code assets**: All Rights Reserved — see [`NOTICE`](NOTICE).

---

## 👨‍💻 Author

Arjun Sridhar  
🌐 LinkedIn: https://www.linkedin.com/in/arjun-sridhar-6466751b7

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
