// Lets the site owner drop a product callout into the middle of a guide's
// prose from the CMS's plain markdown editor — no code, no MDX, just a
// line of text.
//
// Typing this on its own line in the guide body:
//
//   {{callout: nox-at10-genius}}
//
// renders the same "inline product callout" box the guide-article mockup
// specifies (small product image, name, one-line pitch, "Read review"
// link) — this is the actual internal link into a money page that the
// dev brief calls out as a required part of the guide template.
//
// Implementation note: Astro's <Content components={{...}} /> override
// only works for .mdx files — for plain .md content collection entries
// (what this project uses, deliberately, so the CMS's markdown widget
// keeps working with zero owner-facing complexity) Astro just serializes
// the compiled HTML string directly, with no component substitution step
// at all. So instead of emitting a custom element for Astro to swap out
// later, this plugin does the real work itself at markdown-compile time:
// it reads the target racket's frontmatter straight off disk and emits
// the finished callout HTML directly as a string.

import { visit } from 'unist-util-visit';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';

const CALLOUT_PATTERN = /^\{\{\s*callout:\s*([a-z0-9-]+)\s*\}\}$/i;
const RACKETS_DIR = path.join(process.cwd(), 'src', 'content', 'rackets');

function readRacketFrontmatter(slug) {
  const filePath = path.join(RACKETS_DIR, `${slug}.md`);
  if (!existsSync(filePath)) return null;

  const raw = readFileSync(filePath, 'utf-8');
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;

  try {
    return parseYaml(match[1]);
  } catch {
    return null;
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function calloutHtml(slug) {
  const data = readRacketFrontmatter(slug);

  if (!data) {
    // Fail loudly at build time rather than silently dropping content —
    // a typo'd slug should be obvious on the page, not invisible.
    return `<div class="inline-callout-error"><strong>Inline callout error:</strong> no racket found for slug "${escapeHtml(
      slug
    )}". Check the <code>{{callout: ${escapeHtml(slug)}}}</code> in this guide's body against the racket's URL slug in <code>src/content/rackets/</code>.</div>`;
  }

  const title = escapeHtml(data.title ?? slug);
  const image = escapeHtml(data.image ?? '');
  const imageAlt = escapeHtml(data.imageAlt ?? data.title ?? slug);
  const verdict = escapeHtml(data.verdict ?? '');
  const href = `/rackets/${slug}/`;

  return [
    `<a class="inline-callout" href="${href}">`,
    `<span class="ic-img"><img src="${image}" alt="${imageAlt}" loading="lazy" /></span>`,
    `<span class="ic-text"><strong>${title}</strong>${verdict}</span>`,
    `<span class="ic-link">Read review &rarr;</span>`,
    `</a>`,
  ].join('');
}

export default function remarkProductCallout() {
  return (tree) => {
    visit(tree, 'paragraph', (node, index, parent) => {
      if (!parent || index === null || node.children?.length !== 1) return;

      const child = node.children[0];
      if (child.type !== 'text') return;

      const match = child.value.trim().match(CALLOUT_PATTERN);
      if (!match) return;

      const slug = match[1];
      parent.children[index] = {
        type: 'html',
        value: calloutHtml(slug),
      };
    });
  };
}
