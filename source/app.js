document.addEventListener("DOMContentLoaded", () => {
  document.body.style.backgroundImage = 'url("/bg/bg.png")';

  animateStatCounters();
  setupTocToggle();
  setupPaginatedGrids();
  setupAboutScrollReveal();
  setupCodeBlocks();

  const tabButtons = Array.from(document.querySelectorAll("[data-tab]"));
  const panels = Array.from(document.querySelectorAll("[data-tab-panel]"));
  const tabShell = document.querySelector(".skill-tabs-pill");
  if (tabShell) {
    const checkedTab = document.querySelector(".skill-tab-input:checked")?.dataset.tab || "skill";
    tabShell.dataset.activeTab = checkedTab;
  }

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const tab = button.dataset.tab;
      if (tabShell) tabShell.dataset.activeTab = tab;
      tabButtons.forEach((item) => {
        item.setAttribute("aria-selected", String(item.dataset.tab === tab));
      });
      panels.forEach((panel) => {
        const active = panel.dataset.tabPanel === tab;
        panel.hidden = !active;
        panel.classList.toggle("active", active);
      });
    });
  });

  const projectGrid = document.getElementById("projectRepoGrid");
  if (projectGrid) {
    loadProjects(projectGrid);
  }

  const projectCount = document.getElementById("projectCount");
  if (projectCount) {
    loadProjectCount(projectCount);
  }
});

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const fallbackProjects = [
  {
    name: "thanhhao06.github.io",
    description: "Personal portfolio website for sharing projects, CTF writeups, skills, and blog posts.",
    language: "CSS",
    stars: 0,
    forks: 0,
    url: "https://github.com/thanhhao06/thanhhao06.github.io"
  },
  {
    name: "Artifact-Collector",
    description: "A lightweight tool for collecting, organizing, and viewing extracted artifact/report files with a clean HTML interface.",
    language: "Python",
    stars: 0,
    forks: 0,
    url: "https://github.com/thanhhao06/Artifact-Collector"
  }
];

function renderProjectCards(container, projects) {
  container.innerHTML = projects.map((repo) => {
    const description = repo.description || "GitHub project";
    const language = repo.language ? `<span>${escapeHtml(repo.language)}</span>` : "";
    return `
      <article class="project-card reveal-item">
        <div class="project-card-top">
          <span class="project-card-icon" aria-hidden="true">↝</span>
          <a class="project-card-link" href="${repo.url}" target="_blank" rel="noopener">GitHub ↗</a>
        </div>
        <div class="project-card-body">
          <h2>${escapeHtml(repo.name)}</h2>
          <p>${escapeHtml(description)}</p>
        </div>
        <div class="project-card-meta">
          ${language}
          <span>★ ${repo.stars || 0}</span>
          <span>⑂ ${repo.forks || 0}</span>
        </div>
      </article>
    `;
  }).join("");
  setupSinglePaginatedGrid(container, document.querySelector('[data-pagination-for="project"]'));
}

async function loadProjects(container) {
  try {
    const response = await fetch("https://api.github.com/users/thanhhao06/repos?type=owner&sort=updated&direction=desc&per_page=100", {
      headers: { Accept: "application/vnd.github+json" }
    });
    if (!response.ok) throw new Error(`GitHub API ${response.status}`);
    const repos = await response.json();
    const visibleRepos = repos.filter((repo) => !repo.fork).map((repo) => ({
      name: repo.name,
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      url: repo.html_url
    }));
    renderProjectCards(container, visibleRepos.length ? visibleRepos : fallbackProjects);
  } catch (error) {
    console.error("Không tải được project:", error);
    renderProjectCards(container, fallbackProjects);
  }
}

async function loadProjectCount(element) {
  try {
    const response = await fetch("https://api.github.com/users/thanhhao06/repos?type=owner&sort=updated&direction=desc&per_page=100", {
      headers: { Accept: "application/vnd.github+json" }
    });
    if (!response.ok) throw new Error(`GitHub API ${response.status}`);
    const repos = await response.json();
    const count = repos.filter((repo) => !repo.fork).length;
    animateCounter(element, count);
  } catch (error) {
    console.error("Không tải được số project:", error);
    animateCounter(element, Number(element.dataset.fallback || fallbackProjects.length));
  }
}

function animateStatCounters() {
  document.querySelectorAll(".stat-value").forEach((element) => {
    if (element.id === "projectCount") return;
    const target = Number.parseInt(element.textContent, 10);
    if (Number.isFinite(target)) {
      animateCounter(element, target);
    }
  });
}

function animateCounter(element, target) {
  const suffix = element.textContent.trim().endsWith("+") ? "+" : "";
  const duration = 900;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = `${Math.round(target * eased)}${suffix}`;
    if (progress < 1) requestAnimationFrame(tick);
  }

  element.textContent = `0${suffix}`;
  requestAnimationFrame(tick);
}


function setupPaginatedGrids() {
  document.querySelectorAll(".skill-panel[data-tab-panel]").forEach((panel) => {
    const grid = panel.querySelector(".paginated-grid");
    const pagination = document.querySelector(`[data-pagination-for="${panel.dataset.tabPanel}"]`);
    setupSinglePaginatedGrid(grid, pagination);
  });
}

