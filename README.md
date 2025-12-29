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

## Tech stack

- HTML5 + CSS3 + Vanilla JavaScript. [file:11][file:12][file:13]
- Bootstrap 5 + Bootstrap Icons (CDN). [file:11]
- Chart.js (CDN). [file:11][web:29]
- LocalStorage for theme/motion/sidebar + demo login state. [file:13]

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

