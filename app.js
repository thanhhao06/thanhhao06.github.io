const SITE_CONFIG = {
  owner: "thanhhao06",
  repo: "thanhhao06.github.io",
  branch: "main",
  archivesDir: "archives",
  imagesDir: "archives/images",
  backgroundDir: "bg",
  defaultBackground: "bg/bg.png",
  storageKey: "azaki-selected-background"
};

const BLOG_PAGE_SIZE = 12;
const SKILL_PAGE_SIZE = 6;
const TOOLS_PAGE_SIZE = 8;

function encodePath(path) {
  return String(path)
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
}

function safeAssetUrl(path) {
  return String(path)
    .split("/")
    .map((part) => {
      try {
        return encodeURIComponent(decodeURIComponent(part));
      } catch {
        return encodeURIComponent(part);
      }
    })
    .join("/");
}

function githubApiUrl(path) {
  return `https://api.github.com/repos/${SITE_CONFIG.owner}/${SITE_CONFIG.repo}/contents/${encodePath(path)}?ref=${encodeURIComponent(SITE_CONFIG.branch)}`;
}

function rawFileUrl(path) {
  return `https://raw.githubusercontent.com/${SITE_CONFIG.owner}/${SITE_CONFIG.repo}/${encodeURIComponent(SITE_CONFIG.branch)}/${encodePath(path)}`;
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function fileNameToTitle(fileName) {
  return decodeURIComponent(fileName)
    .replace(/\.(md|markdown)$/i, "")
    .replace(/[_-]+/g, " ")
    .trim();
}

function truncate(text, maxLength) {
  const value = String(text || "").trim();
  if (value.length <= maxLength) return value;
  return value.slice(0, maxLength - 3).trim() + "...";
}

function isLocalServer() {
  return /^(localhost|127\.0\.0\.1|0\.0\.0\.0)$/i.test(window.location.hostname);
}

function getAbsoluteLocalUrl(path) {
  return new URL(path, window.location.origin + "/").href;
}

function parseDirectoryListingHtml(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  return Array.from(doc.querySelectorAll("a[href]"))
    .map((anchor) => anchor.getAttribute("href") || "")
    .filter((href) => href && !href.startsWith("../"))
    .map((href) => href.replace(/\/$/, ""))
    .filter((href) => {
      try {
        const decoded = decodeURIComponent(href.split("?")[0].split("#")[0]);
        return /\.(md|markdown)$/i.test(decoded);
      } catch {
        return /\.(md|markdown)$/i.test(href);
      }
    })
    .map((href) => {
      try {
        return decodeURIComponent(href.replace(/\/$/, ""));
      } catch {
        return href.replace(/\/$/, "");
      }
    })
    .filter((name) => name !== "")
    .map((name) => ({ name, type: "file" }));
}

function parseDirectoryListingFallback(html) {
  const matches = [...html.matchAll(/<a\s+[^>]*href=["']([^"']+)["']/gi)];
  return matches
    .map((match) => match[1] || "")
    .filter((href) => href && !href.startsWith("../"))
    .map((href) => href.replace(/\/$/, ""))
    .filter((href) => {
      try {
        const decoded = decodeURIComponent(href.split("?")[0].split("#")[0]);
        return /\.(md|markdown)$/i.test(decoded);
      } catch {
        return /\.(md|markdown)$/i.test(href);
      }
    })
    .map((href) => {
      try {
        return decodeURIComponent(href.replace(/\/$/, ""));
      } catch {
        return href.replace(/\/$/, "");
      }
    })
    .filter((name) => name !== "")
    .map((name) => ({ name, type: "file" }));
}

async function listLocalFolder(path) {
  const folderUrl = getAbsoluteLocalUrl(`${path.replace(/\/$/, "")}/`);
  const response = await fetch(folderUrl);
  if (!response.ok) {
    throw new Error(`Không đọc được thư mục local: ${path}`);
  }

  const html = await response.text();
  let items = parseDirectoryListingHtml(html);
  if (items.length === 0) {
    items = parseDirectoryListingFallback(html);
  }

  if (items.length === 0) {
    throw new Error(`Không tìm thấy file markdown trong thư mục local: ${path}`);
  }
  return items;
}

function setBackgroundImage(path) {
  const backgroundPath = path || SITE_CONFIG.defaultBackground;
  document.body.style.backgroundImage = `url("${safeAssetUrl(backgroundPath)}")`;
}

function applySavedBackground() {
  const saved = localStorage.getItem(SITE_CONFIG.storageKey);
  setBackgroundImage(saved || SITE_CONFIG.defaultBackground);
}

function saveBackground(path) {
  localStorage.setItem(SITE_CONFIG.storageKey, path);
  setBackgroundImage(path);
}

function resetBackground() {
  localStorage.removeItem(SITE_CONFIG.storageKey);
  setBackgroundImage(SITE_CONFIG.defaultBackground);
}

async function listFolder(path) {
  try {
    return await listLocalFolder(path);
  } catch (error) {
    console.warn("Local folder listing failed, falling back to GitHub API:", error);
  }
  const url = githubApiUrl(path);
  console.log("Reading folder:", url);

  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json"
    }
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`GitHub API ${response.status}: ${text}`);
  }

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("Phản hồi từ GitHub API không phải JSON hợp lệ.");
  }

  if (!Array.isArray(data)) {
    throw new Error("GitHub API không trả về danh sách file.");
  }

  return data;
}

