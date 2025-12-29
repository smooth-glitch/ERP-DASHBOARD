(() => {
    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

    // =========================
    // Auth (client-side demo)
    // =========================
    const AUTH_KEY = "erpAuth"; // { user: { name, initials, email } }
    const DEMO_USERS = [
        { email: "admin@erp.local", password: "admin123", name: "Admin", initials: "AD" },
        { email: "student@erp.local", password: "student123", name: "Student Developer", initials: "SD" }
    ];

    function getAuth() {
        try {
            return JSON.parse(localStorage.getItem(AUTH_KEY) || "null");
        } catch {
            return null;
        }
    }

    function setAuth(authObj) {
        localStorage.setItem(AUTH_KEY, JSON.stringify(authObj));
    }

    function clearAuth() {
        localStorage.removeItem(AUTH_KEY);
    }

    // Prevent the browser from restoring old scroll position after reload/back.
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";

    const loginScreen = document.getElementById("loginScreen");
    const appRoot = document.getElementById("appRoot");

    function showLogin() {
        if (loginScreen) {
            loginScreen.hidden = false;
            loginScreen.style.display = "";
        }
        if (appRoot) {
            appRoot.hidden = true;
            appRoot.style.display = "none";
        }

        // Lock scroll while on login
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";

        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }

    function showApp() {
        if (loginScreen) {
            loginScreen.hidden = true;
            loginScreen.style.display = "none";
        }
        if (appRoot) {
            appRoot.hidden = false;
            appRoot.style.display = "";
        }

        // Unlock scroll for app
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";

        // Force top (twice to defeat any late layout/restore)
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: "auto" }));
    }

    function setUiUser(user) {
        const initials = user?.initials || "SD";
        const name = user?.name || "Student Developer";

        const a = $("#uiAvatarInitials");
        if (a) a.textContent = initials;

        const ma = $("#uiMiniAvatar");
        if (ma) ma.textContent = initials;

        const mn = $("#uiMiniName");
        if (mn) mn.textContent = name;

        const sa = $("#uiSettingsAvatar");
        if (sa) sa.textContent = initials;

        const sn = $("#uiSettingsName");
        if (sn) sn.textContent = name;
    }

    function wireLogin() {
        const form = $("#loginForm");
        if (!form) return;

        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const email = String($("#loginEmail")?.value || "").trim().toLowerCase();
            const pass = String($("#loginPassword")?.value || "");
            const err = $("#loginError");

            const user = DEMO_USERS.find((u) => u.email === email && u.password === pass);
            if (!user) {
                if (err) err.textContent = "Invalid credentials.";
                return;
            }

            setAuth({ user: { email: user.email, name: user.name, initials: user.initials } });

            // Reload so page boots directly into app
            window.location.replace(window.location.pathname + window.location.search);
        });
    }

    // =========================
    // App state
    // =========================
    const state = {
        theme:
            localStorage.getItem("erpTheme") ||
            document.documentElement.dataset.bsTheme ||
            "dark",
        motion: localStorage.getItem("erpMotion") || "auto",
        sidebarCollapsed: localStorage.getItem("erpSidebar") === "collapsed",
        sidebarOpenMobile: false,
        view: "dashboard",
        page: 1,
        pageSize: 7,
        filters: { type: "all", status: "all", q: "", period: "month" },
        data: {
            kpis: { sales: 0, purchase: 0, stock: 0, pending: 0 },
            approvals: [],
            txns: [],
            notifications: [],
            analytics: {
                supplierPurchases: [],
                itemPurchase: [],
                itemSales: [],
                assetAcq: [],
                monthlyPurchase: []
            }
        }
    };

    // =========================
    // Seed data
    // =========================
    function seedData() {
        function parseDMY(s) {
            if (!s) return new Date();
            const str = String(s).trim();
            if (str.includes("/")) {
                const [dd, mm, yyyy] = str.split("/").map(Number);
                return new Date(yyyy, mm - 1, dd);
            }
            const dd = Number(str.slice(0, 2));
            const mm = Number(str.slice(2, 4));
            const yyyy = Number(str.slice(4, 8));
            return new Date(yyyy, mm - 1, dd);
        }

        function calcAgeHrs(dateStr) {
            const d = parseDMY(dateStr);
            return Math.max(0, Math.round((Date.now() - d.getTime()) / 36e5));
        }

        const purchaseInvoices = [
            { id: "pinv0005", date: "10122025", supplier: "ABC Stationery Suppliers", total: 6832, status: "Posted" },
            { id: "pinv0006", date: "10122025", supplier: "Global IT Distributors", total: 58410, status: "Posted" },
            { id: "pinv0007", date: "10122025", supplier: "Metro Furnitures", total: 114460, status: "Posted" },
            { id: "pinv0008", date: "02122024", supplier: "Metro Furnitures", total: 21000, status: "Posted" },
            { id: "pinv0009", date: "06122023", supplier: "Global IT Distributors", total: 85259, status: "Posted" },
            { id: "pinv0010", date: "03032022", supplier: "ABC Stationery Suppliers", total: 612, status: "Posted" },
            { id: "pinv0011", date: "10092025", supplier: "Metro Furnitures", total: 9450, status: "Posted" },
            { id: "pinv0012", date: "12122025", supplier: "Metro Furnitures", total: 10200, status: "Draft" },
            { id: "pinv0013", date: "19122025", supplier: "Global IT Distributors", total: 2040, status: "Posted" }
        ];

        const salesInvoices = [
            { id: "sinv000010", date: "10122025", customer: "City Bookstore", total: 8662, status: "Posted" },
            { id: "sinv000011", date: "10122025", customer: "Campus Library Services", total: 31388, status: "Posted" },
            { id: "sinv000012", date: "10122025", customer: "GreenLeaf Interiors", total: 80240, status: "Posted" },
            { id: "sinv000013", date: "11122025", customer: "GreenLeaf Interiors", total: 10600, status: "Posted" },
            { id: "sinv000014", date: "19122025", customer: "City Bookstore", total: 102, status: "Draft" }
        ];

        state.data.txns = [
            ...salesInvoices.map((x) => ({
                doc: x.id.toUpperCase(),
                type: "Sales Invoice",
                party: x.customer,
                amount: x.total,
                status: x.status,
                date: parseDMY(x.date).toISOString(),
                ageHrs: calcAgeHrs(x.date),
                open: { type: "tstruct", eot: "sinv", recordid: x.id }
            })),
            ...purchaseInvoices.map((x) => ({
                doc: x.id.toUpperCase(),
                type: "Purchase Invoice",
                party: x.supplier,
                amount: x.total,
                status: x.status,
                date: parseDMY(x.date).toISOString(),
                ageHrs: calcAgeHrs(x.date),
                open: { type: "tstruct", eot: "pinv", recordid: x.id }
            }))
        ].sort((a, b) => a.ageHrs - b.ageHrs);

        state.data.analytics = {
            supplierPurchases: [
                { supplierId: "s0004", supplierName: "Metro Furnitures", invoiceCount: 4, totalAmount: 155110 },
                { supplierId: "s0003", supplierName: "Global IT Distributors", invoiceCount: 3, totalAmount: 145709 },
                { supplierId: "s0002", supplierName: "ABC Stationery Suppliers", invoiceCount: 2, totalAmount: 7444 }
            ],
            itemPurchase: [
                { name: "Mechanical Keyboard", qty: 7, amount: 81200 },
                { name: "Reading Table", qty: 8, amount: 61360 },
                { name: "Library Study Chair", qty: 25, amount: 53100 },
                { name: "Laser Printer", qty: 2, amount: 35400 },
                { name: "UPS 1 KVA", qty: 3, amount: 23010 },
                { name: "Gaming Chair", qty: 4, amount: 21000 },
                { name: "Timber Logs", qty: 10, amount: 10200 },
                { name: "Round Office Table", qty: 3, amount: 9450 },
                { name: "A4 Copier Paper", qty: 20, amount: 5824 },
                { name: "Brown Mech Switches", qty: 7, amount: 4060 },
                { name: "test", qty: 20, amount: 2040 },
                { name: "Ball Pens – Blue", qty: 5, amount: 1008 },
                { name: "Faber Castle Pencils", qty: 12, amount: 612 }
            ],
            itemSales: [
                { name: "Reading Table", qty: 5, amount: 41300 },
                { name: "Library Study Chair", qty: 15, amount: 38940 },
                { name: "Annual Membership Fee", qty: 1, amount: 29500 },
                { name: "Mechanical Laptop Mouse", qty: 5, amount: 10600 },
                { name: "Data Structures Textbook", qty: 10, amount: 5250 },
                { name: "Operating Systems Textbook", qty: 5, amount: 3413 },
                { name: "RFID Membership Cards", qty: 20, amount: 1888 },
                { name: "test", qty: 10, amount: 102 }
            ],
            assetAcq: [
                { vendor: "Global IT Distributors", amount: 275000, id: "acq0004" },
                { vendor: "NetConnect Solutions", amount: 90000, id: "acq0005" },
                { vendor: "City Motors", amount: 85000, id: "acq0006" },
                { vendor: "Metro Furnitures", amount: 120000, id: "acq0003" },
                { vendor: "SecureVision Systems", amount: 60000, id: "acq0007" },
                { vendor: "Metro Furnitures", amount: 45000, id: "acq0002" }
            ],
            monthlyPurchase: [
                { label: "Mar 2022", amount: 612, invoices: 1 },
                { label: "Dec 2023", amount: 85259, invoices: 1 },
                { label: "Dec 2024", amount: 21000, invoices: 1 },
                { label: "Sep 2025", amount: 9450, invoices: 1 },
                { label: "Dec 2025", amount: 191942, invoices: 5 }
            ]
        };

        // local notifications (demo)
        state.data.notifications = [
            { title: "PINV awaiting approval", sub: "Assigned to you • 2d old", isRead: false },
            { title: "MPUR updated", sub: "Monthly Purchase Summary refreshed", isRead: false },
            { title: "SINV pending", sub: "Customer Orion Retail", isRead: true }
        ];

        syncApprovalsFromTxns();
    }

    // =========================
    // Formatting
    // =========================
    const INR = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    });
    const COUNT = new Intl.NumberFormat("en-IN");

    function fmtAmount(v) {
        if (v === 0) return "—";
        return INR.format(v);
    }

    function fmtCount(v) {
        return COUNT.format(v ?? 0);
    }

    function fmtAge(ageHrs) {
        if (ageHrs < 24) return `${ageHrs}h`;
        const d = Math.floor(ageHrs / 24);
        return `${d}d`;
    }

    // =========================
    // Theme / Motion
    // =========================
    function applyTheme(theme) {
        state.theme = theme;
        document.documentElement.dataset.bsTheme = theme;
        localStorage.setItem("erpTheme", theme);

        const icon = $("#themeIcon");
        if (icon) icon.textContent = theme === "light" ? "🌙" : "☀️";
    }

    function applyMotion(mode) {
        state.motion = mode;
        document.documentElement.dataset.motion = mode;
        localStorage.setItem("erpMotion", mode);
    }

    function shouldReduceMotion() {
        if (state.motion === "reduced") return true;
        if (state.motion === "auto") {
            return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        }
        return false;
    }

    // =========================
    // Sidebar
    // =========================
    function applySidebarState() {
        document.body.classList.toggle("sidebar-collapsed", !!state.sidebarCollapsed);
        localStorage.setItem("erpSidebar", state.sidebarCollapsed ? "collapsed" : "expanded");
    }

    function toggleSidebarCollapse() {
        if (window.innerWidth <= 980) {
            state.sidebarOpenMobile = !state.sidebarOpenMobile;
            document.body.classList.toggle("sidebar-open", state.sidebarOpenMobile);
            return;
        }
        state.sidebarCollapsed = !state.sidebarCollapsed;
        applySidebarState();
    }

    // =========================
    // Period helpers
    // =========================
    function startOfPeriod(period, now = new Date()) {
        const y = now.getFullYear();
        const m = now.getMonth();
        if (period === "month") return new Date(y, m, 1);
        if (period === "quarter") return new Date(y, Math.floor(m / 3) * 3, 1);
        if (period === "year") return new Date(y, 0, 1);
        return null;
    }

    function inSelectedPeriod(txn) {
        const period = state.filters.period || "month";
        const start = startOfPeriod(period);
        if (!start) return true;
        if (!txn.date) return true;
        return new Date(txn.date) >= start;
    }

    function getPeriodTxns() {
        return state.data.txns.filter(inSelectedPeriod);
    }

    function syncSettingsUI() {
        $$("[data-theme-set]").forEach((b) =>
            b.classList.toggle("active", b.dataset.themeSet === state.theme)
        );
        $$("[data-motion]").forEach((b) =>
            b.classList.toggle("active", b.dataset.motion === state.motion)
        );

        const p = $("#periodSelect")?.selectedOptions?.[0]?.textContent;
        const br = $("#branchSelect")?.selectedOptions?.[0]?.textContent;

        if ($("#settingsPeriodLabel") && p) $("#settingsPeriodLabel").textContent = p;
        if ($("#settingsBranchLabel") && br) $("#settingsBranchLabel").textContent = br;
    }

    // =========================
    // Approvals derived from txns
    // =========================
    function syncApprovalsFromTxns() {
        const needsApproval = state.data.txns.filter(
            (t) => inSelectedPeriod(t) && ["Draft", "Pending"].includes(String(t.status || ""))
        );

        state.data.approvals = needsApproval.map((t) => ({
            id: `APR-${t.doc}`,
            title: t.type,
            sub: `${t.party} • ${fmtAmount(t.amount)}`,
            status: t.status,
            ageHrs: t.ageHrs,
            open: t.open
        }));
    }

    // =========================
    // Routing
    // =========================
    function setView(name) {
        state.view = name;

        $$(".nav-item").forEach((btn) =>
            btn.classList.toggle("active", btn.dataset.view === name)
        );
        $$(".view").forEach((v) =>
            v.classList.toggle("active", v.id === `view-${name}`)
        );

        if (window.innerWidth <= 980) {
            state.sidebarOpenMobile = false;
            document.body.classList.remove("sidebar-open");
        }

        requestAnimationFrame(() => renderChartsForView(name));
    }

    // =========================
    // Bootstrap dropdown helpers (close menus after actions)
    // =========================
    function hideDropdown(triggerId) {
        const btn = $(triggerId);
        if (!btn || !window.bootstrap?.Dropdown) return;
        const inst = window.bootstrap.Dropdown.getInstance(btn) || window.bootstrap.Dropdown.getOrCreateInstance(btn);
        inst.hide();
    }

    // =========================
    // Toast (Bootstrap)
    // =========================
    function toast(title, sub = "") {
        const region = $("#toastRegion");
        if (!region || !window.bootstrap?.Toast) return;

        const el = document.createElement("div");
        el.className = "toast";
        el.role = "status";
        el.ariaLive = "polite";
        el.ariaAtomic = "true";

        el.innerHTML = `
        <div class="toast-header">
          <strong class="me-auto">${escapeHtml(title)}</strong>
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">${escapeHtml(sub)}</div>
      `;

        region.appendChild(el);

        const t = window.bootstrap.Toast.getOrCreateInstance(el, { delay: 2600 });
        t.show();

        el.addEventListener("hidden.bs.toast", () => el.remove(), { once: true });
    }

    // =========================
    // Modal (Bootstrap)
    // =========================
    let modalPrimaryUrl = null;

    function openModal(title, body, primaryLabel = "Open", url = null) {
        const modalEl = $("#appModal");
        if (!modalEl || !window.bootstrap?.Modal) return;

        modalPrimaryUrl = url;

        const titleEl = $("#modalTitle");
        const bodyEl = $("#modalBody");
        const btn = $("#modalPrimaryBtn");

        if (titleEl) titleEl.textContent = title || "";
        if (bodyEl) bodyEl.innerHTML = body || "";

        if (btn) {
            btn.textContent = primaryLabel || "Open";
            btn.style.display = url ? "inline-flex" : "none";
        }

        const inst = window.bootstrap.Modal.getOrCreateInstance(modalEl, {
            backdrop: true,
            focus: true
        });
        inst.show();
    }

    function buildAxpertUrl({ type, eot, ivname, recordid = 0, chartid } = {}) {
        if (type === "tstruct") {
            return `tstruct.aspx?transid=${encodeURIComponent(eot)}&recordid=${encodeURIComponent(recordid)}&act=open&dummyload=false`;
        }
        if (type === "iview") {
            return `iview.aspx?ivname=${encodeURIComponent(ivname)}`;
        }
        if (type === "chart") {
            return `chart.aspx?chartid=${encodeURIComponent(chartid)}`;
        }
        return "";
    }

    function openAxpert(url) {
        if (!url) return;

        if (window.parent && typeof window.parent.createPopup === "function") {
            window.parent.createPopup(url, false, function () { }, null);
            return;
        }

        window.open(url, "_blank", "noopener,noreferrer");
    }

    // =========================
    // Rendering
    // =========================
    function setTodayLabel() {
        const el = $("#todayLabel");
        if (!el) return;
        const now = new Date();
        el.textContent = now.toLocaleString("en-IN", {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }

    function syncKpisFromTxns() {
        const rows = getPeriodTxns();

        const postedSales = rows.filter((t) => t.type === "Sales Invoice" && t.status === "Posted").length;
        const postedPurchase = rows.filter((t) => t.type === "Purchase Invoice" && t.status === "Posted").length;
        const uniqueParties = new Set(rows.map((t) => t.party)).size;
        const pending = rows.filter((t) => ["Draft", "Pending"].includes(String(t.status))).length;

        state.data.kpis = { sales: postedSales, purchase: postedPurchase, stock: uniqueParties, pending };
    }

    function animateCount(el, to) {
        if (!el) return;

        if (shouldReduceMotion()) {
            el.textContent = fmtCount(to);
            return;
        }

        const from = 0;
        const dur = 650;
        const start = performance.now();

        function tick(t) {
            const p = Math.min(1, (t - start) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            const val = Math.round(from + (to - from) * eased);
            el.textContent = fmtCount(val);
            if (p < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
    }

    function sparkBucketsFor(predicate, buckets = 9) {
        const now = new Date();
        const start =
            startOfPeriod(state.filters.period || "month", now) ||
            new Date(now.getFullYear(), now.getMonth(), 1);

        const startMs = start.getTime();
        const endMs = now.getTime();
        const span = Math.max(1, endMs - startMs);

        const arr = Array.from({ length: buckets }, () => 0);

        for (const t of getPeriodTxns()) {
            if (!predicate(t)) continue;

            const d = t.date ? new Date(t.date).getTime() : endMs;
            const p = Math.min(0.999999, Math.max(0, (d - startMs) / span));
            const idx = Math.min(buckets - 1, Math.floor(p * buckets));
            arr[idx] += 1;
        }

        for (let i = 1; i < arr.length; i++) arr[i] += arr[i - 1];
        return arr.every((v) => v === 0) ? Array.from({ length: buckets }, () => 0) : arr;
    }

    function renderSpark(canvasId, points, color) {
        const c = $("#" + canvasId);
        if (!c || !window.Chart) return;

        const ctx = c.getContext("2d");
        if (c.chart) c.chart.destroy();

        c.chart = new Chart(ctx, {
            type: "line",
            data: {
                labels: points.map((_, i) => i + 1),
                datasets: [{ data: points, borderColor: color, borderWidth: 2, pointRadius: 0, tension: 0.35 }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { enabled: false } },
                scales: { x: { display: false }, y: { display: false } }
            }
        });
    }

    function chartTheme() {
        const theme = document.documentElement.dataset.bsTheme || "dark";
        return {
            grid: theme === "light" ? "rgba(17,24,39,.12)" : "rgba(255,255,255,.12)",
            tick: theme === "light" ? "rgba(17,24,39,.70)" : "rgba(233,238,247,.75)"
        };
    }

    function attachChartOpen(canvas, fallbackIvname) {
        if (!canvas) return;
        const iv = canvas.dataset.ivname || fallbackIvname;
        if (!iv) return;
        canvas.style.cursor = "pointer";
        canvas.onclick = () => openAxpert(buildAxpertUrl({ type: "iview", ivname: iv }));
    }

    function renderKPIs() {
        syncKpisFromTxns();

        animateCount($("#kpiSales"), state.data.kpis.sales);
        animateCount($("#kpiPurchase"), state.data.kpis.purchase);
        animateCount($("#kpiStock"), state.data.kpis.stock);
        animateCount($("#kpiPending"), state.data.kpis.pending);

        const s1 = sparkBucketsFor((t) => t.type === "Sales Invoice" && t.status === "Posted");
        const s2 = sparkBucketsFor((t) => t.type === "Purchase Invoice" && t.status === "Posted");
        const s3 = sparkBucketsFor(() => true);

        renderSpark("sparkSales", s1, "rgba(48,212,255,.95)");
        renderSpark("sparkPurchase", s2, "rgba(124,92,255,.95)");
        renderSpark("sparkStock", s3, "rgba(255,176,32,.95)");
    }

    function renderMonthlyPurchaseChart() {
        const c = $("#chartMonthlyPurchase");
        if (!c || !window.Chart) return;

        const ctx = c.getContext("2d");
        if (c.chart) c.chart.destroy();

        const t = chartTheme();
        const rows = state.data.analytics.monthlyPurchase;

        c.chart = new Chart(ctx, {
            type: "line",
            data: {
                labels: rows.map((r) => r.label),
                datasets: [
                    {
                        label: "Total Amount",
                        data: rows.map((r) => r.amount),
                        borderColor: "rgba(124,92,255,.95)",
                        backgroundColor: "rgba(124,92,255,.15)",
                        tension: 0.35,
                        pointRadius: 3,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: t.tick } } },
                scales: {
                    x: { grid: { color: t.grid }, ticks: { color: t.tick } },
                    y: { grid: { color: t.grid }, ticks: { color: t.tick } }
                }
            }
        });

        attachChartOpen(c, "mpur");
    }

    function renderSupplierPurchaseChart() {
        const c = $("#chartSupplierPurchase");
        if (!c || !window.Chart) return;

        const ctx = c.getContext("2d");
        if (c.chart) c.chart.destroy();

        const t = chartTheme();
        const rows = state.data.analytics.supplierPurchases;

        c.chart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: rows.map((r) => r.supplierName),
                datasets: [
                    {
                        label: "Total Amount Invoiced",
                        data: rows.map((r) => r.totalAmount),
                        backgroundColor: "rgba(48,212,255,.35)",
                        borderColor: "rgba(48,212,255,.85)",
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: t.tick } } },
                scales: {
                    x: { grid: { color: t.grid }, ticks: { color: t.tick } },
                    y: { grid: { color: t.grid }, ticks: { color: t.tick } }
                }
            }
        });

        attachChartOpen(c, "psup");
    }

    function renderItemPurchaseChart() {
        const c = $("#chartItemPurchase");
        if (!c || !window.Chart) return;

        const ctx = c.getContext("2d");
        if (c.chart) c.chart.destroy();

        const t = chartTheme();
        const rows = [...state.data.analytics.itemPurchase].sort((a, b) => b.amount - a.amount);

        c.chart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: rows.map((r) => r.name),
                datasets: [
                    {
                        label: "Total Amount",
                        data: rows.map((r) => r.amount),
                        backgroundColor: "rgba(57,217,138,.30)",
                        borderColor: "rgba(57,217,138,.85)",
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: t.tick } } },
                scales: {
                    x: {
                        grid: { color: t.grid },
                        ticks: { color: t.tick, maxRotation: 50, minRotation: 20 }
                    },
                    y: { grid: { color: t.grid }, ticks: { color: t.tick } }
                }
            }
        });

        attachChartOpen(c, "ipur");
    }

    function renderItemSalesChart() {
        const c = $("#chartItemSales");
        if (!c || !window.Chart) return;

        const ctx = c.getContext("2d");
        if (c.chart) c.chart.destroy();

        const t = chartTheme();
        const rows = [...state.data.analytics.itemSales].sort((a, b) => b.amount - a.amount);

        c.chart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: rows.map((r) => r.name),
                datasets: [
                    {
                        label: "Total Amount",
                        data: rows.map((r) => r.amount),
                        backgroundColor: "rgba(255,176,32,.30)",
                        borderColor: "rgba(255,176,32,.90)",
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: t.tick } } },
                scales: {
                    x: { grid: { color: t.grid }, ticks: { color: t.tick, maxRotation: 50, minRotation: 20 } },
                    y: { grid: { color: t.grid }, ticks: { color: t.tick } }
                }
            }
        });

        attachChartOpen(c, "isales");
    }

    function renderAssetAcqChart() {
        const c = $("#chartAssetAcq");
        if (!c || !window.Chart) return;

        const ctx = c.getContext("2d");
        if (c.chart) c.chart.destroy();

        const t = chartTheme();

        const m = new Map();
        for (const r of state.data.analytics.assetAcq) {
            m.set(r.vendor, (m.get(r.vendor) || 0) + Number(r.amount || 0));
        }

        const labels = [...m.keys()];
        const values = labels.map((k) => m.get(k));

        c.chart = new Chart(ctx, {
            type: "bar",
            data: {
                labels,
                datasets: [
                    {
                        label: "Amount",
                        data: values,
                        backgroundColor: "rgba(124,92,255,.28)",
                        borderColor: "rgba(124,92,255,.85)",
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: t.tick } } },
                scales: {
                    x: { grid: { color: t.grid }, ticks: { color: t.tick } },
                    y: { grid: { color: t.grid }, ticks: { color: t.tick } }
                }
            }
        });

        attachChartOpen(c, "acqhist");
    }

    function renderChartsForView(viewName) {
        if (viewName === "dashboard") renderMonthlyPurchaseChart();
        if (viewName === "purchase") {
            renderSupplierPurchaseChart();
            renderItemPurchaseChart();
        }
        if (viewName === "sales") renderItemSalesChart();
        if (viewName === "assets") renderAssetAcqChart();
    }

    // =========================
    // Lists / table renderers
    // =========================
    function renderApprovals(targetId) {
        const host = $("#" + targetId);
        if (!host) return;

        host.innerHTML = "";

        if (!state.data.approvals.length) {
            host.innerHTML = `<div class="text-body-secondary small">No approvals in this period.</div>`;
            return;
        }

        for (const item of state.data.approvals) {
            const badgeCls =
                item.status === "Approved" ? "approved" :
                    item.status === "Draft" ? "draft" : "pending";

            const row = document.createElement("div");
            row.className = "list-row";
            row.tabIndex = 0;

            row.innerHTML = `
          <div class="list-row-left">
            <div class="list-row-title">${escapeHtml(item.id)} • ${escapeHtml(item.title)}</div>
            <div class="list-row-sub">${escapeHtml(item.sub)}</div>
          </div>
          <div class="list-row-right">
            <span class="badge ${escapeAttr(badgeCls)}">${escapeHtml(item.status)}</span>
            <button class="ghost-btn" data-approve="${escapeAttr(item.id)}" type="button">Review</button>
          </div>
        `;

            host.appendChild(row);
        }
    }

    function getFilteredTxns() {
        const { type, status, q } = state.filters;
        const qq = (q || "").trim().toLowerCase();

        return state.data.txns.filter((t) => {
            if (!inSelectedPeriod(t)) return false;
            if (type !== "all" && t.type !== type) return false;
            if (status !== "all" && String(t.status) !== String(status)) return false;

            if (!qq) return true;
            const hay = `${t.doc} ${t.type} ${t.party} ${t.status}`.toLowerCase();
            return hay.includes(qq);
        });
    }

    function renderTxns() {
        const tbody = $("#txnTbody");
        if (!tbody) return;

        const data = getFilteredTxns();
        const totalPages = Math.max(1, Math.ceil(data.length / state.pageSize));
        state.page = Math.min(state.page, totalPages);

        const start = (state.page - 1) * state.pageSize;
        const pageRows = data.slice(start, start + state.pageSize);

        tbody.innerHTML = pageRows
            .map((t) => {
                const badgeCls =
                    t.status === "Approved" ? "approved" :
                        t.status === "Draft" ? "draft" :
                            t.status === "Posted" ? "approved" : "pending";

                return `
            <tr data-doc="${escapeAttr(t.doc)}">
              <td>
                <button class="link" data-open-doc="${escapeAttr(t.doc)}" type="button">${escapeHtml(t.doc)}</button>
              </td>
              <td>${escapeHtml(t.type)}</td>
              <td>${escapeHtml(t.party)}</td>
              <td class="text-end">${escapeHtml(fmtAmount(t.amount))}</td>
              <td><span class="badge ${escapeAttr(badgeCls)}">${escapeHtml(t.status)}</span></td>
              <td class="text-end">${escapeHtml(fmtAge(t.ageHrs))}</td>
            </tr>
          `;
            })
            .join("");

        const countEl = $("#tableCount");
        if (countEl) {
            const from = data.length ? start + 1 : 0;
            const to = Math.min(start + state.pageSize, data.length);
            countEl.textContent = `${data.length} rows • showing ${from}-${to}`;
        }

        const meta = $("#pageMeta");
        if (meta) meta.textContent = `Page ${state.page} / ${totalPages}`;

        const prev = $("#prevPage");
        const next = $("#nextPage");
        if (prev) prev.disabled = state.page <= 1;
        if (next) next.disabled = state.page >= totalPages;
    }

    function renderSalesPanel() {
        const rows = getPeriodTxns().filter((t) => t.type === "Sales Invoice");
        const riskAmt = rows
            .filter((t) => t.status !== "Posted")
            .reduce((s, t) => s + Number(t.amount || 0), 0);

        const riskEl = $("#salesRisk");
        if (riskEl) riskEl.textContent = INR.format(riskAmt);

        const byCustomer = new Map();
        for (const t of rows) {
            if (t.status !== "Posted") continue;
            byCustomer.set(t.party, (byCustomer.get(t.party) || 0) + Number(t.amount || 0));
        }

        const top = [...byCustomer.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8);

        const host = $("#topCustomers");
        if (!host) return;

        host.innerHTML = top.length
            ? top
                .map(
                    ([name, total]) =>
                        `<span class="tag">${escapeHtml(name)} • ${escapeHtml(fmtAmount(total))}</span>`
                )
                .join("")
            : `<span class="tag text-body-secondary">No sales in this period</span>`;
    }

    function renderSupplierHealth() {
        const host = $("#supplierHealth");
        if (!host) return;

        const rows = getPeriodTxns().filter((t) => t.type === "Purchase Invoice");
        const map = new Map();

        for (const t of rows) {
            const key = t.party;
            if (!map.has(key)) map.set(key, { supplier: key, count: 0, total: 0, toReview: 0 });
            const o = map.get(key);
            o.count += 1;
            o.total += Number(t.amount || 0);
            if (t.status !== "Posted") o.toReview += 1;
        }

        const list = [...map.values()].sort((a, b) => b.total - a.total);

        if (!list.length) {
            host.innerHTML = `<div class="text-body-secondary small">No purchase invoices in this period.</div>`;
            return;
        }

        host.innerHTML = "";

        for (const s of list) {
            const badgeCls = s.toReview > 0 ? "pending" : "approved";
            const badgeText = s.toReview > 0 ? "Attention" : "Healthy";
            const note = `${s.count} invoices • ${fmtAmount(s.total)}${s.toReview ? ` • ${s.toReview} to review` : ""}`;

            const row = document.createElement("div");
            row.className = "list-row";

            row.innerHTML = `
          <div class="list-row-left">
            <div class="list-row-title">${escapeHtml(s.supplier)}</div>
            <div class="list-row-sub">${escapeHtml(note)}</div>
          </div>
          <div class="list-row-right">
            <span class="badge ${escapeAttr(badgeCls)}">${escapeHtml(badgeText)}</span>
            <button class="ghost-btn" data-open-obj="${escapeAttr(JSON.stringify({ type: "iview", ivname: "psup" }))}" type="button">
              Open
            </button>
          </div>
        `;

            host.appendChild(row);
        }
    }

    function renderAssetsPanel() {
        const el = $("#assetAdded");
        if (!el) return;
        el.textContent = String(state.data.analytics.assetAcq.length);
    }

    function renderNotifications() {
        const list = $("#notifyList");
        if (!list) return;

        const notes = state.data.notifications || [];
        list.innerHTML = notes.length
            ? notes
                .map(
                    (n) => `
                <div class="list-row" style="align-items:flex-start;">
                  <div class="list-row-left">
                    <div class="list-row-title">${escapeHtml(n.title)}</div>
                    <div class="list-row-sub">${escapeHtml(n.sub)}</div>
                  </div>
                </div>
              `
                )
                .join("")
            : `<div class="text-body-secondary small">No new notifications</div>`;

        const dot = $("#notifyDot");
        const unread = notes.filter((n) => !n.isRead).length;
        if (dot) dot.style.display = unread ? "block" : "none";
    }

    function exportVisibleTxns() {
        const rows = getFilteredTxns();
        const header = ["doc", "type", "party", "amount", "status", "agehours"];

        const csv = [
            header.join(","),
            ...rows.map((r) =>
                [r.doc, r.type, r.party, r.amount, r.status, r.ageHrs]
                    .map((v) => String(v ?? "").replaceAll(",", " "))
                    .join(",")
            )
        ].join("\n");

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "erp-transactions-export.csv";
        a.click();

        URL.revokeObjectURL(url);

        toast("Export ready", "Downloaded erp-transactions-export.csv");
    }

    // =========================
    // Events
    // =========================
    function wireEvents() {
        $("#sidebarToggle")?.addEventListener("click", toggleSidebarCollapse);

        $$(".nav-item").forEach((btn) =>
            btn.addEventListener("click", () => setView(btn.dataset.view))
        );

        document.addEventListener("click", (e) => {
            const jump = e.target.closest("[data-view-jump]");
            if (jump) setView(jump.dataset.viewJump);
        });

        $("#themeBtn")?.addEventListener("click", () => {
            applyTheme(state.theme === "light" ? "dark" : "light");
            renderChartsForView(state.view);
            renderKPIs();
            syncSettingsUI();
        });

        document.addEventListener("click", (e) => {
            const b = e.target.closest("[data-theme-set]");
            if (!b) return;
            applyTheme(b.dataset.themeSet);
            renderChartsForView(state.view);
            renderKPIs();
            syncSettingsUI();

            const themeName = b.dataset.themeSet === "light" ? "Light mode" : "Dark mode";
            toast("Theme updated", `Theme set to ${themeName}`);
        });

        document.addEventListener("click", (e) => {
            const b = e.target.closest("[data-motion]");
            if (!b) return;
            applyMotion(b.dataset.motion);
            syncSettingsUI();
        });

        $("#prefSidebarToggle")?.addEventListener("click", () => {
            state.sidebarCollapsed = !state.sidebarCollapsed;
            applySidebarState();
            toast("Layout updated", state.sidebarCollapsed ? "Sidebar collapsed" : "Sidebar expanded");
        });

        // Notifications actions
        $("#markReadBtn")?.addEventListener("click", () => {
            state.data.notifications.forEach((n) => (n.isRead = true));
            renderNotifications();
            toast("Done", "Notifications marked as read");
            hideDropdown("#notifyBtn");
        });

        // Profile menu actions (Settings/Export/Signout)
        document.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-action]");
            if (!btn) return;

            const a = btn.dataset.action;
            if (a === "open-settings") setView("settings");
            if (a === "export") exportVisibleTxns();
            if (a === "signout") {
                clearAuth();
                hideDropdown("#profileBtn");
                showLogin();
                wireLogin();
            } else {
                hideDropdown("#profileBtn");
            }
        });

        // Keyboard shortcut: "/" focuses search
        document.addEventListener("keydown", (e) => {
            const tag = document.activeElement?.tagName || "";
            const isTyping = /input|textarea|select/i.test(tag);
            if (e.key === "/" && !isTyping) {
                e.preventDefault();
                $("#globalSearch")?.focus();
            }
        });

        $("#periodSelect")?.addEventListener("change", (e) => {
            state.filters.period = e.target.value;
            state.page = 1;
            syncApprovalsFromTxns();
            renderKPIs();
            renderTxns();
            renderApprovals("approvalList");
            renderApprovals("approvalListReports");
            renderSalesPanel();
            renderSupplierHealth();
            renderAssetsPanel();
            renderChartsForView(state.view);
            syncSettingsUI();
        });

        $("#globalSearch")?.addEventListener("input", (e) => {
            state.filters.q = e.target.value;
            state.page = 1;
            renderTxns();
        });

        $("#txnTypeFilter")?.addEventListener("change", (e) => {
            state.filters.type = e.target.value;
            state.page = 1;
            renderTxns();
        });

        $("#txnStatusFilter")?.addEventListener("change", (e) => {
            state.filters.status = e.target.value;
            state.page = 1;
            renderTxns();
        });

        $("#prevPage")?.addEventListener("click", () => {
            state.page = Math.max(1, state.page - 1);
            renderTxns();
        });

        $("#nextPage")?.addEventListener("click", () => {
            state.page = state.page + 1;
            renderTxns();
        });

        // Approval review
        document.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-approve]");
            if (!btn) return;

            const id = btn.dataset.approve;
            const item = state.data.approvals.find((a) => a.id === id);
            if (!item) return;

            const url = item.open ? buildAxpertUrl(item.open) : "";
            openModal(
                item.id,
                `
            <div style="margin-bottom:10px">${escapeHtml(item.sub)}</div>
            <div style="padding:10px;border:1px solid rgba(255,255,255,.10);border-radius:12px;word-break:break-all;background:rgba(255,255,255,.04)">
              ${escapeHtml(url)}
            </div>
            <div class="text-body-secondary small" style="margin-top:10px">
              Opens using Axpert popup if available.
            </div>
          `,
                "Open",
                url
            );
        });

        // Doc open
        document.addEventListener("click", (e) => {
            const a = e.target.closest("[data-open-doc]");
            if (!a) return;

            const doc = a.dataset.openDoc;
            const tx = state.data.txns.find((t) => t.doc === doc);
            if (!tx) return;

            const url = tx.open ? buildAxpertUrl(tx.open) : "";
            openModal(
                tx.doc,
                `
            <div style="display:grid;gap:8px">
              <div><b>Party</b> ${escapeHtml(tx.party)}</div>
              <div><b>Amount</b> ${escapeHtml(fmtAmount(tx.amount))}</div>
              <div><b>Status</b> ${escapeHtml(tx.status)}</div>
            </div>
            <div style="margin-top:10px;padding:10px;border:1px solid rgba(255,255,255,.10);border-radius:12px;word-break:break-all;background:rgba(255,255,255,.04)">
              ${escapeHtml(url)}
            </div>
          `,
                "Open",
                url
            );
        });

        // Generic modal open/create buttons
        document.addEventListener("click", (e) => {
            const b = e.target.closest("[data-modal][data-type]");
            if (!b) return;

            const type = b.dataset.type; // tstruct | iview
            const eot = b.dataset.eot;
            const ivname = b.dataset.ivname;

            const url = buildAxpertUrl({ type, eot, ivname, recordid: 0 });
            const title = type === "tstruct" ? `Open TStruct: ${eot}` : `Open IView: ${ivname}`;

            openModal(
                title,
                `
            <div class="text-body-secondary small" style="margin-bottom:10px">Generated from your ERP link format.</div>
            <div style="padding:10px;border:1px solid rgba(255,255,255,.10);border-radius:12px;word-break:break-all;background:rgba(255,255,255,.04)">
              ${escapeHtml(url)}
            </div>
          `,
                "Open",
                url
            );
        });

        // Open object (used in Supplier Health list)
        document.addEventListener("click", (e) => {
            const b = e.target.closest("[data-open-obj]");
            if (!b) return;

            let obj = null;
            try {
                obj = JSON.parse(b.dataset.openObj);
            } catch {
                obj = null;
            }
            if (!obj) return;

            const url = buildAxpertUrl(obj);
            openAxpert(url);
            toast("Opening", url);
        });

        // Modal primary open
        $("#modalPrimaryBtn")?.addEventListener("click", () => {
            if (!modalPrimaryUrl) return;
            setTimeout(() => openAxpert(modalPrimaryUrl), 0);
            toast("Opening", "Launching Axpert screen");
        });

        // Refresh + export
        $("#refreshBtn")?.addEventListener("click", () => {
            toast("Refreshed", "Demo data re-rendered.");
            renderAll();
        });

        $("#exportBtn")?.addEventListener("click", exportVisibleTxns);

        // Scroll top
        const st = $("#scrollTop");
        window.addEventListener("scroll", () => {
            st?.classList.toggle("show", window.scrollY > 260);
        });
        st?.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: shouldReduceMotion() ? "auto" : "smooth" });
        });

        window.addEventListener("resize", () => {
            requestAnimationFrame(() => renderChartsForView(state.view));
        });
    }

    function renderAll() {
        renderNotifications();
        renderKPIs();
        renderChartsForView(state.view);
        renderApprovals("approvalList");
        renderApprovals("approvalListReports");
        renderTxns();
        renderSalesPanel();
        renderSupplierHealth();
        renderAssetsPanel();
        syncSettingsUI();
    }

    // =========================
    // Utils
    // =========================
    function escapeHtml(s) {
        return String(s ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function escapeAttr(s) {
        return escapeHtml(s).replaceAll("`", "&#096;");
    }

    // =========================
    // Boot
    // =========================
    let inited = false;

    function initAppOnce() {
        if (inited) {
            renderAll();
            return;
        }
        inited = true;

        seedData();

        applyTheme(state.theme);
        applyMotion(state.motion);

        if (state.sidebarCollapsed) applySidebarState();

        setTodayLabel();
        wireEvents();
        renderAll();
    }

    function boot() {
        const auth = getAuth();

        if (!auth?.user) {
            showLogin();
            wireLogin();
            return;
        }

        showApp();
        setUiUser(auth.user);
        initAppOnce();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot);
    } else {
        boot();
    }
})();
