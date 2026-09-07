(() => {
  "use strict";
  document.documentElement.classList.add("js");
  const routes = new Set([
    "about",
    "projects",
    "experience",
    "skills",
    "personal",
    "contact",
    "settings",
  ]);
  const menu = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".navigation");
  const exportButton = document.querySelector("[data-export-pdf]");
  const status = document.querySelector("[data-status]");
  const sidebarToggle = document.querySelector(".sidebar-toggle");
  const isMac = /Mac|iPhone|iPad/.test(navigator.platform);
  const themes = new Set(["light", "dark", "warm", "forest", "slate"]);
  const setTheme = (theme) => {
    if (!themes.has(theme)) theme = "light";
    document.documentElement.dataset.theme = theme;
    document.querySelectorAll("[data-theme-select]").forEach(select => {
      select.value = theme;
    });
    document.querySelectorAll("[data-theme-toggle]").forEach(button => {
      button.setAttribute("aria-checked", String(theme === "dark"));
    });
  };
  try {
    setTheme(
      localStorage.getItem("portfolio-theme") === "dark" ? "dark" : "light",
    );
  } catch {
    setTheme("light");
  }
  const toggleTheme = () => {
    const theme =
      document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    setTheme(theme);
    try {
      localStorage.setItem("portfolio-theme", theme);
    } catch {
      /* Theme works without storage. */
    }
    status.textContent = `${theme === "dark" ? "Dark" : "Light"} mode enabled.`;
  };
  document.addEventListener("change", event => {
    const select = event.target.closest("[data-theme-select]");
    if (!select || !themes.has(select.value)) return;
    setTheme(select.value);
    try { localStorage.setItem("portfolio-theme", select.value); } catch { /* Theme works without storage. */ }
    status.textContent = `${select.options[select.selectedIndex].text} theme enabled.`;
  });
  const headingFonts = {
    sans: "var(--font)",
    serif: 'Georgia, "Times New Roman", serif',
    mono: "var(--mono)",
  };
  let headingStyles = {};
  try {
    const saved = JSON.parse(
      localStorage.getItem("portfolio-heading-styles") || "{}",
    );
    if (saved && typeof saved === "object" && !Array.isArray(saved))
      headingStyles = saved;
  } catch {
    /* Invalid or unavailable saved preferences use defaults. */
  }
  const applyHeadingStyles = () => {
    for (let level = 1; level <= 4; level++) {
      const style = headingStyles[level];
      if (Object.hasOwn(headingFonts, style)) {
        document.documentElement.style.setProperty(
          `--heading-${level}-font`,
          headingFonts[style],
        );
      } else {
        delete headingStyles[level];
        document.documentElement.style.removeProperty(
          `--heading-${level}-font`,
        );
      }
    }
  };
  const readingDefaults = { smallText: false, fullWidth: false };
  let reading = { ...readingDefaults };
  try {
    const saved = JSON.parse(localStorage.getItem("portfolio-reading") || "{}");
    if (saved && typeof saved === "object") {
      reading.smallText = saved.smallText === true || (saved.smallText === undefined && saved.bodySize === 14);
      reading.fullWidth = saved.fullWidth === true;
    }
  } catch { /* Use default reading preferences. */ }
  const applyReading = () => {
    const root = document.documentElement;
    root.style.setProperty("--reading-size", reading.smallText ? "14px" : "15px");
    root.classList.toggle("reading-full-width", reading.fullWidth);
  };
  const saveReading = () => {
    try { localStorage.setItem("portfolio-reading", JSON.stringify(reading)); } catch { /* Controls work without storage. */ }
  };
  applyReading();
  const syncPreferences = () => {
    setTheme(document.documentElement.dataset.theme);
    document.querySelectorAll("[data-heading-style]").forEach((select) => {
      select.value = headingStyles[select.dataset.headingStyle] || "default";
    });
    document.querySelectorAll("[data-reading-toggle]").forEach(button => {
      button.setAttribute("aria-checked", String(button.dataset.readingToggle === "smallText" ? reading.smallText : reading.fullWidth));
    });
  };
  applyHeadingStyles();
  syncPreferences();
  const updateHeadingStyle = (event) => {
    const select = event.target.closest("[data-heading-style]");
    if (!select) return;
    headingStyles[select.dataset.headingStyle] = select.value;
    applyHeadingStyles();
    syncPreferences();
    try {
      localStorage.setItem(
        "portfolio-heading-styles",
        JSON.stringify(headingStyles),
      );
    } catch {
      /* Preferences still apply for this visit. */
    }
    status.textContent = `Heading ${select.dataset.headingStyle} style applied across the site.`;
  };
  document.addEventListener("input", updateHeadingStyle);
  document.addEventListener("change", updateHeadingStyle);
  const actions = document.querySelector(".page-actions");
  const actionsToggle = document.querySelector(".page-actions-toggle");
  const options = document.querySelector(".page-options");
  const closeOptions = (restoreFocus = false) => {
    options.hidden = true;
    actionsToggle.setAttribute("aria-expanded", "false");
    if (restoreFocus) actionsToggle.focus();
  };
  actions.hidden = false;
  actionsToggle.addEventListener("click", () => {
    const open = options.hidden;
    options.hidden = !open;
    actionsToggle.setAttribute("aria-expanded", String(open));
    if (open) options.querySelector("button").focus();
  });
  document.querySelector(".options-close").addEventListener("click", () => closeOptions(true));
  document.addEventListener("pointerdown", event => {
    if (!actions.contains(event.target)) closeOptions();
  });
  document.addEventListener("focusin", event => {
    if (!actions.contains(event.target)) closeOptions();
  });
  const shortcut = isMac ? "Cmd+B" : "Ctrl+B";
  sidebarToggle.setAttribute(
    "aria-keyshortcuts",
    isMac ? "Meta+B" : "Control+B",
  );
  const setSidebarCollapsed = (collapsed) => {
    document.documentElement.classList.toggle("sidebar-collapsed", collapsed);
    const label = collapsed ? "Expand Sidebar" : "Collapse Sidebar";
    sidebarToggle.setAttribute("aria-expanded", String(!collapsed));
    sidebarToggle.setAttribute("aria-label", label);
    sidebarToggle.querySelector(".sidebar-tooltip").textContent =
      `${label} (${shortcut})`;
  };
  try {
    setSidebarCollapsed(localStorage.getItem("sidebar-collapsed") === "true");
  } catch {
    /* Storage is optional. */
  }
  sidebarToggle.hidden = false;
  const toggleSidebar = () => {
    const collapsed =
      !document.documentElement.classList.contains("sidebar-collapsed");
    setSidebarCollapsed(collapsed);
    try {
      localStorage.setItem("sidebar-collapsed", String(collapsed));
    } catch {
      /* Keep the toggle usable without storage. */
    }
  };
  sidebarToggle.addEventListener("click", toggleSidebar);
  setSidebarCollapsed(
    document.documentElement.classList.contains("sidebar-collapsed"),
  );
  menu.hidden = false;
  exportButton.hidden = false;
  const closeMenu = () => {
    menu.setAttribute("aria-expanded", "false");
    navigation.classList.remove("is-open");
  };
  menu.addEventListener("click", () => {
    const expanded = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(expanded));
    navigation.classList.toggle("is-open", expanded);
  });
  document.addEventListener("keydown", (event) => {
    if (event.defaultPrevented || event.repeat) return;
    if (
      (isMac ? event.metaKey : event.ctrlKey) &&
      event.shiftKey &&
      !event.altKey &&
      event.code === "KeyL"
    ) {
      event.preventDefault();
      toggleTheme();
      return;
    }
    if (
      (isMac ? event.metaKey : event.ctrlKey) &&
      !event.altKey &&
      !event.shiftKey &&
      event.code === "KeyB" &&
      window.matchMedia("(min-width: 761px)").matches
    ) {
      event.preventDefault();
      toggleSidebar();
    }
    if (
      (isMac ? event.metaKey : event.ctrlKey) &&
      !event.altKey &&
      !event.shiftKey &&
      event.code === "KeyJ"
    ) {
      event.preventDefault();
      if (backgroundPanel.hidden) {
        backgroundPanel.hidden = false;
        backgroundLauncher.setAttribute("aria-expanded", "true");
        closeOptions();
        backgroundPanel.querySelector('[data-background-question]').focus();
      } else {
        closeBackground(true);
      }
      return;
    }
    if (event.key === "Escape" && !backgroundPanel.hidden) {
      event.preventDefault();
      closeBackground(true);
      return;
    }
    if (event.key === "Escape" && !options.hidden) {
      event.preventDefault();
      closeOptions(true);
      return;
    }
    if (event.key === "Escape") sidebarToggle.blur();
    if (
      event.key === "Escape" &&
      menu.getAttribute("aria-expanded") === "true"
    ) {
      closeMenu();
      menu.focus();
    }
  });
  const backgroundWidget = document.querySelector('.background-widget');
  const backgroundLauncher = document.querySelector('.background-launcher');
  const backgroundPanel = document.querySelector('.background-panel');
  const conversation = document.querySelector('.background-conversation');
  const backgroundAnswers = JSON.parse(document.querySelector('#background-answers').textContent);
  const closeBackground = (restoreFocus = false) => {
    backgroundPanel.hidden = true;
    backgroundLauncher.setAttribute('aria-expanded', 'false');
    if (restoreFocus) backgroundLauncher.focus();
  };
  backgroundWidget.hidden = false;
  backgroundLauncher.addEventListener('click', () => {
    const open = backgroundPanel.hidden;
    backgroundPanel.hidden = !open;
    backgroundLauncher.setAttribute('aria-expanded', String(open));
    if (open) {
      closeOptions();
      backgroundPanel.querySelector('[data-background-question]').focus();
    }
  });
  document.querySelector('.background-close').addEventListener('click', () => closeBackground(true));
  const backgroundTimers = new Map();
  backgroundPanel.addEventListener('click', event => {
    if (event.target.closest('[data-clear-background]')) {
      backgroundTimers.forEach(timer => clearTimeout(timer));
      backgroundTimers.clear();
      conversation.querySelectorAll('.background-turn').forEach(turn => turn.remove());
      status.textContent = 'Background conversation cleared.';
      return;
    }
    const button = event.target.closest('[data-background-question]');
    if (!button) return;
    const answer = backgroundAnswers[Number(button.dataset.backgroundQuestion)];
    if (!answer) return;
    const turn = document.createElement('article');
    turn.className = 'background-turn';
    turn.setAttribute('aria-atomic', 'true');
    const question = document.createElement('p');
    question.className = 'background-user';
    question.textContent = answer.question;
    const thinking = document.createElement('p');
    thinking.className = 'background-thinking';
    thinking.append('Thinking');
    const dots = document.createElement('span');
    dots.className = 'thinking-dots';
    dots.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement('span');
      dot.textContent = '.';
      dots.append(dot);
    }
    thinking.append(dots);
    turn.append(question, thinking);
    conversation.append(turn);
    if (conversation.querySelectorAll('.background-turn').length > 20) {
      const oldest = conversation.querySelector('.background-turn');
      clearTimeout(backgroundTimers.get(oldest));
      backgroundTimers.delete(oldest);
      oldest.remove();
    }
    conversation.scrollTop = turn.offsetTop - conversation.offsetTop;
    const timer = setTimeout(() => {
      backgroundTimers.delete(turn);
      if (!turn.isConnected) return;
      const reply = document.createElement('p');
      reply.className = 'background-answer';
      reply.textContent = answer.answer;
      thinking.replaceWith(reply);
      if (answer.href) {
        const link = document.createElement('a');
        link.href = answer.href;
        link.textContent = answer.linkLabel + ' →';
        link.className = 'background-answer-link';
        turn.append(link);
      }
      // Keep the newest answer visible without jumping away from older answers.
      if (turn === conversation.lastElementChild) {
        conversation.scrollTop = turn.offsetTop - conversation.offsetTop;
      }
    }, 3000);
    backgroundTimers.set(turn, timer);
  });
  const backToTop = document.querySelector('[data-back-to-top]');
  const updateBackToTop = () => { backToTop.hidden = window.scrollY < 500; };
  window.addEventListener('scroll', updateBackToTop, { passive: true });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    actionsToggle.focus({ preventScroll: true });
    updateBackToTop();
  });
  const syncProjectToggle = () => {
    const button = document.querySelector('[data-toggle-projects]');
    if (!button) return;
    const details = [...document.querySelectorAll('.project-item')];
    button.hidden = false;
    button.textContent = details.every(detail => detail.open) ? 'Collapse all' : 'Expand all';
  };
  document.addEventListener('toggle', event => {
    if (event.target.matches('.project-item')) syncProjectToggle();
  }, true);
  const revealSection = () => {
    if (!location.hash) return false;
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return false; }
    const section = document.getElementById(id);
    if (!section || !document.querySelector('#document').contains(section)) return false;
    if (section.matches('details')) section.open = true;
    const focusTarget = section.matches('details') ? section.querySelector('summary') : section.querySelector('h2, h1') || section;
    if (!focusTarget.hasAttribute('tabindex')) focusTarget.setAttribute('tabindex', '-1');
    focusTarget.focus({ preventScroll: true });
    section.scrollIntoView({ block: 'start', behavior: 'instant' });
    syncProjectToggle();
    updateBackToTop();
    return true;
  };
  syncProjectToggle();
  updateBackToTop();
  window.addEventListener('hashchange', revealSection);
  let request;
  async function navigate(url, push = true) {
    request?.abort();
    const controller = new AbortController();
    request = controller;
    try {
      const response = await fetch(url.pathname, { signal: controller.signal });
      if (!response.ok) throw new Error("Page unavailable");
      const next = new DOMParser().parseFromString(
        await response.text(),
        "text/html",
      );
      const page = next.querySelector("#document");
      if (!page || controller.signal.aborted) return;
      document.querySelector("#document").replaceWith(page);
      syncPreferences();
      document.title = next.title;
      for (const selector of [
        'meta[name="description"]',
        'meta[property="og:title"]',
        'meta[property="og:description"]',
        'link[rel="canonical"]',
      ]) {
        document
          .querySelector(selector)
          .replaceWith(next.querySelector(selector));
      }
      document.querySelector("[data-page-label]").textContent =
        next.querySelector("[data-page-label]").textContent;
      document.querySelectorAll(".nav-item").forEach((link) => {
        if (link.getAttribute("href") === "/" + page.dataset.route)
          link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
      });
      if (push) history.pushState({}, "", url.pathname + url.hash);
      closeMenu();
      closeOptions();
      closeBackground();
      syncProjectToggle();
      if (!revealSection()) {
        window.scrollTo(0, 0);
        page.querySelector("h1").focus({ preventScroll: true });
      }
      updateBackToTop();
      status.textContent = document.title;
    } catch (error) {
      if (error.name !== "AbortError") location.assign(url.href);
    }
  }
  document.addEventListener("click", async (event) => {
    if (event.target.closest('[data-toggle-projects]')) {
      const details = [...document.querySelectorAll('.project-item')];
      const open = !details.every(detail => detail.open);
      details.forEach(detail => { detail.open = open; });
      syncProjectToggle();
      status.textContent = open ? 'All projects expanded.' : 'All projects collapsed.';
      return;
    }
    const sectionLink = event.target.closest('[data-copy-section]');
    if (sectionLink && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
      event.preventDefault();
      try {
        await navigator.clipboard.writeText(sectionLink.href);
        sectionLink.textContent = 'Link copied';
        status.textContent = 'Section link copied to clipboard.';
        setTimeout(() => { sectionLink.textContent = 'Copy section link ↗'; }, 2000);
      } catch {
        history.pushState({}, '', sectionLink.href);
        revealSection();
        status.textContent = 'Copy is unavailable. The section link is now in the address bar for you to copy.';
      }
      return;
    }
    const readingToggle = event.target.closest("[data-reading-toggle]");
    if (readingToggle) {
      if (readingToggle.dataset.readingToggle === "smallText") reading.smallText = !reading.smallText;
      else reading.fullWidth = !reading.fullWidth;
      applyReading();
      syncPreferences();
      saveReading();
      return;
    }
    if (event.target.closest("[data-theme-toggle]")) {
      toggleTheme();
      return;
    }
    if (event.target.closest("[data-reset-preferences]")) {
      headingStyles = {};
      reading = { ...readingDefaults };
      applyReading();
      saveReading();
      applyHeadingStyles();
      setTheme("light");
      syncPreferences();
      try {
        localStorage.removeItem("portfolio-heading-styles");
        localStorage.setItem("portfolio-theme", "light");
      } catch {
        /* Reset remains usable without storage. */
      }
      status.textContent =
        "Appearance and reading preferences reset to defaults.";
      return;
    }
    const copy = event.target.closest("[data-copy-email]");
    if (copy) {
      try {
        await navigator.clipboard.writeText("chabau.kevin@gmail.com");
        copy.textContent = "Copied";
        status.textContent = "Email address copied to clipboard.";
        setTimeout(() => {
          copy.textContent = "Copy";
        }, 2000);
      } catch {
        status.textContent =
          "Could not copy. Select the email address to copy it manually.";
      }
      return;
    }
    const link = event.target.closest("a");
    if (
      !link ||
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      link.target ||
      link.hasAttribute("download")
    )
      return;
    const url = new URL(link.href);
    const route = url.pathname.replace(/^\/+|\/+$/g, "") || "about";
    if (
      url.origin !== location.origin ||
      url.search ||
      !routes.has(route)
    )
      return;
    if (url.hash && url.pathname === location.pathname) return;
    event.preventDefault();
    navigate(url);
  });
  window.addEventListener("popstate", () =>
    navigate(new URL(location.href), false),
  );
  let printState = null;
  const preparePrint = () => {
    if (printState) return;
    printState = [...document.querySelectorAll("#document details")].map(
      (detail) => [detail, detail.open],
    );
    printState.forEach(([detail]) => {
      detail.open = true;
    });
  };
  const restorePrint = () => {
    printState?.forEach(([detail, open]) => {
      detail.open = open;
    });
    printState = null;
  };
  window.addEventListener("beforeprint", preparePrint);
  window.addEventListener("afterprint", restorePrint);
  exportButton.addEventListener("click", () => {
    closeOptions(true);
    preparePrint();
    window.print();
  });
  // Keep bookmarks from the original portfolio working.
  const legacy = {
    "#Career": "experience",
    "#Projects": "projects",
    "#about": "about",
    "#contact": "contact",
  };
  if (legacy[location.hash]) {
    const url = new URL("/" + legacy[location.hash], location.origin);
    history.replaceState({}, "", url.pathname);
    navigate(url, false);
  } else {
    requestAnimationFrame(revealSection);
  }
})();