function setupSinglePaginatedGrid(grid, pagination) {
  if (!grid || !pagination) return;

  const items = Array.from(grid.children).filter((item) => !item.classList.contains("message-card"));
  const pageSize = Number.parseInt(grid.dataset.pageSize || "0", 10) || items.length;
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  let currentPage = 1;

  pagination.replaceWith(pagination.cloneNode(false));
  pagination = document.querySelector(`[data-pagination-for="${pagination.dataset.paginationFor}"]`);

  function renderPage(page) {
    currentPage = Math.min(Math.max(page, 1), totalPages);
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;

    items.forEach((item, index) => {
      item.hidden = index < start || index >= end;
    });

    const buttons = [
      `<button class="archive-page-btn content-page-btn" type="button" data-page="${currentPage - 1}" ${currentPage === 1 ? "disabled" : ""}>&lt;</button>`
    ];

    for (let pageIndex = 1; pageIndex <= totalPages; pageIndex += 1) {
      buttons.push(`<button class="archive-page-btn content-page-btn${pageIndex === currentPage ? " active" : ""}" type="button" data-page="${pageIndex}">${pageIndex}</button>`);
    }

    buttons.push(`<button class="archive-page-btn content-page-btn" type="button" data-page="${currentPage + 1}" ${currentPage === totalPages ? "disabled" : ""}>&gt;</button>`);
    pagination.innerHTML = buttons.join("");
  }

  pagination.addEventListener("click", (event) => {
    const button = event.target.closest("[data-page]");
    if (!button || button.disabled) return;
    event.preventDefault();
    renderPage(Number.parseInt(button.dataset.page, 10));
  });

  renderPage(1);
}

function setupAboutScrollReveal() {
  const about = document.querySelector(".azaki-about-section");
  if (!about) return;

  const targets = about.querySelectorAll(".section-heading, .about-preview-card, .about-avatar-slot");
  let lastScrollY = window.scrollY;

  function updateReveal() {
    const currentScrollY = window.scrollY;
    const scrollingDown = currentScrollY >= lastScrollY;
    const rect = about.getBoundingClientRect();
    const nearAbout = rect.top < window.innerHeight * 0.82 && rect.bottom > window.innerHeight * 0.12;

    if (scrollingDown && nearAbout) {
      about.classList.add("is-visible");
      targets.forEach((target) => target.classList.add("is-visible"));
    }

    if (!scrollingDown && rect.top > window.innerHeight * 0.16) {
      about.classList.remove("is-visible");
      targets.forEach((target) => target.classList.remove("is-visible"));
    }

    lastScrollY = currentScrollY;
  }

  window.addEventListener("scroll", updateReveal, { passive: true });
  updateReveal();
}

function setupCodeBlocks() {
  const commandLikeLanguages = new Set([
    "", "text", "txt", "plaintext", "plain", "log", "console", "terminal",
    "bash", "sh", "shell", "zsh", "powershell", "ps1", "cmd", "dos", "batch",
    "diff", "patch", "ini", "conf", "config", "yaml", "yml", "toml", "json"
  ]);

  document.querySelectorAll("figure.highlight").forEach((block) => {
    const language = Array.from(block.classList).find((name) => name !== "highlight") || "";
    const normalized = language.toLowerCase().replace(/^language-/, "");
    const isCommandLike = commandLikeLanguages.has(normalized) || /(?:log|txt|manual|manifest|console|frame|sha|salt)/i.test(normalized);

    block.classList.add("code-block-wrap");
    block.dataset.language = normalized || "text";
    if (isCommandLike) {
      block.classList.add("no-line-numbers", "command-code");
    } else {
      block.classList.add("numbered-code", "is-collapsed");
    }

    if (!block.querySelector(".code-block-header")) {
      const header = document.createElement("div");
      header.className = "code-block-header";
      header.innerHTML = `
        <div class="code-block-meta">
          <span class="code-block-dots"><span class="code-block-dot"></span><span class="code-block-dot"></span><span class="code-block-dot"></span></span>
          <span class="code-block-language">${escapeHtml(normalized || "text")}</span>
        </div>
        ${isCommandLike ? "" : '<button class="code-action-btn" type="button" data-code-toggle>Hiện thêm</button>'}
      `;
      block.prepend(header);
    }
  });

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-code-toggle]");
    if (!button) return;
    const block = button.closest("figure.highlight");
    if (!block) return;
    const collapsed = block.classList.toggle("is-collapsed");
    button.textContent = collapsed ? "Hiện thêm" : "Thu gọn";
  });
}

function setupTocToggle() {
  const toggle = document.querySelector("[data-toc-toggle]");
  const layout = document.querySelector(".post-layout");
  if (!toggle || !layout) return;

  toggle.addEventListener("click", () => {
    const hidden = layout.classList.toggle("toc-hidden");
    toggle.setAttribute("aria-expanded", String(!hidden));
    toggle.setAttribute("aria-label", hidden ? "Hiện mục lục" : "Ẩn mục lục");
    toggle.setAttribute("title", hidden ? "Hiện mục lục" : "Ẩn mục lục");
  });
}
