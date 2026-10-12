// Marks tracked features as shipped when their GitHub issue closes as completed. Run daily by sync-shipped.yml.
import { readFileSync, writeFileSync } from 'node:fs';
import { applyStatus, type Tracked } from '../src/lib/shipped.ts';

const file = new URL('../src/data/feature-tracker.json', import.meta.url);
const list: Tracked[] = JSON.parse(readFileSync(file, 'utf8'));
const headers: Record<string, string> = { Accept: 'application/vnd.github+json' };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

const next = await Promise.all(
  list.map(async (t) => {
    if (t.shippedAt) return t;
    const res = await fetch(`https://api.github.com/repos/Sabin78910/${t.repo}/issues/${t.issue}`, { headers });
    if (!res.ok) throw new Error(`${t.repo}#${t.issue}: HTTP ${res.status}`);
    return applyStatus(t, await res.json());
  }),
);

const shipped = next.filter((t, i) => t.shippedAt !== list[i].shippedAt);
if (shipped.length) {
  writeFileSync(file, JSON.stringify(next, null, 2) + '\n');
  console.log('Newly shipped:', shipped.map((t) => `${t.product}: ${t.label}`).join(', '));
} else console.log('No newly shipped features.');
