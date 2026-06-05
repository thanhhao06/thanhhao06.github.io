import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const archivesDir = path.join(root, "archives");
const postsDir = path.join(root, "source", "_posts");
const assetsDir = path.join(root, "source", "blog-assets");

const imageExtensions = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".svg",
  ".bmp",
  ".avif"
]);

function toPosix(value) {
  return value.split(path.sep).join("/");
}

function encodeUrlPath(value) {
  return toPosix(value)
    .split("/")
    .filter(Boolean)
    .map((part) => encodeURIComponent(part))
    .join("/");
}

function slugify(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\.(md|markdown)$/i, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-") || "post";
}

function uniqueSlug(baseSlug, seenSlugs) {
  const count = seenSlugs.get(baseSlug) || 0;
  seenSlugs.set(baseSlug, count + 1);
  return count === 0 ? baseSlug : `${baseSlug}-${count + 1}`;
}

function titleFromFile(filePath) {
  return path.basename(filePath).replace(/\.(md|markdown)$/i, "").replace(/[-_]+/g, " ");
}

function yamlEscape(value) {
  return String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walk(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

function stripFrontMatter(markdown) {
  return markdown.replace(/^---\s*\n[\s\S]*?\n---\s*\n?/, "");
}

function parseLegacyMetadata(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const metadata = {};
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trim();
    if (!line) {
      index += 1;
      continue;
    }

    const match = line.match(/^([A-Za-z][A-Za-z0-9_-]*)\s*:\s*(.*)$/);
    if (!match) break;

    metadata[match[1].toLowerCase()] = match[2].replace(/\s+$/g, "").trim();
    index += 1;
  }

  return {
    metadata,
    body: lines.slice(index).join("\n").replace(/^\s+/, "")
  };
}

function parseDate(value, fallbackDate) {
  if (!value) return fallbackDate;
  const trimmed = value.trim();
  const slashDate = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slashDate) {
    const [, day, month, year] = slashDate;
    return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), 12, 0, 0));
  }

  const parsed = new Date(trimmed);
  return Number.isNaN(parsed.getTime()) ? fallbackDate : parsed;
}

function parseTags(value) {
  if (!value) return [];
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function yamlList(values) {
  if (!values.length) return " []";
  return `\n${values.map((value) => `  - \"${yamlEscape(value)}\"`).join("\n")}`;
}

function rewriteMarkdownAssets(markdown, relativeDir) {
  const assetPrefix = `/blog-assets/${encodeUrlPath(relativeDir)}`.replace(/\/+$/, "");

  let output = markdown.replace(/!\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g, (_, rawTarget) => {
    const target = rawTarget.trim().replace(/\\/g, "/");
    if (/^(https?:\/\/|data:|\/)/i.test(target)) return `![](${target})`;
    return `![](${assetPrefix}/${encodeUrlPath(target)})`;
  });

  output = output.replace(/!\[([^\]]*)\]\((?!https?:\/\/|data:|\/)([^)]+)\)/gi, (_, alt, rawTarget) => {
    const target = rawTarget.trim().replace(/\\/g, "/");
    return `![${alt}](${assetPrefix}/${encodeUrlPath(target)})`;
  });

  return output;
}

async function copyArchiveAssets(allFiles) {
  await fs.rm(assetsDir, { recursive: true, force: true });
  for (const file of allFiles) {
    const ext = path.extname(file).toLowerCase();
    if (!imageExtensions.has(ext)) continue;
    const relative = path.relative(archivesDir, file);
    const dest = path.join(assetsDir, relative);
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.copyFile(file, dest);
  }
}

async function migratePosts(allFiles) {
  await fs.rm(postsDir, { recursive: true, force: true });
  await fs.mkdir(postsDir, { recursive: true });

  const markdownFiles = allFiles.filter((file) => /\.(md|markdown)$/i.test(file));
  const seenSlugs = new Map();
  for (const file of markdownFiles) {
    const relative = path.relative(archivesDir, file);
    const relativeDir = path.dirname(relative) === "." ? "" : path.dirname(relative);
    const slug = uniqueSlug(slugify(path.basename(file)), seenSlugs);
    const stat = await fs.stat(file);
    const raw = await fs.readFile(file, "utf8");
    const parsed = parseLegacyMetadata(stripFrontMatter(raw));
    const createdDate = parseDate(parsed.metadata.created, stat.mtime);
    const tags = parseTags(parsed.metadata.tags);
    const content = rewriteMarkdownAssets(parsed.body, relativeDir);
    const frontMatter = [
      "---",
      `title: "${yamlEscape(titleFromFile(file))}"`,
      `date: ${createdDate.toISOString()}`,
      `slug: ${slug}`,
      `categories: "${yamlEscape(relativeDir || "Blog")}"`,
      `author: "${yamlEscape(parsed.metadata.author || "Azaki")}"`,
      `source: "${yamlEscape(parsed.metadata.source || "")}"`,
      `published_status: "${yamlEscape(parsed.metadata.published || "")}"`,
      `description: "${yamlEscape(parsed.metadata.description || "")}"`,
      `original_path: "${yamlEscape(toPosix(relative))}"`,
      `display_path: "${yamlEscape(`${slug}.md`)}"`,
      `tags:${yamlList(tags)}`,
      "---",
      ""
    ].join("\n");

    const dest = path.join(postsDir, `${slug}.md`);
    await fs.writeFile(dest, frontMatter + content, "utf8");
  }
}

async function main() {
  if (!await exists(archivesDir)) {
    console.log("No archives directory found, skipping archive migration.");
    return;
  }

  await fs.mkdir(path.join(root, "source"), { recursive: true });
  const allFiles = await walk(archivesDir);
  await copyArchiveAssets(allFiles);
  await migratePosts(allFiles);
  console.log(`Migrated ${allFiles.filter((file) => /\.(md|markdown)$/i.test(file)).length} posts into source/_posts.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