async function fetchTextFile(path) {
  if (isLocalServer()) {
    try {
      console.log("Reading local file first:", path);
      return await fetchLocalText(path);
    } catch (error) {
      console.warn(`Local fetch failed for ${path}, trying GitHub raw fallback.`, error);
    }
  }

  const url = rawFileUrl(path);
  console.log("Reading file from GitHub raw:", url);

  const response = await fetch(url);

  if (!response.ok) {
    console.warn(`Raw GitHub fetch failed for ${path}, trying local path fallback.`);
    return fetchLocalText(path);
  }

  return response.text();
}

async function fetchLocalText(path) {
  const response = await fetch(getAbsoluteLocalUrl(path));
  if (!response.ok) {
    throw new Error(`Không đọc được trang: ${path}`);
  }
  return response.text();
}

async function getBlogCount() {
  const items = await listFolder(SITE_CONFIG.archivesDir);
  return items.filter((item) => item.type === "file" && /\.(md|markdown)$/i.test(item.name)).length;
}

async function getProjectCount() {
  try {
    const html = await fetchLocalText("project/index.html");
    const projectCards = (html.match(/class=["'][^"']*project-card[^"']*["']/gi) || []).length;
    if (projectCards > 0) {
      return projectCards;
    }

    const sections = (html.match(/class=["'][^"']*card-section[^"']*["']/gi) || []).length;
    return sections > 0 ? sections : 0;
  } catch (error) {
    console.error("getProjectCount error:", error);
    return 0;
  }
}

async function loadHomeStats() {
  const blogCountEl = document.getElementById("blogCount");
  const projectCountEl = document.getElementById("projectCount");
  if (!blogCountEl || !projectCountEl) return;

  try {
    const [blog, projects] = await Promise.all([getBlogCount(), getProjectCount()]);
    blogCountEl.textContent = `${blog}+`;
    projectCountEl.textContent = `${projects}+`;
  } catch (error) {
    console.error("loadHomeStats error:", error);
  }
}

function extractTitleFromMarkdown(fileName, markdown) {
  return fileNameToTitle(fileName);
}

function extractDescriptionFromMarkdown(markdown) {
  const lines = markdown
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  for (const line of lines) {
    if (/^#/.test(line)) continue;
    if (/^!\[\[/.test(line)) continue;
    if (/^!\[.*\]\(.*\)$/.test(line)) continue;
    if (/^```/.test(line)) continue;
    if (/^>\s*/.test(line)) continue;

    const cleaned = line
      .replace(/[*_`>#-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (cleaned) {
      return truncate(cleaned, 120);
    }
  }

  return "Bấm để mở bài viết";
}

function noteUrl(fileName) {
  return `/note.html?file=${encodeURIComponent(String(fileName))}`;
}

function slugify(text) {
  return String(text)
    .replace(/\.(md|markdown)$/i, "")
    .trim()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[_]+/g, "-")
    .replace(/[^a-z0-9\-]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function slugToArchiveFileName(slug) {
  const decoded = decodeURIComponent(String(slug));
  if (/\.(md|markdown)$/i.test(decoded)) {
    return decoded;
  }
  return `${decoded}.md`;
}

async function findArchiveFileNameFromSlug(slug) {
  const decoded = decodeURIComponent(String(slug));
  const items = await listFolder(SITE_CONFIG.archivesDir);
  const match = items.find((item) => {
    if (item.type !== "file") return false;
    return slugify(item.name) === slugify(decoded);
  });
  if (match) {
    return match.name;
  }
  const exactMd = `${decoded}.md`;
  const exactMarkdown = `${decoded}.markdown`;
  if (items.some((item) => item.type === "file" && item.name === exactMd)) {
    return exactMd;
  }
  if (items.some((item) => item.type === "file" && item.name === exactMarkdown)) {
    return exactMarkdown;
  }
  throw new Error(`Không tìm thấy file markdown tương ứng với ${decoded}`);
}

function normalizeArchiveImagePath(rawPath) {
  const clean = String(rawPath)
    .trim()
    .replace(/^\.?\//, "")
    .replace(/\\/g, "/");

  if (!clean) return "";

  if (clean.startsWith(`${SITE_CONFIG.imagesDir}/`)) {
    return clean;
  }

  if (clean.startsWith("images/") || clean.startsWith("image/")) {
    return `${SITE_CONFIG.archivesDir}/${clean.replace(/^image\//, "images/")}`;
  }

  return `${SITE_CONFIG.imagesDir}/${clean}`;
}

function preprocessMarkdown(markdown) {
  let output = markdown;

  output = output.replace(/!\[\[([^\]]+)\]\]/g, function (fullMatch, raw) {
    const parts = raw.split("|");
    const target = (parts[0] || "").trim();

    if (!target) return fullMatch;

    const imagePath = normalizeArchiveImagePath(target);
    return `![](${safeAssetUrl(imagePath)})`;
  });

  output = output.replace(/\[\[([^\]]+)\]\]/g, function (_, raw) {
    const parts = raw.split("|");
    const filePath = (parts[0] || "").trim();
    const label = (parts[1] || filePath).trim();

    if (/\.(md|markdown)$/i.test(filePath)) {
      return `[${label}](${noteUrl(filePath)})`;
    }

    return label;
  });

  output = output.replace(
    /!\[([^\]]*)\]\((?!https?:\/\/|data:|\/)([^)]+)\)/g,
    function (_, alt, rawPath) {
      const clean = rawPath.trim().replace(/\\/g, "/");

      if (clean.startsWith("images/") || clean.startsWith("./images/")) {
        return `![${alt}](${safeAssetUrl(normalizeArchiveImagePath(clean))})`;
      }

      return `![${alt}](${safeAssetUrl(clean)})`;
    }
  );

  output = output.replace(
    /\[([^\]]+)\]\((?!https?:\/\/|mailto:|tel:|#|\/)([^)]+)\)/g,
    function (_, text, rawHref) {
      const href = rawHref.trim();
      const purePath = href.split("#")[0].split("?")[0];

      if (/\.(md|markdown)$/i.test(purePath)) {
        return `[${text}](${noteUrl(href)})`;
      }

      return `[${text}](${href})`;
    }
  );

  return output;
}

function getCodeLanguage(code) {
  if (!code) return "";

  const languageClass = Array.from(code.classList).find((className) =>
    className.startsWith("language-")
  );

  if (!languageClass) return "";
  return languageClass.replace("language-", "").trim().toLowerCase();
}

function formatCodeLanguage(language) {
  const normalized = String(language || "").trim().toLowerCase();
  if (!normalized) return "Code";

  const labels = {
    js: "JavaScript",
    jsx: "React JSX",
    ts: "TypeScript",
    tsx: "React TSX",
    py: "Python",
    sh: "Shell",
    shell: "Shell",
    bash: "Bash",
    zsh: "Zsh",
    ps1: "PowerShell",
    yml: "YAML",
    yaml: "YAML",
    md: "Markdown",
    plaintext: "Text",
    text: "Text",
    html: "HTML",
    css: "CSS",
    json: "JSON",
    csharp: "C#",
    cpp: "C++"
  };

  if (labels[normalized]) return labels[normalized];

  return normalized
    .split(/[-_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function createCodeBlockHeader(language, rawCode, wrapper) {
  const header = document.createElement("div");
  header.className = "code-block-header";

  const meta = document.createElement("div");
  meta.className = "code-block-meta";

  const dots = document.createElement("span");
  dots.className = "code-block-dots";
  dots.innerHTML =
    '<span class="code-block-dot"></span><span class="code-block-dot"></span><span class="code-block-dot"></span>';

  const label = document.createElement("span");
  label.className = "code-block-language";
  label.textContent = formatCodeLanguage(language);

  const actions = document.createElement("div");
  actions.className = "code-block-actions";

  const collapseBtn = document.createElement("button");
  collapseBtn.type = "button";
  collapseBtn.className = "code-action-btn";
  collapseBtn.textContent = "Thu gọn";

  collapseBtn.addEventListener("click", () => {
    wrapper.classList.toggle("is-collapsed");
    collapseBtn.textContent = wrapper.classList.contains("is-collapsed")
      ? "Mở rộng"
      : "Thu gọn";
  });

  const copyBtn = document.createElement("button");
  copyBtn.type = "button";
  copyBtn.className = "code-action-btn";
  copyBtn.textContent = "Sao chép";

  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(rawCode);
      copyBtn.textContent = "Đã chép";
      copyBtn.classList.add("is-copied");

      window.setTimeout(() => {
        copyBtn.textContent = "Sao chép";
        copyBtn.classList.remove("is-copied");
      }, 1800);
    } catch (error) {
      console.error("Không sao chép được code:", error);
      copyBtn.textContent = "Lỗi";
      window.setTimeout(() => {
        copyBtn.textContent = "Sao chép";
      }, 1800);
    }
  });

  meta.appendChild(dots);
  meta.appendChild(label);

  actions.appendChild(collapseBtn);
  actions.appendChild(copyBtn);

  header.appendChild(meta);
  header.appendChild(actions);

  return header;
}

let shikiHighlighterPromise = null;

async function getShikiHighlighter() {
  if (!shikiHighlighterPromise) {
    shikiHighlighterPromise = import("https://esm.sh/shiki@3.0.0").then(
      async ({ createHighlighter }) => {
        return await createHighlighter({
          themes: ["github-dark"],
          langs: [
            "python",
            "javascript",
            "typescript",
            "bash",
            "shell",
            "html",
            "css",
            "json",
            "markdown",
            "yaml",
            "plaintext"
          ]
        });
      }
    );
  }

  return shikiHighlighterPromise;
}

async function enhanceCodeBlocks(container) {
  const blocks = container.querySelectorAll("pre");
  if (!blocks.length) return;

  const highlighter = await getShikiHighlighter();

  for (const pre of blocks) {
    if (pre.parentElement && pre.parentElement.classList.contains("code-block-wrap")) {
      continue;
    }

    const code = pre.querySelector("code");
    const normalizedCode = code ? (code.textContent || "") : (pre.textContent || "");
    const rawCode = normalizedCode.replace(/\n$/, "");
    const language = getCodeLanguage(code) || "plaintext";

    const wrapper = document.createElement("div");
    wrapper.className = "code-block-wrap";

    let renderedPre = pre;

    try {
      const html = highlighter.codeToHtml(rawCode, {
        lang: language,
        theme: "github-dark"
      });

      const temp = document.createElement("div");
      temp.innerHTML = html;

      const shikiPre = temp.querySelector("pre");
      if (shikiPre) {
        renderedPre = shikiPre;
      }
    } catch (error) {
      console.error("Shiki highlight lỗi:", error);
    }

    const header = createCodeBlockHeader(language, rawCode, wrapper);

    wrapper.appendChild(header);
    wrapper.appendChild(renderedPre);

    pre.replaceWith(wrapper);
  }
}

async function postProcessRenderedContent(container) {
  await enhanceCodeBlocks(container);

  const images = container.querySelectorAll("img");
  // phần cũ của bạn giữ nguyên ở dưới
}

function renderMessage(container, title, text) {
  container.innerHTML = `
    <div class="message-card">
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(text)}</p>
    </div>
  `;
}

async function loadArchivesPage() {
  const container = document.getElementById("archiveBoxes");
  const pagination = document.getElementById("archivePagination");
  if (!container) return;

  renderMessage(
    container,
    "Đang tải...",
    "Đang đọc danh sách file markdown"
  );

  if (pagination) {
    pagination.innerHTML = "";
  }

  try {
    const items = await listFolder(SITE_CONFIG.archivesDir);
    console.log("GitHub items:", items);

    const notes = items
      .filter((item) => item.type === "file" && /\.(md|markdown)$/i.test(item.name))
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));

    if (notes.length === 0) {
      renderMessage(container, "Chưa có bài viết", "Thư mục hiện chưa có file .md");
      return;
    }

    const cards = await Promise.all(
      notes.map(async (note) => {
        const title = fileNameToTitle(note.name);
        let desc = "Bấm để mở bài viết";

        try {
          const md = await fetchTextFile(`${SITE_CONFIG.archivesDir}/${note.name}`);
          desc = extractDescriptionFromMarkdown(md);
        } catch (error) {
          console.error("Không đọc được markdown:", note.name, error);
        }

        return `
          <a class="archive-box" href="${noteUrl(note.name)}">
            <h3>${escapeHtml(title)}</h3>
            <p>${escapeHtml(desc)}</p>
            <span class="archive-file">${escapeHtml(note.name)}</span>
          </a>
        `;
      })
    );

    const totalPages = Math.max(1, Math.ceil(cards.length / BLOG_PAGE_SIZE));
    let currentPage = getArchivePageFromUrl();

    if (currentPage > totalPages) {
      currentPage = totalPages;
    }

    const renderPage = (page) => {
      currentPage = page;

      const start = (page - 1) * BLOG_PAGE_SIZE;
      const end = start + BLOG_PAGE_SIZE;

      container.innerHTML = cards.slice(start, end).join("");

      if (pagination) {
        renderArchivePagination(pagination, currentPage, totalPages, renderPage);
      }

      setArchivePageToUrl(currentPage);

      const heroCard = document.querySelector(".archive-hero-card");
      if (heroCard) {
        heroCard.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    renderPage(currentPage);
  } catch (error) {
    console.error("loadArchivesPage error:", error);
    renderMessage(container, "Lỗi", error.message || "Không tải được danh sách bài viết.");
  }
}

function getArchivePageFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const page = Number(params.get("page"));
  return Number.isInteger(page) && page > 0 ? page : 1;
}

function setArchivePageToUrl(page) {
  const url = new URL(window.location.href);

  if (page <= 1) {
    url.searchParams.delete("page");
  } else {
    url.searchParams.set("page", String(page));
  }

  window.history.replaceState({}, "", url);
}

function buildCompactPageList(currentPage, totalPages) {
  const pages = [currentPage - 1, currentPage, currentPage + 1]
    .filter((page, index, array) => page >= 1 && page <= totalPages && array.indexOf(page) === index);

  if (pages.length === 0) {
    return [1];
  }

  return pages;
}

function renderArchivePagination(container, currentPage, totalPages, onPageChange) {
  if (!container) return;

  const safeTotalPages = Math.max(1, totalPages);
  const safeCurrentPage = Math.min(Math.max(1, currentPage), safeTotalPages);
  const pageItems = buildCompactPageList(safeCurrentPage, safeTotalPages);

  const html = [
    `
      <button class="archive-page-btn" data-page="${safeCurrentPage - 1}" ${safeCurrentPage === 1 ? "disabled" : ""} aria-label="Trang trước">
        &lt;
      </button>
    `,
    ...pageItems.map((item) => {
      return `
        <button
          class="archive-page-btn ${item === safeCurrentPage ? "active" : ""}"
          data-page="${item}"
          aria-label="Trang ${item}"
          ${item === safeCurrentPage ? 'aria-current="page"' : ""}
        >
          ${item}
        </button>
      `;
    }),
    `
      <button class="archive-page-btn" data-page="${safeCurrentPage + 1}" ${safeCurrentPage === safeTotalPages ? "disabled" : ""} aria-label="Trang sau">
        &gt;
      </button>
    `,
  ].join("");

  container.innerHTML = html;

  container.querySelectorAll(".archive-page-btn[data-page]").forEach((button) => {
    button.addEventListener("click", () => {
      const page = Number(button.dataset.page);
      if (!page || page < 1 || page > safeTotalPages || page === safeCurrentPage) return;
      onPageChange(page);
    });
  });
}

function initPaginatedGrid(container, pagination, pageSize) {
  if (!container || !pagination) return;

  const items = Array.from(container.children).filter((item) => item.nodeType === Node.ELEMENT_NODE);
  if (!items.length) {
    renderArchivePagination(pagination, 1, 1, () => {});
    return;
  }

  items.forEach((item) => {
    if (!item.dataset.originalDisplay) {
      item.dataset.originalDisplay = item.style.display || "";
    }
  });

  const safePageSize = Math.max(1, Number(pageSize) || 1);
  const totalPages = Math.max(1, Math.ceil(items.length / safePageSize));
  let currentPage = 1;

  const renderPage = (page) => {
    currentPage = Math.min(Math.max(1, page), totalPages);

    const start = (currentPage - 1) * safePageSize;
    const end = start + safePageSize;

    items.forEach((item, index) => {
      const isVisible = index >= start && index < end;
      item.hidden = !isVisible;
      item.setAttribute("aria-hidden", String(!isVisible));
      item.style.display = isVisible ? item.dataset.originalDisplay || "" : "none";
    });

    renderArchivePagination(pagination, currentPage, totalPages, renderPage);
  };

  renderPage(1);
}

async function loadNotePage() {
  const noteContent = document.getElementById("noteContent");
  const noteTitle = document.getElementById("noteTitle");
  const noteFileName = document.getElementById("noteFileName");

  if (!noteContent) return;

  const params = new URLSearchParams(window.location.search);
  let file = params.get("file");

  if (!file) {
    const match = window.location.pathname.match(/\/blog\/(.+?)(?:\/)?$/i);
    if (match && match[1]) {
      try {
        file = await findArchiveFileNameFromSlug(match[1]);
      } catch (error) {
        renderMessage(noteContent, "Không tìm thấy bài viết", error.message);
        return;
      }
    }
  }

  if (!file) {
    renderMessage(
      noteContent,
      "Thiếu file",
      "URL cần có tham số ?file=ten-file.md hoặc truy cập dạng /blog/ten-file"
    );
    return;
  }

  if (noteFileName) {
    noteFileName.textContent = file;
  }

  try {
    noteContent.innerHTML = `<p class="loading-text">Đang tải nội dung...</p>`;

    const markdown = await fetchTextFile(`${SITE_CONFIG.archivesDir}/${file}`);
    const processed = preprocessMarkdown(markdown);
    const title = extractTitleFromMarkdown(file, markdown);

    if (noteTitle) {
      noteTitle.textContent = title;
    }

    document.title = `${title} - Azaki`;

    if (!window.marked) {
      throw new Error("Thiếu thư viện marked.");
    }

    marked.setOptions({
      breaks: true,
      gfm: true
    });

    noteContent.innerHTML = marked.parse(processed);
    await postProcessRenderedContent(noteContent);
    buildNoteToc();
    initNoteTocToggle();
  } catch (error) {
    console.error("loadNotePage error:", error);
    renderMessage(noteContent, "Lỗi", error.message || "Không mở được bài viết.");
  }
}

function markActiveBackgroundCard() {
  const current = localStorage.getItem(SITE_CONFIG.storageKey) || SITE_CONFIG.defaultBackground;
  const cards = document.querySelectorAll(".bg-card");

  cards.forEach((card) => {
    const value = card.getAttribute("data-bg");
    if (value === current) {
      card.classList.add("active");
    } else {
      card.classList.remove("active");
    }
  });
}

async function loadBackgroundPage() {
  const grid = document.getElementById("backgroundGrid");
  const resetBtn = document.getElementById("resetBackgroundBtn");
  const status = document.getElementById("backgroundStatus");

  if (!grid) return;

  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      resetBackground();
      markActiveBackgroundCard();
      if (status) {
        status.textContent = "Đã quay về ảnh nền mặc định.";
      }
    });
  }

  renderMessage(grid, "Đang tải...", "Đang đọc danh sách ảnh nền trong thư mục bg/");

  try {
    const items = await listFolder(SITE_CONFIG.backgroundDir);
    const images = items.filter((item) => {
      return item.type === "file" && /\.(png|jpe?g|webp|gif|avif)$/i.test(item.name);
    });

    const allCards = [
      `
      <button class="bg-card" data-bg="${escapeHtml(SITE_CONFIG.defaultBackground)}" type="button">
        <img src="${escapeHtml(safeAssetUrl(SITE_CONFIG.defaultBackground))}" alt="Default background">
        <div class="bg-card-body">
          <h3>Mặc định</h3>
          <p>${escapeHtml(SITE_CONFIG.defaultBackground)}</p>
        </div>
      </button>
      `
    ];

    images.forEach((image) => {
      const filePath = `${SITE_CONFIG.backgroundDir}/${image.name}`;
      allCards.push(`
        <button class="bg-card" data-bg="${escapeHtml(filePath)}" type="button">
          <img src="${escapeHtml(safeAssetUrl(filePath))}" alt="${escapeHtml(image.name)}">
          <div class="bg-card-body">
            <h3>${escapeHtml(fileNameToTitle(image.name))}</h3>
            <p>${escapeHtml(image.name)}</p>
          </div>
        </button>
      `);
    });

    grid.innerHTML = allCards.join("");

    grid.querySelectorAll(".bg-card").forEach((card) => {
      card.addEventListener("click", function () {
        const bg = this.getAttribute("data-bg");
        saveBackground(bg);
        markActiveBackgroundCard();
        if (status) {
          status.textContent = `Đã chọn nền: ${bg}`;
        }
      });
    });

    markActiveBackgroundCard();
  } catch (error) {
    console.error("loadBackgroundPage error:", error);
    renderMessage(grid, "Lỗi", error.message || "Không tải được danh sách background.");
  }
}

document.addEventListener("DOMContentLoaded", function () {
    const revealTargets = [
    ...document.querySelectorAll(".archive-hero-card"),
    ...document.querySelectorAll(".archive-box"),
    ...document.querySelectorAll(".card-section"),
    ...document.querySelectorAll(".background-card"),
    ...document.querySelectorAll(".message-card"),
    ...document.querySelectorAll(".bg-card")
  ];

  if (revealTargets.length) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -8% 0px"
      }
    );

    revealTargets.forEach((item, index) => {
      item.classList.add("reveal-up");
      item.style.transitionDelay = `${Math.min(index * 0.06, 0.3)}s`;
      revealObserver.observe(item);
    });
  }
  applySavedBackground();

  if (document.getElementById("archiveBoxes")) {
    loadArchivesPage();
  }

  if (document.getElementById("blogCount") || document.getElementById("projectCount")) {
    loadHomeStats();
  }

  if (document.getElementById("noteContent")) {
    loadNotePage();
  }

  if (document.getElementById("backgroundGrid")) {
    loadBackgroundPage();
  }
});

function slugifyHeading(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "section";
}

function initNoteTocToggle() {
  const notePage = document.getElementById("notePage");
  const toggleBtn = document.getElementById("tocToggleBtn");

  if (!notePage || !toggleBtn) return;

  function setCollapsed(collapsed) {
    notePage.classList.toggle("toc-collapsed", collapsed);
    toggleBtn.setAttribute("aria-expanded", String(!collapsed));
    toggleBtn.setAttribute("title", collapsed ? "Hiện mục lục" : "Ẩn mục lục");
  }

  if (window.innerWidth > 1180) {
    setCollapsed(false);
  } else {
    setCollapsed(true);
  }

  toggleBtn.addEventListener("click", function () {
    const isCollapsed = notePage.classList.contains("toc-collapsed");
    setCollapsed(!isCollapsed);
  });
}

function buildNoteToc() {
  const notePage = document.getElementById("notePage");
  const noteContent = document.getElementById("noteContent");
  const noteTitle = document.getElementById("noteTitle");
  const tocLinks = document.getElementById("noteTocLinks");
  const tocTitle = document.getElementById("noteTocTitle");

  if (!notePage || !noteContent || !tocLinks || !tocTitle) return;

  const headings = Array.from(
    noteContent.querySelectorAll("h2, h3, h4")
  ).filter((heading) => heading.textContent.trim());

  if (headings.length === 0) {
    notePage.classList.add("toc-empty");
    tocLinks.innerHTML = `<span class="toc-empty-text">Bài này chưa có heading để tạo mục lục.</span>`;
    return;
  }

  notePage.classList.remove("toc-empty");

  const usedIds = new Map();

  tocTitle.textContent = (noteTitle?.textContent || "Mục lục").trim();

  tocLinks.innerHTML = headings
    .map((heading) => {
      let baseId = heading.id || slugifyHeading(heading.textContent);

      if (usedIds.has(baseId)) {
        const nextCount = usedIds.get(baseId) + 1;
        usedIds.set(baseId, nextCount);
        baseId = `${baseId}-${nextCount}`;
      } else {
        usedIds.set(baseId, 1);
      }

      heading.id = baseId;

      return `
        <a class="toc-link toc-level-${heading.tagName.toLowerCase()}" href="#${escapeHtml(baseId)}">
          ${escapeHtml(heading.textContent)}
        </a>
      `;
    })
    .join("");

  const tocLinkElements = Array.from(tocLinks.querySelectorAll(".toc-link"));

  function setActiveLink(id) {
    tocLinkElements.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("active", isActive);
    });
  }

  if (headings[0]) {
    setActiveLink(headings[0].id);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const visibleEntries = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visibleEntries.length > 0) {
        setActiveLink(visibleEntries[0].target.id);
      }
    },
    {
      rootMargin: "-20% 0px -65% 0px",
      threshold: [0.15, 0.4, 0.75],
    }
  );

  headings.forEach((heading) => observer.observe(heading));

  tocLinkElements.forEach((link) => {
    link.addEventListener("click", function () {
      if (window.innerWidth <= 1180) {
        notePage.classList.add("toc-collapsed");
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const appearItems = document.querySelectorAll(
    ".about-preview .section-heading, .about-preview .about-preview-grid"
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        } else {
          entry.target.classList.remove("show");
        }
      });
    },
    {
      threshold: 0.2,
    }
  );

  appearItems.forEach((item) => observer.observe(item));
});

