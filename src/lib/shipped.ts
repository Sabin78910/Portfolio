export type Tracked = { repo: string; issue: number; product: string; label: string; shippedAt: string | null };
export type IssueState = { state: string; state_reason?: string | null; closed_at?: string | null };

// A feature counts as shipped only when its issue was closed as completed (not "not planned").
// Once shipped it stays shipped, so a later reopen doesn't silently remove it from the site.
export function applyStatus(t: Tracked, issue: IssueState): Tracked {
  if (t.shippedAt) return t;
  if (issue.state === 'closed' && issue.state_reason === 'completed' && issue.closed_at) {
    return { ...t, shippedAt: issue.closed_at.slice(0, 10) };
  }
  return t;
}

export const shippedFor = (list: Tracked[], product: string) => list.filter((t) => t.product === product && t.shippedAt);
