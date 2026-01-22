#!/usr/bin/env ts-node

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';

interface FrontMatter {
  week?: number;
  title: string;
  russianTitle?: string;
  author: string;
  month: string;
  type: 'weekly' | 'monthly';
  volume: number;
  pages: string;
  slug: string;
}

function extractWeekNumber(filename: string): number | undefined {
  const match = filename.match(/^W(\d+)/);
  return match ? parseInt(match[1], 10) : undefined;
}

function extractTitle(content: string): string {
  const match = content.match(/^# (?:W\d+\.\s*)?(.+?)(?:\s*\(|$)/m);
  if (!match) throw new Error('Could not extract title');
  return match[1].trim();
}

function extractRussianTitle(content: string): string | undefined {
  const match = content.match(/\(\*(.+?)\*\)/);
  return match ? match[1].trim() : undefined;
}

function extractAuthor(content: string): string {
  const match = content.match(/\*\*Author\/Source:\*\*\s*(.+?)$/m);
  if (!match) throw new Error('Could not extract author');
  return match[1].trim();
}

function extractVolumeAndPages(content: string): { volume: number; pages: string } {
  // Try to match full format with pages
  let match = content.match(/\*\*Volume\/Pages:\*\*\s*Vol[.\s]*(\d+),?\s*(?:pp\.|pages?)\s*([\d-]+)/i);
  if (match) {
    return {
      volume: parseInt(match[1], 10),
      pages: match[2]
    };
  }

  // Try to match volume only (no page numbers)
  match = content.match(/\*\*Volume\/Pages:\*\*\s*Vol[.\s]*(\d+)\s*$/im);
  if (match) {
    return {
      volume: parseInt(match[1], 10),
      pages: 'TBD'
    };
  }

  throw new Error('Could not extract volume and pages');
}

function extractContext(content: string): string | undefined {
  const match = content.match(/\*\*Context:\*\*\s*(.+?)(?=\n\*\*|$)/s);
  return match ? match[1].trim() : undefined;
}

function getMonthFromPath(filePath: string): string {
  const parts = filePath.split('/');
  for (const part of parts) {
    const lowerPart = part.toLowerCase();
    if (['january', 'february', 'march', 'april', 'may', 'june',
         'july', 'august', 'september', 'october', 'november', 'december', 'monthly'].includes(lowerPart)) {
      return lowerPart;
    }
  }
  throw new Error('Could not determine month from path');
}

function getSlugFromFilename(filename: string): string {
  return filename.replace(/\.md$/, '');
}

function extractContentAfterSeparator(content: string): string {
  // Find the first --- separator after the metadata
  const lines = content.split('\n');
  let separatorIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      separatorIndex = i;
      break;
    }
  }

  if (separatorIndex === -1) {
    throw new Error('Could not find separator ---');
  }

  // Return everything after the separator
  return lines.slice(separatorIndex + 1).join('\n').trimStart();
}

function createFrontmatter(data: FrontMatter): string {
  let yaml = '---\n';

  if (data.week !== undefined) {
    yaml += `week: ${data.week}\n`;
  }

  yaml += `title: "${data.title}"\n`;

  if (data.russianTitle) {
    yaml += `russianTitle: "${data.russianTitle}"\n`;
  }

  yaml += `author: "${data.author}"\n`;
  yaml += `month: "${data.month}"\n`;
  yaml += `type: "${data.type}"\n`;
  yaml += `volume: ${data.volume}\n`;
  yaml += `pages: "${data.pages}"\n`;
  yaml += `slug: "${data.slug}"\n`;
  yaml += '---\n';

  return yaml;
}

function processFile(filePath: string): void {
  console.log(`Processing: ${filePath}`);

  const content = readFileSync(filePath, 'utf-8');

  // Check if file already has YAML frontmatter
  if (content.startsWith('---\n')) {
    console.log(`  ⏭️  Skipping (already has frontmatter)`);
    return;
  }

  try {
    const filename = filePath.split('/').pop()!;
    const month = getMonthFromPath(filePath);
    const isMonthly = month === 'monthly';

    const frontmatter: FrontMatter = {
      title: extractTitle(content),
      author: extractAuthor(content),
      month: isMonthly ? extractMonthFromFilename(filename) : month,
      type: isMonthly ? 'monthly' : 'weekly',
      slug: getSlugFromFilename(filename),
      ...extractVolumeAndPages(content)
    };

    if (!isMonthly) {
      frontmatter.week = extractWeekNumber(filename);
    }

    const russianTitle = extractRussianTitle(content);
    if (russianTitle) {
      frontmatter.russianTitle = russianTitle;
    }

    // Extract the content after the original metadata
    const mainContent = extractContentAfterSeparator(content);

    // Create new file content with YAML frontmatter
    const newContent = createFrontmatter(frontmatter) + '\n' + mainContent;

    // Write the updated content
    writeFileSync(filePath, newContent, 'utf-8');
    console.log(`  ✅ Updated`);

  } catch (error) {
    console.error(`  ❌ Error: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function extractMonthFromFilename(filename: string): string {
  const months = ['january', 'february', 'march', 'april', 'may', 'june',
                  'july', 'august', 'september', 'october', 'november', 'december'];

  const lowerFilename = filename.toLowerCase();
  for (const month of months) {
    if (lowerFilename.includes(month)) {
      return month;
    }
  }

  throw new Error('Could not extract month from filename');
}

function processDirectory(dirPath: string): void {
  const entries = readdirSync(dirPath);

  for (const entry of entries) {
    const fullPath = join(dirPath, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      processDirectory(fullPath);
    } else if (entry.endsWith('.md')) {
      processFile(fullPath);
    }
  }
}

// Main execution
const scriptDir = dirname(new URL(import.meta.url).pathname);
const readingsPath = process.argv[2] || join(scriptDir, '../src/content/readings');

console.log(`🚀 Processing reading files in: ${readingsPath}\n`);
processDirectory(readingsPath);
console.log('\n✨ Done!');
