import { execFileSync } from 'node:child_process';

// What the home page shows: when any of these change, the profile changed.
const CONTENT = ['src/data', 'src/pages/index.astro', 'src/assets', 'public/Sabin-Khanal-CV.pdf'];

// When the profile content last changed (UTC ISO 8601), from the last commit that touched it.
// One source for ProfilePage.dateModified and the sitemap's <lastmod>, so the two never disagree.
// Falls back to the build time when git history is unavailable; that only ever errs towards "fresh".
export function contentModified(paths: readonly string[] = CONTENT): string {
  try {
    const iso = execFileSync('git', ['log', '-1', '--format=%cI', '--', ...paths], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    if (iso) return new Date(iso).toISOString();
  } catch {
    // no git binary, or not a repository
  }
  return new Date().toISOString();
}
