// [lang]/rss.xml — RSS feed per language
import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';

const siteTitles: Record<string, string> = {
  en: 'RacketMojo Blog — Padel Racket Guides',
  ar: 'مدونة RacketMojo — أدلة مضارب البادل',
  es: 'Blog de RacketMojo — Guías de Palas de Pádel',
};

const siteDescs: Record<string, string> = {
  en: 'Practical padel racket guides, comparisons, and tips to improve your game.',
  ar: 'أدلة عملية لمضارب البادل، مقارنات، ونصائح لتحسين مستواك.',
  es: 'Guías prácticas de palas de pádel, comparativas y consejos para mejorar tu juego.',
};

export const prerender = true;

export function getStaticPaths() {
  return [
    { params: { lang: 'en' } },
    { params: { lang: 'ar' } },
    { params: { lang: 'es' } },
  ];
}

export const GET: APIRoute = async ({ params, site }) => {
  const lang = params.lang || 'en';
  const posts = (await getCollection('posts'))
    .filter(p => (p.id.includes(`-${lang}.md`) || p.id.includes(`-${lang}.mdx`)) && !p.data.draft)
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());

  const siteUrl = site ? site.toString().replace(/\/$/, '') : 'https://racketmojo.com';

  const items = posts.map(post => {
    const slug = post.id.replace(new RegExp(`-${lang}\\.mdx?$`), '');
    const enclosure = post.data.heroImage
      ? `<enclosure url="${siteUrl}${post.data.heroImage}" type="image/webp" />`
      : '';
    return `
    <item>
      <title><![CDATA[${post.data.title}]]></title>
      <description><![CDATA[${post.data.description}]]></description>
      <link>${siteUrl}/${lang}/blog/${slug}/</link>
      <guid isPermaLink="false">${slug}-${lang}</guid>
      <pubDate>${post.data.pubDate.toUTCString()}</pubDate>
      ${enclosure}
    </item>`;
  }).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[${siteTitles[lang]}]]></title>
    <description><![CDATA[${siteDescs[lang]}]]></description>
    <link>${siteUrl}/${lang}/blog/</link>
    <atom:link href="${siteUrl}/${lang}/rss.xml" rel="self" type="application/rss+xml" />
    <language>${lang}</language>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
};
