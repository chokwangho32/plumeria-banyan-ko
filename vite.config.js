import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import { siteConfig } from './site.config.js';
import { blogArticles, articlePath } from './src/scripts/blog.js';
import { markdownToHtml } from './src/scripts/markdown.js';

const { siteUrl } = siteConfig;

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Blog dates are written "2026.10.15"
function isoDate(date) {
  return date.replace(/\./g, '-');
}

function verificationTags() {
  const tags = [];
  if (siteConfig.googleSiteVerification) {
    tags.push(`<meta name="google-site-verification" content="${escapeAttr(siteConfig.googleSiteVerification)}" />`);
  }
  if (siteConfig.naverSiteVerification) {
    tags.push(`<meta name="naver-site-verification" content="${escapeAttr(siteConfig.naverSiteVerification)}" />`);
  }
  return tags.join('\n    ');
}

function taxLicenseLine() {
  const parts = [];
  if (siteConfig.tatLicense) parts.push(`TAT: ${escapeAttr(siteConfig.tatLicense)}`);
  if (siteConfig.getLicense) parts.push(`GET: ${escapeAttr(siteConfig.getLicense)}`);
  return parts.length ? `<div>${parts.join(' | ')}</div>` : '';
}

function fillPlaceholders(html) {
  return html
    .replaceAll('%SITE_URL%', escapeAttr(siteUrl))
    .replaceAll('%KAKAO_CHANNEL_URL%', escapeAttr(siteConfig.kakaoChannelUrl))
    .replace('<!--%SITE_VERIFICATION%-->', verificationTags())
    .replace('<!--%TAX_LICENSE_LINE%-->', taxLicenseLine());
}

// Reuse the header logo markup from index.html on the article pages
function headerLogo() {
  const source = readFileSync(new URL('./index.html', import.meta.url), 'utf8');
  const match = source.match(/<a href="#" class="brand-logo"[\s\S]*?<\/a>/);
  return match ? match[0].replace('href="#"', 'href="../../"') : '';
}

function articlePage(article, cssFile) {
  const url = `${siteUrl}${articlePath(article)}`;
  const image = `${siteUrl}${article.img}`;
  const published = isoDate(article.date);
  const related = blogArticles.filter((a) => a.id !== article.id);

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        headline: article.title,
        description: article.snippet,
        image,
        datePublished: published,
        dateModified: published,
        inLanguage: 'ko-KR',
        mainEntityOfPage: url,
        author: { '@type': 'Organization', name: 'Plumeria Vacation Rentals', url: siteUrl },
        publisher: { '@id': `${siteUrl}#business` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: '홈', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: '하와이 여행 블로그', item: `${siteUrl}#blog` },
          { '@type': 'ListItem', position: 3, name: article.title, item: url },
        ],
      },
    ],
  };

  return `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeAttr(article.title)} | Plumeria 와이키키 반얀</title>
    <meta name="description" content="${escapeAttr(article.snippet)}" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <link rel="canonical" href="${escapeAttr(url)}" />
    <meta name="theme-color" content="#2B93A6" />
    ${verificationTags()}
    <meta property="og:type" content="article" />
    <meta property="og:locale" content="ko_KR" />
    <meta property="og:site_name" content="Plumeria Vacation Rentals · 와이키키 반얀" />
    <meta property="og:url" content="${escapeAttr(url)}" />
    <meta property="og:title" content="${escapeAttr(article.title)}" />
    <meta property="og:description" content="${escapeAttr(article.snippet)}" />
    <meta property="og:image" content="${escapeAttr(image)}" />
    <meta property="article:published_time" content="${published}" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,700&display=swap" media="print" onload="this.media='all'" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" media="print" onload="this.media='all'" />
    <link rel="icon" href="../../favicon.svg" type="image/svg+xml" />
    <link rel="apple-touch-icon" href="../../apple-touch-icon.png" />
    <link rel="stylesheet" href="../../${cssFile}" />
    <script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>
  </head>
  <body style="padding-bottom:0">
    <header class="header">
      <div class="container header-inner">
        ${headerLogo()}
        <div class="header-actions">
          <a href="${escapeAttr(siteConfig.kakaoChannelUrl)}" class="btn-kakao" target="_blank" rel="noopener">카톡 1:1 상담</a>
        </div>
      </div>
    </header>

    <main class="article-page">
      <div class="container">
        <article class="article-wrap">
          <nav class="article-breadcrumb" aria-label="현재 위치">
            <a href="../../">홈</a> › <a href="../../#blog">하와이 여행 블로그</a>
          </nav>
          <span class="section-tag">${escapeAttr(article.tag)}</span>
          <h1 class="article-title">${escapeAttr(article.title)}</h1>
          <p class="article-breadcrumb"><time datetime="${published}">${article.date}</time> · Plumeria 현지 호스트</p>
          <img class="article-hero" src="../../${article.img}" alt="${escapeAttr(article.title)}" width="1200" height="675" />
          <div class="article-body">
${markdownToHtml(article.content, { skipTitle: true })}
          </div>

          <div class="article-cta">
            <p>와이키키 반얀 32층·36층 스위트, 리조트피 $0 · 주차 무료</p>
            <div style="display:flex; gap:10px; flex-wrap:wrap;">
              <a href="../../#suites" class="btn-primary">객실 보기</a>
              <a href="../../#booking" class="btn-gold">실시간 견적 받기</a>
            </div>
          </div>

          <section class="article-related">
            <h2>함께 보면 좋은 글</h2>
            <ul>
              ${related.map((a) => `<li><a href="../../${articlePath(a)}">${escapeAttr(a.title)}</a></li>`).join('\n              ')}
            </ul>
          </section>
        </article>
      </div>
    </main>

    <footer class="footer" style="padding:8px 0 24px">
      <div class="container footer-bottom" style="border-top:0">
        <div>© 2026 Plumeria Vacation Rentals · Waikiki Banyan Tower 2, 201 Ohua Ave, Honolulu, HI 96815</div>
      </div>
    </footer>
  </body>
</html>
`;
}

