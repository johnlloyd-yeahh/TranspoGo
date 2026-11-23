/* ============================================================
   FILE: script.js
   ============================================================ */
(function () {
  "use strict";

  /* ---------- DOM REFS ---------- */
  const loginPage = document.getElementById("loginPage");
  const appPage = document.getElementById("appPage");
  const loginForm = document.getElementById("loginForm");
  const loginError = document.getElementById("loginError");

  /* ---------- ACCOUNTS ---------- */
  const accounts = [
    { username: "admin", password: "admin123", role: "admin" },
    { username: "user", password: "user123", role: "passenger" }
  ];

  /* ---------- LOCAL ROUTE DATABASE ---------- */
  const defaultRoutes = [
    { id: 101, origin: "Tuguegarao", destination: "Aparri", vehicle: "Bus", fare: 150 },
    { id: 102, origin: "Tuguegarao", destination: "Ilagan", vehicle: "Bus", fare: 120 },
    { id: 103, origin: "Tuguegarao", destination: "Enrile", vehicle: "Jeepney", fare: 40 },
    { id: 104, origin: "Tuguegarao", destination: "Solana", vehicle: "Jeepney", fare: 25 },
    { id: 105, origin: "Tuguegarao", destination: "Lallo", vehicle: "Bus", fare: 90 },
    { id: 106, origin: "Tuguegarao", destination: "Gattaran", vehicle: "Bus", fare: 60 },
    { id: 107, origin: "Tuguegarao", destination: "Santo Niño", vehicle: "Tricycle", fare: 30 },
    { id: 108, origin: "Tuguegarao", destination: "Baguio", vehicle: "Bus", fare: 750 },
    { id: 109, origin: "Tuguegarao", destination: "Manila", vehicle: "Bus", fare: 900 },
    { id: 110, origin: "Tuguegarao", destination: "Vigan", vehicle: "Bus", fare: 650 },
    { id: 201, origin: "Aparri", destination: "Tuguegarao", vehicle: "Bus", fare: 150 },
    { id: 202, origin: "Ilagan", destination: "Tuguegarao", vehicle: "Bus", fare: 120 },
    { id: 203, origin: "Enrile", destination: "Tuguegarao", vehicle: "Jeepney", fare: 40 },
    { id: 204, origin: "Solana", destination: "Tuguegarao", vehicle: "Jeepney", fare: 25 },
    { id: 205, origin: "Lallo", destination: "Tuguegarao", vehicle: "Bus", fare: 90 },
    { id: 206, origin: "Gattaran", destination: "Tuguegarao", vehicle: "Bus", fare: 60 },
    { id: 207, origin: "Santo Niño", destination: "Tuguegarao", vehicle: "Tricycle", fare: 30 },
    { id: 208, origin: "Baguio", destination: "Tuguegarao", vehicle: "Bus", fare: 750 },
    { id: 209, origin: "Manila", destination: "Tuguegarao", vehicle: "Bus", fare: 900 },
    { id: 210, origin: "Vigan", destination: "Tuguegarao", vehicle: "Bus", fare: 650 },
    { id: 301, origin: "Aparri", destination: "Ilagan", vehicle: "Bus", fare: 200 },
    { id: 302, origin: "Ilagan", destination: "Aparri", vehicle: "Bus", fare: 200 },
    { id: 303, origin: "Aparri", destination: "Lallo", vehicle: "Jeepney", fare: 60 },
    { id: 304, origin: "Lallo", destination: "Aparri", vehicle: "Jeepney", fare: 60 },
    { id: 305, origin: "Enrile", destination: "Solana", vehicle: "Tricycle", fare: 20 },
    { id: 306, origin: "Solana", destination: "Enrile", vehicle: "Tricycle", fare: 20 },
    { id: 307, origin: "Gattaran", destination: "Lallo", vehicle: "Bus", fare: 45 },
    { id: 308, origin: "Lallo", destination: "Gattaran", vehicle: "Bus", fare: 45 },
    { id: 309, origin: "Ilagan", destination: "Baguio", vehicle: "Bus", fare: 800 },
    { id: 310, origin: "Baguio", destination: "Ilagan", vehicle: "Bus", fare: 800 },
    { id: 311, origin: "Manila", destination: "Aparri", vehicle: "Bus", fare: 850 },
    { id: 312, origin: "Aparri", destination: "Manila", vehicle: "Bus", fare: 850 },
    { id: 313, origin: "Vigan", destination: "Manila", vehicle: "Bus", fare: 500 },
    { id: 314, origin: "Manila", destination: "Vigan", vehicle: "Bus", fare: 500 },
    { id: 401, origin: "Tuguegarao", destination: "Banaue", vehicle: "Bus", fare: 500 },
    { id: 402, origin: "Banaue", destination: "Tuguegarao", vehicle: "Bus", fare: 500 },
    { id: 403, origin: "Tuguegarao", destination: "Dagupan", vehicle: "Bus", fare: 600 },
    { id: 404, origin: "Dagupan", destination: "Tuguegarao", vehicle: "Bus", fare: 600 },
    { id: 405, origin: "Tuguegarao", destination: "Cebu", vehicle: "Bus", fare: 1800 },
    { id: 406, origin: "Cebu", destination: "Tuguegarao", vehicle: "Bus", fare: 1800 },
    { id: 407, origin: "Tuguegarao", destination: "Davao", vehicle: "Bus", fare: 2200 },
    { id: 408, origin: "Davao", destination: "Tuguegarao", vehicle: "Bus", fare: 2200 },
    { id: 409, origin: "Manila", destination: "Baguio", vehicle: "Bus", fare: 450 },
    { id: 410, origin: "Baguio", destination: "Manila", vehicle: "Bus", fare: 450 },
    { id: 411, origin: "Manila", destination: "Ilagan", vehicle: "Bus", fare: 700 },
    { id: 412, origin: "Ilagan", destination: "Manila", vehicle: "Bus", fare: 700 },
    { id: 413, origin: "Aparri", destination: "Vigan", vehicle: "Bus", fare: 800 },
    { id: 414, origin: "Vigan", destination: "Aparri", vehicle: "Bus", fare: 800 }
  ];

  /* ---------- STATE ---------- */
  let routes = [];
  let currentUser = null;
  let searchAbortController = null;
  let fareAbortController = null;

  /* ---------- API CONFIG ---------- */
  const API_ENDPOINT = "https://oxford.uk.eu.org/ai/oxford";
  const API_TIMEOUT_MS = 75000;

  /* ---------- STORAGE ---------- */
  function loadRoutes() {
    try {
      const saved = localStorage.getItem("transpogo_routes_v9");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const valid = parsed.every(
            (r) =>
              r &&
              typeof r.id !== "undefined" &&
              typeof r.origin === "string" &&
              typeof r.destination === "string" &&
              typeof r.vehicle === "string" &&
              typeof r.fare === "number"
          );
          if (valid) return parsed;
        }
      }
    } catch (e) {
      console.warn("Could not load routes:", e);
    }
    return JSON.parse(JSON.stringify(defaultRoutes));
  }

  function saveRoutes() {
    try {
      localStorage.setItem("transpogo_routes_v9", JSON.stringify(routes));
    } catch (e) {
      console.warn("Could not save routes:", e);
    }
  }

  /* ---------- UTILS ---------- */
  function escapeHTML(v) {
    return String(v).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] || c;
    });
  }

  /* ============================================================
     ROBUST JSON PARSER (handles valid + truncated JSON)
     ============================================================ */
  function repairAndParseJSON(text) {
    if (!text) return null;
    let t = String(text).trim();

    // Strip markdown code fences
    t = t.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();

    // Find first { and last } (or end)
    const start = t.indexOf("{");
    if (start < 0) return null;
    let candidate = t.slice(start);

    // Remove trailing garbage after last }
    const lastClose = candidate.lastIndexOf("}");
    if (lastClose >= 0) {
      candidate = candidate.slice(0, lastClose + 1);
    }

    // Try direct parse
    try {
      return JSON.parse(candidate);
    } catch (e) {}

    // --- Repair truncated JSON ---
    // 1. If inside an unterminated string, close it
    let inString = false;
    let escaped = false;
    for (let i = 0; i < candidate.length; i++) {
      const ch = candidate[i];
      if (escaped) {
        escaped = false;
        continue;
      }
      if (ch === "\\") {
        escaped = true;
        continue;
      }
      if (ch === '"') {
        inString = !inString;
      }
    }
    if (inString) {
      candidate += '"';
    }

    // 2. Remove trailing comma
    candidate = candidate.replace(/,\s*$/, "");

    // 3. Count unclosed brackets/braces (ignoring those inside strings)
    let depthBrace = 0,
      depthBracket = 0;
    inString = false;
    escaped = false;
    for (let i = 0; i < candidate.length; i++) {
      const ch = candidate[i];
      if (escaped) {
        escaped = false;
        continue;
      }
      if (ch === "\\") {
        escaped = true;
        continue;
      }
      if (ch === '"') {
        inString = !inString;
        continue;
      }
      if (inString) continue;
      if (ch === "{") depthBrace++;
      else if (ch === "}") depthBrace--;
      else if (ch === "[") depthBracket++;
      else if (ch === "]") depthBracket--;
    }

    // Close any remaining open brackets/braces
    while (depthBracket > 0) {
      candidate += "]";
      depthBracket--;
    }
    while (depthBrace > 0) {
      candidate += "}";
      depthBrace--;
    }

    try {
      return JSON.parse(candidate);
    } catch (e) {
      return null;
    }
  }

  /* ============================================================
     LINE PARSER — extract route fields from plain text
     ============================================================ */
  function parseRoutesFromText(text) {
    if (!text) return [];
    const raw = String(text);

    // Normalize: split into "blocks" by --- or double newline or numbered items
    let blocks = raw.split(/\n\s*[-=]{2,}\s*\n/);
    if (blocks.length <= 1) {
      const numbered = raw.split(/\n(?=(?:Route\s*\d+|Option\s*\d+|\d+\.)\s*[:.-])/i);
      if (numbered.length > 1) blocks = numbered;
    }
    if (blocks.length <= 1) {
      const dbl = raw.split(/\n\s*\n/);
      if (dbl.length > 1) blocks = dbl;
    }
    if (blocks.length <= 1) {
      const bullets = raw.split(/\n(?=[-*•]\s)/);
      if (bullets.length > 1) blocks = bullets;
    }

    const results = [];
    for (const block of blocks) {
      const b = block.trim();
      if (!b || b.length < 10) continue;

      const obj = {};
      const fieldRe = /^\s*(?:[-*•]\s*)?([A-Za-z_ ]{2,20})\s*[:=\-]\s*(.+)$/gm;
      let m;
      while ((m = fieldRe.exec(b)) !== null) {
        const key = m[1].trim().toLowerCase().replace(/\s+/g, "");
        const val = m[2].trim();
        if (!val) continue;
        if (key.includes("origin") || key === "from") obj.origin = val;
        else if (key.includes("destination") || key === "to") obj.destination = val;
        else if (key.includes("vehicle") || key.includes("transport")) obj.vehicle = val;
        else if (key.includes("fare") || key.includes("cost") || key.includes("price")) {
          const num = parseFloat(val.replace(/[^\d.]/g, ""));
          if (Number.isFinite(num)) obj.fare = num;
        } else if (key.includes("traveltime") || key.includes("duration") || key.includes("time"))
          obj.travelTime = val;
        else if (key.includes("transfer") || key.includes("connection")) obj.transfers = val;
        else if (key.includes("note") || key.includes("tip") || key.includes("advice")) obj.note = val;
        else if (key.includes("additional") || key.includes("extra")) obj.additionalCosts = val;
        else if (key.includes("route") || key.includes("way")) obj.route = val;
        else if (key.includes("total")) {
          const num = parseFloat(val.replace(/[^\d.]/g, ""));
          if (Number.isFinite(num)) obj.totalFare = num;
        }
      }

      // Also try to capture "X → Y" or "X to Y" arrow lines for origin/destination
      if (!obj.origin || !obj.destination) {
        const arrowMatch = b.match(
          /([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\s,.'-]{2,40}?)\s*(?:→|->|to)\s*([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\s,.'-]{2,40})/i
        );
        if (arrowMatch) {
          if (!obj.origin) obj.origin = arrowMatch[1].trim();
          if (!obj.destination) obj.destination = arrowMatch[2].trim();
        }
      }

      if (obj.origin || obj.destination || obj.vehicle || obj.fare != null) {
        results.push(obj);
      }
    }

    return results;
  }

  /* ============================================================
     SPLIT raw text into paragraph cards (last resort)
     ============================================================ */
  function splitIntoParagraphCards(text) {
    if (!text) return [];
    const chunks = String(text)
      .split(/\n\s*\n/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    if (chunks.length <= 1) {
      const lines = String(text)
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
      if (lines.length > 1) return lines;
    }
    return chunks;
  }

  /* ---------- LOGIN ---------- */
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    const account = accounts.find((a) => a.username === username && a.password === password);
    if (!account) {
      loginError.textContent = "Invalid username or password. Please try again.";
      return;
    }

    currentUser = account;
    loginError.textContent = "";

    try {
      sessionStorage.setItem(
        "transpogo_user",
        JSON.stringify({ username: account.username, role: account.role })
      );
    } catch (e) {}

    showApplication();
  });

  /* ---------- SHOW APP ---------- */
  function showApplication() {
    loginPage.classList.add("hidden");
    appPage.classList.remove("hidden");

    const roleLabel = currentUser.role === "admin" ? "Admin" : "Passenger";
    document.getElementById("welcomeUser").textContent =
      currentUser.username + " \u00B7 " + roleLabel;

    document.querySelectorAll(".admin-only").forEach((btn) => {
      btn.classList.toggle("hidden", currentUser.role !== "admin");
    });

    updateDashboard();
    showPage("dashboard");
  }

  /* ---------- LOGOUT ---------- */
  document.getElementById("logoutBtn").addEventListener("click", function () {
    try {
      sessionStorage.removeItem("transpogo_user");
    } catch (e) {}
    currentUser = null;
    appPage.classList.add("hidden");
    loginPage.classList.remove("hidden");
    loginForm.reset();
    loginError.textContent = "";
    cancelSearch();
    cancelFare();
  });

  /* ---------- RESTORE SESSION ---------- */
  (function restoreSession() {
    let savedUser = null;
    try {
      savedUser = sessionStorage.getItem("transpogo_user");
    } catch (e) {}
    if (!savedUser) return;
    try {
      const user = JSON.parse(savedUser);
      const valid = accounts.find((a) => a.username === user.username && a.role === user.role);
      if (valid) {
        currentUser = valid;
        showApplication();
      } else {
        sessionStorage.removeItem("transpogo_user");
      }
    } catch (e) {
      sessionStorage.removeItem("transpogo_user");
    }
  })();

  /* ---------- NAVIGATION ---------- */
  function showPage(pageId) {
    if (pageId === "manage" && (!currentUser || currentUser.role !== "admin")) return;

    document.querySelectorAll(".content-page").forEach((p) => p.classList.add("hidden"));
    const selected = document.getElementById(pageId);
    if (selected) selected.classList.remove("hidden");

    document.querySelectorAll(".nav-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.page === pageId);
    });

    if (pageId === "manage") displayAdminRoutes();
    if (pageId === "dashboard") updateDashboard();
  }

  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => showPage(btn.dataset.page));
  });

  document.querySelectorAll("[data-go]").forEach((btn) => {
    btn.addEventListener("click", () => showPage(btn.dataset.go));
  });

  /* ---------- DASHBOARD ---------- */
  function updateDashboard() {
    document.getElementById("totalRoutes").textContent = routes.length;
  }

  /* ============================================================
     ROUTE SEARCH
     ============================================================ */
  const routeResults = document.getElementById("routeResults");
  const searchRouteBtn = document.getElementById("searchRouteBtn");
  const cancelSearchBtn = document.getElementById("cancelSearchBtn");

  function buildSearchPrompt(origin, destination) {
    const ref = routes
      .map((r) => `${r.origin} -> ${r.destination} (${r.vehicle}, PHP ${r.fare})`)
      .join("\n");

    return (
      "You are a transportation route expert for the Philippines. " +
      "A user wants to travel from \"" +
      origin +
      "\" to \"" +
      destination +
      "\".\n\n" +
      "Here is the local route database for reference:\n" +
      ref +
      "\n\n" +
      "Reply with ONLY a valid JSON object, no markdown, no code fences. " +
      "Use this exact shape:\n" +
      '{"routes":[{"origin":"","destination":"","vehicle":"","fare":0,"travelTime":"","transfers":"","note":""}]}\n' +
      "Provide 1-3 route options. Keep each field SHORT: vehicle <= 8 words, travelTime <= 10 words, note <= 25 words. " +
      'If no route is possible, return {"routes":[],"error":"reason"}.'
    );
  }

  function cancelSearch() {
    if (searchAbortController) {
      searchAbortController.abort();
      searchAbortController = null;
    }
    searchRouteBtn.disabled = false;
    searchRouteBtn.innerHTML =
      '<svg class="icon icon-sm" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.5" y2="16.5"/></svg> Find Route';
    cancelSearchBtn.classList.add("hidden");
    routeResults.innerHTML = `
      <div class="empty-message">
        <svg class="icon icon-lg" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.5" y2="16.5"/></svg>
        <span>Search cancelled. Enter locations and try again.</span>
      </div>
    `;
  }

  function renderSkeleton(count) {
    let html = '<div class="skeleton-grid">';
    for (let i = 0; i < count; i++) {
      html += `<div class="skeleton-card">
        <div class="skeleton-line w60"></div>
        <div class="skeleton-line w80"></div>
        <div class="skeleton-line w40"></div>
        <div class="skeleton-line w80"></div>
        <div class="skeleton-line w60"></div>
      </div>`;
    }
    html += "</div>";
    routeResults.innerHTML = html;
  }

  function buildRouteCard(r) {
    const origin = r.origin || "";
    const destination = r.destination || "";
    const vehicle = r.vehicle || "—";
    const fare = Number(r.fare);
    const travelTime = r.travelTime || "—";
    const transfers = r.transfers || "None";
    const note = r.note || "";
    const title =
      origin || destination
        ? `${escapeHTML(origin || "?")} → ${escapeHTML(destination || "?")}`
        : "Route Information";

    return `
      <div class="result-card">
        <div class="result-card-header">
          <div class="route-icon">
            <svg class="icon" viewBox="0 0 24 24"><circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h6a4 4 0 0 0 4-4V9"/><path d="M16 5H9a4 4 0 0 0-4 4v3"/></svg>
          </div>
          <div class="route-title">
            ${title}
            <small>${escapeHTML(vehicle)}</small>
          </div>
        </div>
        <div class="result-row">
          <span class="result-label"><svg class="icon icon-sm" viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/></svg>Fare</span>
          <span class="result-value fare">${Number.isFinite(fare) && fare > 0 ? "₱" + fare.toFixed(2) : "—"}</span>
        </div>
        <div class="result-row">
          <span class="result-label"><svg class="icon icon-sm" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>Travel Time</span>
          <span class="result-value">${escapeHTML(travelTime)}</span>
        </div>
        <div class="result-row">
          <span class="result-label"><svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M16 3h5v5"/><path d="M8 3H3v5"/><path d="M21 16v5h-5"/><path d="M3 16v5h5"/></svg>Transfers</span>
          <span class="result-value">${escapeHTML(transfers)}</span>
        </div>
        ${
          note
            ? `<div class="result-note">
          <svg class="icon icon-sm" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
          <span>${escapeHTML(note)}</span>
        </div>`
            : ""
        }
        <div class="result-actions">
          <button class="btn-secondary" data-estimate-origin="${escapeHTML(origin)}" data-estimate-dest="${escapeHTML(destination)}">
            <svg class="icon icon-sm" viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/></svg>
            Estimate Fare
          </button>
        </div>
      </div>
    `;
  }

  function renderRouteCards(parsedData, rawText) {
    // Tier 1: valid JSON routes array
    let routeList = null;
    if (parsedData && Array.isArray(parsedData.routes)) {
      routeList = parsedData.routes.filter((r) => r && (r.origin || r.destination || r.vehicle));
    }

    // Tier 2: line parser from raw text
    if ((!routeList || routeList.length === 0) && rawText) {
      const fromText = parseRoutesFromText(rawText);
      if (fromText.length > 0) routeList = fromText;
    }

    // Tier 3: paragraph splitting (always produces cards)
    if (!routeList || routeList.length === 0) {
      if (parsedData && parsedData.error) {
        routeResults.innerHTML = `<div class="ai-error">
          <svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span>${escapeHTML(parsedData.error)}</span>
        </div>`;
        return;
      }
      const chunks = splitIntoParagraphCards(rawText || "No details available.");
      routeResults.innerHTML = chunks
        .map((c) => `<div class="paragraph-card">${escapeHTML(c)}</div>`)
        .join("");
      return;
    }

    const cards = routeList.map(buildRouteCard).join("");
    routeResults.innerHTML = `<div class="route-grid">${cards}</div>`;

    // Wire Estimate Fare handoff
    routeResults.querySelectorAll("[data-estimate-origin]").forEach((btn) => {
      btn.addEventListener("click", function () {
        document.getElementById("fareOrigin").value = btn.dataset.estimateOrigin || "";
        document.getElementById("fareDestination").value = btn.dataset.estimateDest || "";
        showPage("fare");
        setTimeout(() => document.getElementById("calculateFareBtn").focus(), 100);
      });
    });
  }

  function renderError(message) {
    routeResults.innerHTML = `<div class="ai-error">
      <svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <span>${escapeHTML(message)}</span>
    </div>`;
  }

  async function findRoute() {
    const origin = document.getElementById("origin").value.trim();
    const destination = document.getElementById("destination").value.trim();

    if (!origin || !destination) {
      routeResults.innerHTML = `
        <div class="empty-message">
          <svg class="icon icon-lg" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.5" y2="16.5"/></svg>
          <span>Please enter both a starting point and a destination.</span>
        </div>
      `;
      return;
    }

    const prompt = buildSearchPrompt(origin, destination);
    if (prompt.length > 24000) {
      renderError("Input too long. Please use shorter location names.");
      return;
    }

    if (searchAbortController) searchAbortController.abort();
    searchAbortController = new AbortController();
    const controller = searchAbortController;
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

    searchRouteBtn.disabled = true;
    searchRouteBtn.innerHTML =
      '<div class="spinner" style="width:16px;height:16px;border-width:2px;border-top-color:#fff;border-color:rgba(255,255,255,0.3);"></div> Searching…';
    cancelSearchBtn.classList.remove("hidden");
    renderSkeleton(2);

    try {
      const res = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
          max_tokens: 1200
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      let data;
      try {
        data = await res.json();
      } catch {
        renderError("The service returned an unreadable response. Please try again.");
        return;
      }

      if (!res.ok) {
        if (res.status === 403) renderError("Service is available only in the Philippines.");
        else if (res.status === 429) renderError("Too many requests. Please wait a minute and try again.");
        else if (res.status === 413) renderError("Your request is too large. Please use shorter location names.");
        else if (res.status >= 500) renderError("The service is temporarily unavailable. Please try again shortly.");
        else renderError(data.error || "Something went wrong. Please try again.");
        return;
      }

      const reply = data.reply || data.assistant || "";
      if (!reply || !reply.trim()) {
        renderError("No response received. Please try different locations.");
        return;
      }

      const parsed = repairAndParseJSON(reply);
      renderRouteCards(parsed, reply);
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === "AbortError") renderError("Search timed out or was cancelled. Please try again.");
      else renderError("Network error. Please check your connection and try again.");
    } finally {
      if (searchAbortController === controller) {
        searchAbortController = null;
        searchRouteBtn.disabled = false;
        searchRouteBtn.innerHTML =
          '<svg class="icon icon-sm" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.5" y2="16.5"/></svg> Find Route';
        cancelSearchBtn.classList.add("hidden");
      }
    }
  }

  searchRouteBtn.addEventListener("click", findRoute);
  cancelSearchBtn.addEventListener("click", cancelSearch);

  ["origin", "destination"].forEach((id) => {
    document.getElementById(id).addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        if (!searchRouteBtn.disabled) findRoute();
      }
    });
  });

  /* ============================================================
     FARE CALCULATOR
     ============================================================ */
  const fareResult = document.getElementById("fareResult");
  const calculateBtn = document.getElementById("calculateFareBtn");
  const cancelFareBtn = document.getElementById("cancelFareBtn");

  function buildFarePrompt(origin, destination) {
    const ref = routes
      .map((r) => `${r.origin} -> ${r.destination} (${r.vehicle}, PHP ${r.fare})`)
      .join("\n");

    return (
      "You are a fare estimation expert for Philippine transportation. " +
      "A user wants to know the estimated fare from \"" +
      origin +
      "\" to \"" +
      destination +
      "\".\n\n" +
      "Here is the local route database for reference:\n" +
      ref +
      "\n\n" +
      "Reply with ONLY a valid JSON object, no markdown, no code fences. " +
      "Use this exact shape:\n" +
      '{"totalFare":0,"travelTime":"","route":"","breakdown":[{"item":"","cost":0}],"additionalCosts":"","note":""}\n' +
      'Keep fields SHORT. If no estimate is possible, return {"error":"reason"}.'
    );
  }

  function cancelFare() {
    if (fareAbortController) {
      fareAbortController.abort();
      fareAbortController = null;
    }
    calculateBtn.disabled = false;
    calculateBtn.innerHTML =
      '<svg class="icon icon-sm" viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/></svg> Calculate Fare';
    cancelFareBtn.classList.add("hidden");
    fareResult.innerHTML = `
      <div class="empty-message">
        <svg class="icon icon-lg" viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/></svg>
        <span>Enter two locations and click "Calculate Fare".</span>
      </div>
    `;
  }

  function renderFareSkeleton() {
    fareResult.innerHTML = `
      <div class="fare-stats">
        <div class="skeleton-card" style="height:130px;"></div>
        <div class="skeleton-card" style="height:130px;"></div>
        <div class="skeleton-card" style="height:130px;"></div>
      </div>
      <div class="skeleton-card" style="height:120px;"></div>
    `;
  }

  function renderFareCards(parsedData, rawText) {
    // Tier 1: valid JSON with totalFare
    if (parsedData && parsedData.error) {
      fareResult.innerHTML = `<div class="ai-error">
        <svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span>${escapeHTML(parsedData.error)}</span>
      </div>`;
      return;
    }

    if (parsedData && (parsedData.totalFare != null || parsedData.breakdown)) {
      const totalFare = Number(parsedData.totalFare);
      const travelTime = parsedData.travelTime || "—";
      const route = parsedData.route || "—";
      const breakdown = Array.isArray(parsedData.breakdown) ? parsedData.breakdown : [];
      const additionalCosts = parsedData.additionalCosts || "";
      const note = parsedData.note || "";

      const breakdownRows = breakdown
        .map((b) => {
          const cost = Number(b.cost);
          return `<div class="result-row">
            <span class="result-label">${escapeHTML(b.item || "Item")}</span>
            <span class="result-value">${Number.isFinite(cost) ? "₱" + cost.toFixed(2) : "—"}</span>
          </div>`;
        })
        .join("");

      fareResult.innerHTML = `
        <div class="fare-stats">
          <div class="fare-stat">
            <div class="fare-stat-icon">
              <svg class="icon" viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/></svg>
            </div>
            <div class="fare-stat-value">${Number.isFinite(totalFare) && totalFare > 0 ? "₱" + totalFare.toFixed(2) : "—"}</div>
            <div class="fare-stat-label">Total Fare</div>
          </div>
          <div class="fare-stat">
            <div class="fare-stat-icon">
              <svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div class="fare-stat-value">${escapeHTML(travelTime)}</div>
            <div class="fare-stat-label">Travel Time</div>
          </div>
          <div class="fare-stat">
            <div class="fare-stat-icon">
              <svg class="icon" viewBox="0 0 24 24"><circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h6a4 4 0 0 0 4-4V9"/><path d="M16 5H9a4 4 0 0 0-4 4v3"/></svg>
            </div>
            <div class="fare-stat-value" style="font-size:13px;">${escapeHTML(route)}</div>
            <div class="fare-stat-label">Route</div>
          </div>
        </div>
        <div class="result-card">
          <div class="result-card-header">
            <div class="route-icon">
              <svg class="icon" viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            </div>
            <div class="route-title">Fare Breakdown</div>
          </div>
          ${breakdownRows || '<div class="result-row"><span class="result-label">No breakdown available</span></div>'}
          ${
            additionalCosts
              ? `<div class="result-note">
            <svg class="icon icon-sm" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            <span>${escapeHTML(additionalCosts)}</span>
          </div>`
              : ""
          }
          ${
            note
              ? `<div class="result-note">
            <svg class="icon icon-sm" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            <span>${escapeHTML(note)}</span>
          </div>`
              : ""
          }
        </div>
      `;
      return;
    }

    // Tier 2: parse from raw text — look for a total fare
    const parsedRoutes = parseRoutesFromText(rawText || "");
    if (parsedRoutes.length > 0) {
      const first = parsedRoutes[0];
      const total = first.totalFare != null ? first.totalFare : first.fare;
      if (total != null || first.travelTime || first.vehicle) {
        fareResult.innerHTML = `
          <div class="fare-stats">
            <div class="fare-stat">
              <div class="fare-stat-icon">
                <svg class="icon" viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/></svg>
              </div>
              <div class="fare-stat-value">${total != null ? "₱" + Number(total).toFixed(2) : "—"}</div>
              <div class="fare-stat-label">Total Fare</div>
            </div>
            <div class="fare-stat">
              <div class="fare-stat-icon">
                <svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <div class="fare-stat-value">${escapeHTML(first.travelTime || "—")}</div>
              <div class="fare-stat-label">Travel Time</div>
            </div>
            <div class="fare-stat">
              <div class="fare-stat-icon">
                <svg class="icon" viewBox="0 0 24 24"><circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h6a4 4 0 0 0 4-4V9"/></svg>
              </div>
              <div class="fare-stat-value" style="font-size:13px;">${escapeHTML(first.vehicle || "—")}</div>
              <div class="fare-stat-label">Transport</div>
            </div>
          </div>
          ${
            first.note
              ? `<div class="result-card"><div class="result-note" style="margin-top:0;">
            <svg class="icon icon-sm" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            <span>${escapeHTML(first.note)}</span>
          </div></div>`
              : ""
          }
        `;
        return;
      }
    }

    // Tier 3: paragraph cards
    const chunks = splitIntoParagraphCards(rawText || "No details available.");
    fareResult.innerHTML = chunks
      .map((c) => `<div class="paragraph-card">${escapeHTML(c)}</div>`)
      .join("");
  }

  function renderFareError(message) {
    fareResult.innerHTML = `<div class="ai-error">
      <svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <span>${escapeHTML(message)}</span>
    </div>`;
  }

  async function calculateFare() {
    const origin = document.getElementById("fareOrigin").value.trim();
    const destination = document.getElementById("fareDestination").value.trim();

    if (!origin || !destination) {
      fareResult.innerHTML = `
        <div class="empty-message">
          <svg class="icon icon-lg" viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/></svg>
          <span>Please enter both a starting point and a destination.</span>
        </div>
      `;
      return;
    }

    const prompt = buildFarePrompt(origin, destination);
    if (prompt.length > 24000) {
      renderFareError("Input too long. Please use shorter location names.");
      return;
    }

    if (fareAbortController) fareAbortController.abort();
    fareAbortController = new AbortController();
    const controller = fareAbortController;
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

    calculateBtn.disabled = true;
    calculateBtn.innerHTML =
      '<div class="spinner" style="width:16px;height:16px;border-width:2px;border-top-color:#fff;border-color:rgba(255,255,255,0.3);"></div> Calculating…';
    cancelFareBtn.classList.remove("hidden");
    renderFareSkeleton();

    try {
      const res = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
          max_tokens: 800
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      let data;
      try {
        data = await res.json();
      } catch {
        renderFareError("The service returned an unreadable response. Please try again.");
        return;
      }

      if (!res.ok) {
        if (res.status === 403) renderFareError("Service is available only in the Philippines.");
        else if (res.status === 429) renderFareError("Too many requests. Please wait a minute and try again.");
        else if (res.status === 413) renderFareError("Your request is too large. Please use shorter location names.");
        else if (res.status >= 500) renderFareError("The service is temporarily unavailable. Please try again shortly.");
        else renderFareError(data.error || "Something went wrong. Please try again.");
        return;
      }

      const reply = data.reply || data.assistant || "";
      if (!reply || !reply.trim()) {
        renderFareError("No response received. Please try different locations.");
        return;
      }

      const parsed = repairAndParseJSON(reply);
      renderFareCards(parsed, reply);
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === "AbortError") renderFareError("Calculation timed out or was cancelled. Please try again.");
      else renderFareError("Network error. Please check your connection and try again.");
    } finally {
      if (fareAbortController === controller) {
        fareAbortController = null;
        calculateBtn.disabled = false;
        calculateBtn.innerHTML =
          '<svg class="icon icon-sm" viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/></svg> Calculate Fare';
        cancelFareBtn.classList.add("hidden");
      }
    }
  }

  calculateBtn.addEventListener("click", calculateFare);
  cancelFareBtn.addEventListener("click", cancelFare);

  ["fareOrigin", "fareDestination"].forEach((id) => {
    document.getElementById(id).addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        if (!calculateBtn.disabled) calculateFare();
      }
    });
  });

  /* ============================================================
     ADMIN ROUTE MANAGEMENT
     ============================================================ */
  document.getElementById("addRouteBtn").addEventListener("click", function () {
    const message = document.getElementById("manageMessage");

    if (!currentUser || currentUser.role !== "admin") {
      message.innerHTML =
        '<svg class="icon icon-sm" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> Admin access required.';
      message.className = "message error";
      return;
    }

    const origin = document.getElementById("newOrigin").value.trim();
    const destination = document.getElementById("newDestination").value.trim();
    const vehicle = document.getElementById("newVehicle").value;
    const fare = Number(document.getElementById("newFare").value);

    if (!origin || !destination || !Number.isFinite(fare) || fare <= 0) {
      message.innerHTML =
        '<svg class="icon icon-sm" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> Please complete all fields with a valid fare.';
      message.className = "message error";
      return;
    }

    routes.push({ id: Date.now(), origin, destination, vehicle, fare });
    saveRoutes();

    document.getElementById("newOrigin").value = "";
    document.getElementById("newDestination").value = "";
    document.getElementById("newFare").value = "";

    message.innerHTML =
      '<svg class="icon icon-sm" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> Route added successfully!';
    message.className = "message success";
    updateDashboard();
    displayAdminRoutes();
  });

  function displayAdminRoutes() {
    const list = document.getElementById("adminRouteList");
    if (!list) return;

    if (routes.length === 0) {
      list.innerHTML = `
        <div class="empty-message">
          <svg class="icon icon-lg" viewBox="0 0 24 24"><circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h6a4 4 0 0 0 4-4V9"/><path d="M16 5H9a4 4 0 0 0-4 4v3"/></svg>
          <span>No routes available.</span>
        </div>
      `;
      return;
    }

    list.innerHTML = routes
      .map(
        (r) => `
      <div class="admin-route">
        <div>
          <strong>${escapeHTML(r.origin)} → ${escapeHTML(r.destination)}</strong>
          <p>${escapeHTML(r.vehicle)} · ₱${Number(r.fare).toFixed(2)}</p>
        </div>
        <button class="delete-btn" data-delete="${r.id}">
          <svg class="icon icon-sm" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
          Delete
        </button>
      </div>
    `
      )
      .join("");

    list.querySelectorAll("[data-delete]").forEach((btn) => {
      btn.addEventListener("click", function () {
        if (!currentUser || currentUser.role !== "admin") return;
        const id = Number(btn.dataset.delete);
        routes = routes.filter((r) => r.id !== id);
        saveRoutes();
        updateDashboard();
        displayAdminRoutes();
      });
    });
  }

  /* ---------- INIT ---------- */
  routes = loadRoutes();
  if (!localStorage.getItem("transpogo_routes_v9")) saveRoutes();
  updateDashboard();

  if (currentUser && appPage.classList.contains("hidden")) showApplication();
})();