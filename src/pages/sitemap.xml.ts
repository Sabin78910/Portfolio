import type { APIRoute } from 'astro';
import { contentModified } from '../lib/lastmod.ts';

// One page. <lastmod> is the same content date as the ProfilePage markup (Bing weighs it for freshness).
export const GET: APIRoute = ({ site }) =>
  new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${new URL('/', site)}</loc><lastmod>${contentModified()}</lastmod></url>
</urlset>
`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