function notFoundPage(cssFile) {
  return `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>페이지를 찾을 수 없어요 | Plumeria 와이키키 반얀</title>
    <meta name="robots" content="noindex" />
    <link rel="icon" href="${escapeAttr(siteUrl)}favicon.svg" type="image/svg+xml" />
    <link rel="stylesheet" href="${escapeAttr(siteUrl)}${cssFile}" />
  </head>
  <body style="padding-bottom:0">
    <main class="article-page">
      <div class="container article-wrap" style="text-align:center">
        <h1 class="article-title">페이지를 찾을 수 없어요</h1>
        <p style="margin-bottom:24px">주소가 바뀌었거나 삭제된 페이지예요.</p>
        <a href="${escapeAttr(siteUrl)}" class="btn-gold">홈으로 가기</a>
      </div>
    </main>
  </body>
</html>
`;
}

function sitemap() {
  const latest = blogArticles.map((a) => isoDate(a.date)).sort().at(-1);
  const urls = [
    { loc: siteUrl, lastmod: latest, priority: '1.0' },
    ...blogArticles.map((a) => ({ loc: `${siteUrl}${articlePath(a)}`, lastmod: isoDate(a.date), priority: '0.7' })),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${escapeAttr(u.loc)}</loc><lastmod>${u.lastmod}</lastmod><priority>${u.priority}</priority></url>`).join('\n')}
</urlset>
`;
}

function robots() {
  return `User-agent: *
Allow: /

Sitemap: ${siteUrl}sitemap.xml
`;
}

// Fills site-wide placeholders in index.html and emits the SEO files:
// one static page per blog article, sitemap.xml, robots.txt and 404.html.
function seoPages() {
  return {
    name: 'plumeria-seo-pages',
    enforce: 'post',
    transformIndexHtml: {
      order: 'pre',
      handler: fillPlaceholders,
    },
    generateBundle(_options, bundle) {
      const css = Object.values(bundle).find((file) => file.type === 'asset' && file.fileName.endsWith('.css'));
      if (!css) this.error('Built CSS not found; article pages need it');

      for (const article of blogArticles) {
        this.emitFile({ type: 'asset', fileName: `${articlePath(article)}index.html`, source: articlePage(article, css.fileName) });
      }
      this.emitFile({ type: 'asset', fileName: '404.html', source: notFoundPage(css.fileName) });
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap() });
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots() });
    },
  };
}

// Relative base so the build works both at a domain root (custom domain)
// and under a sub-path (GitHub Pages: /<repo>/).
export default defineConfig({
  base: './',
  define: {
    __KAKAO_CHANNEL_URL__: JSON.stringify(siteConfig.kakaoChannelUrl),
  },
  plugins: [seoPages()],
});