document.addEventListener("DOMContentLoaded", () => {
  initSkillTabs();
  initSkillGridPagination();
});

function initSkillGridPagination() {
  const skillPanel = document.querySelector('.skill-panel[data-tab-panel="skill"] .skill-box-grid');
  const skillPagination = document.querySelector('.skill-panel[data-tab-panel="skill"] [data-pagination-for="skill"]');
  const toolsPanel = document.querySelector('.skill-panel[data-tab-panel="tools"] .tool-grid');
  const toolsPagination = document.querySelector('.skill-panel[data-tab-panel="tools"] [data-pagination-for="tools"]');

  if (skillPanel && skillPagination) {
    initPaginatedGrid(skillPanel, skillPagination, skillPanel.getAttribute('data-page-size') || SKILL_PAGE_SIZE);
  }

  if (toolsPanel && toolsPagination) {
    initPaginatedGrid(toolsPanel, toolsPagination, toolsPanel.getAttribute('data-page-size') || TOOLS_PAGE_SIZE);
  }
}

function initSkillTabs() {
  const tabButtons = Array.from(document.querySelectorAll(".skill-tab-btn"));
  const tabInputs = Array.from(document.querySelectorAll(".skill-tab-input"));
  const tabPanels = Array.from(document.querySelectorAll(".skill-panel"));

  if ((!tabButtons.length && !tabInputs.length) || !tabPanels.length) return;

  function activateTab(target) {
    tabButtons.forEach((button) => {
      const isActive = button.getAttribute("data-tab") === target;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-selected", String(isActive));
    });

    tabInputs.forEach((input) => {
      input.checked = input.getAttribute("data-tab") === target;
    });

    tabPanels.forEach((panel) => {
      const isActive = panel.getAttribute("data-tab-panel") === target;
      panel.classList.toggle("active", isActive);
      panel.hidden = !isActive;
    });
  }

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activateTab(button.getAttribute("data-tab"));
    });
  });

  tabInputs.forEach((input) => {
    input.addEventListener("change", () => {
      if (input.checked) {
        activateTab(input.getAttribute("data-tab"));
      }
    });
  });

  const defaultTab =
    tabInputs.find((input) => input.checked)?.getAttribute("data-tab") ||
    tabButtons.find((button) => button.classList.contains("active"))?.getAttribute("data-tab") ||
    tabButtons[0]?.getAttribute("data-tab") ||
    tabInputs[0]?.getAttribute("data-tab");

  if (defaultTab) {
    activateTab(defaultTab);
  }
}
