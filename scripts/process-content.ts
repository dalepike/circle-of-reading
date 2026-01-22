/**
 * Content Processing Script
 * Transforms existing Tolstoy translation markdown files to Astro content collection format.
 *
 * Run with: bun run scripts/process-content.ts
 */

import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { join, basename } from "node:path";

const SOURCE_DIR = "../Tolstoy/translations";
const OUTPUT_DIR = "./src/content/readings";

interface ReadingMetadata {
  number: number | number[];
  title: string;
  russianTitle?: string;
  author?: string;
  month: string;
  type: "weekly" | "monthly";
  volume?: number;
  pages?: string;
  slug: string;
  description?: string;
}

const MONTHS = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december"
];

/**
 * Parse the original markdown format to extract metadata
 */
function parseMarkdown(content: string, filename: string, month: string): { metadata: ReadingMetadata; body: string } {
  const lines = content.split("\n");
  let metadata: Partial<ReadingMetadata> = { month };
  let bodyStartIndex = 0;

  // Determine if this is a monthly reading
  const isMonthly = filename.includes("-monthly-");
  metadata.type = isMonthly ? "monthly" : "weekly";

  // Extract number(s) from filename
  const numberMatch = filename.match(/^(\d+(?:-\d+)?)/);
  if (numberMatch) {
    const numStr = numberMatch[1];
    if (numStr.includes("-")) {
      metadata.number = numStr.split("-").map(n => parseInt(n, 10));
    } else {
      metadata.number = parseInt(numStr, 10);
    }
  }

  // Parse first line for title
  const firstLine = lines[0];
  if (firstLine?.startsWith("#")) {
    // Format: "# 17. Good (*Dobro*)" or "# 66. From "Patriotism..." (*Russian*)"
    // or "### The Thief's Son" (older format)
    const titleMatch = firstLine.match(/^#+\s*(?:\d+(?:[+-]\d+)?\.?\s*)?(.+?)(?:\s*\(\*([^*]+)\*\))?$/);
    if (titleMatch) {
      metadata.title = titleMatch[1].trim().replace(/\*+/g, "");
      if (titleMatch[2]) {
        metadata.russianTitle = titleMatch[2].trim();
      }
    } else {
      metadata.title = firstLine.replace(/^#+\s*/, "").trim();
    }
    bodyStartIndex = 1;
  }

  // Look for metadata lines in the header section
  for (let i = 1; i < Math.min(10, lines.length); i++) {
    const line = lines[i];

    if (line.startsWith("**Author/Source:**")) {
      metadata.author = line.replace("**Author/Source:**", "").trim();
      bodyStartIndex = Math.max(bodyStartIndex, i + 1);
    } else if (line.startsWith("**Context:**")) {
      metadata.description = line.replace("**Context:**", "").trim().slice(0, 200);
      bodyStartIndex = Math.max(bodyStartIndex, i + 1);
    } else if (line.startsWith("**Volume/Pages:**")) {
      const volMatch = line.match(/Vol\s*(\d+)/i);
      const pageMatch = line.match(/pages?\s*([\d-]+)/i);
      if (volMatch) metadata.volume = parseInt(volMatch[1], 10);
      if (pageMatch) metadata.pages = pageMatch[1];
      bodyStartIndex = Math.max(bodyStartIndex, i + 1);
    } else if (line === "---") {
      bodyStartIndex = Math.max(bodyStartIndex, i + 1);
    }
  }

  // Generate slug from filename
  let slug = filename.replace(/\.md$/, "");
  // For monthly readings, remove the month prefix to avoid duplication in URL
  if (isMonthly) {
    slug = slug.replace(/^[a-z]+-monthly-/, "monthly-");
  }
  metadata.slug = slug;

  // Extract body (everything after header section, up to Translator's Notes)
  const bodyLines: string[] = [];
  let inBody = false;
  let hitTranslatorNotes = false;

  for (let i = bodyStartIndex; i < lines.length; i++) {
    const line = lines[i];

    // Skip empty lines at the start
    if (!inBody && line.trim() === "") continue;
    if (!inBody && line.trim() === "---") continue;

    inBody = true;

    // Check for translator notes section
    if (line.match(/^\*?\*?Translator['']?s? Notes?:?\*?\*?$/i) || line.match(/^---\s*$/)) {
      if (bodyLines.length > 0 && bodyLines[bodyLines.length - 1].trim() === "") {
        // Remove trailing empty lines before separator
      }
      hitTranslatorNotes = true;
    }

    bodyLines.push(line);
  }

  const body = bodyLines.join("\n").trim();

  return {
    metadata: metadata as ReadingMetadata,
    body
  };
}

/**
 * Generate frontmatter YAML from metadata
 */
function generateFrontmatter(metadata: ReadingMetadata): string {
  const lines = ["---"];

  if (Array.isArray(metadata.number)) {
    lines.push(`number: [${metadata.number.join(", ")}]`);
  } else if (metadata.number) {
    lines.push(`number: ${metadata.number}`);
  }

  lines.push(`title: "${escapeYaml(metadata.title)}"`);

  if (metadata.russianTitle) {
    lines.push(`russianTitle: "${escapeYaml(metadata.russianTitle)}"`);
  }

  if (metadata.author) {
    lines.push(`author: "${escapeYaml(metadata.author)}"`);
  }

  lines.push(`month: "${metadata.month}"`);
  lines.push(`type: "${metadata.type}"`);

  if (metadata.volume) {
    lines.push(`volume: ${metadata.volume}`);
  }

  if (metadata.pages) {
    lines.push(`pages: "${metadata.pages}"`);
  }

  lines.push(`slug: "${metadata.slug}"`);

  if (metadata.description) {
    lines.push(`description: "${escapeYaml(metadata.description)}"`);
  }

  lines.push("---");

  return lines.join("\n");
}

function escapeYaml(str: string): string {
  return str.replace(/"/g, '\\"').replace(/\n/g, " ");
}

/**
 * Process all files from source directory
 */
async function processAllReadings() {
  const scriptDir = import.meta.dir;
  const projectDir = join(scriptDir, "..");
  const sourcePath = join(projectDir, SOURCE_DIR);
  const outputPath = join(projectDir, OUTPUT_DIR);

  console.log("Processing Tolstoy translations...");
  console.log(`Source: ${sourcePath}`);
  console.log(`Output: ${outputPath}`);

  // Create output directories
  for (const month of [...MONTHS, "monthly"]) {
    await mkdir(join(outputPath, month), { recursive: true });
  }

  let totalProcessed = 0;

  // Process each month folder
  for (const folder of [...MONTHS, "monthly"]) {
    const folderPath = join(sourcePath, folder);

    try {
      const files = await readdir(folderPath);
      const mdFiles = files.filter(f => f.endsWith(".md"));

      for (const file of mdFiles) {
        const filePath = join(folderPath, file);
        const content = await readFile(filePath, "utf-8");

        const month = folder === "monthly" ? extractMonthFromMonthlyFile(file) : folder;
        const { metadata, body } = parseMarkdown(content, file, month);

        // Generate new content with frontmatter
        const frontmatter = generateFrontmatter(metadata);
        const newContent = `${frontmatter}\n\n${body}`;

        // Write to output directory
        const outputFolder = metadata.type === "monthly" ? "monthly" : folder;
        const outputFile = join(outputPath, outputFolder, file);
        await writeFile(outputFile, newContent);

        console.log(`  Processed: ${folder}/${file}`);
        totalProcessed++;
      }
    } catch (err) {
      // Folder might not exist, skip
      console.log(`  Skipping: ${folder} (not found)`);
    }
  }

  console.log(`\nDone! Processed ${totalProcessed} files.`);
}

/**
 * Extract month from monthly reading filename
 * e.g., "april-monthly-patriotism-and-government.md" -> "april"
 */
function extractMonthFromMonthlyFile(filename: string): string {
  for (const month of MONTHS) {
    if (filename.startsWith(`${month}-monthly`)) {
      return month;
    }
  }
  return "january"; // fallback
}

// Run the script
processAllReadings().catch(console.error);
