// Minimal Markdown → HTML for the blog articles (headings, bullet lists,
// bold, paragraphs). Shared by the browser and the build-time page generator.

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function inline(text) {
  return escapeHtml(text).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

// skipTitle drops the leading "# ..." line when the page renders the title separately
export function markdownToHtml(markdown, { skipTitle = false } = {}) {
  const lines = markdown.trim().split('\n').map((l) => l.trim());
  const html = [];
  let list = null;
  let paragraph = [];

  const flushParagraph = () => {
    if (paragraph.length) html.push(`<p>${paragraph.map(inline).join('<br>')}</p>`);
    paragraph = [];
  };
  const flushList = () => {
    if (list) html.push(`<ul>${list.map((item) => `<li>${inline(item)}</li>`).join('')}</ul>`);
    list = null;
  };

  lines.forEach((line, i) => {
    if (!line) {
      flushParagraph();
      flushList();
      return;
    }
    const heading = line.match(/^(#{1,3})\s+(.*)$/);
    if (heading) {
      flushParagraph();
      flushList();
      if (heading[1].length === 1 && skipTitle && i === 0) return;
      // Article pages own the single <h1>; content headings start at <h2>
      const level = Math.max(heading[1].length, 2);
      html.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      return;
    }
    const bullet = line.match(/^[*-]\s+(.*)$/);
    if (bullet) {
      flushParagraph();
      (list ||= []).push(bullet[1]);
      return;
    }
    flushList();
    paragraph.push(line);
  });
  flushParagraph();
  flushList();
  return html.join('\n');
}

// Plain-text version for meta descriptions and clipboard copies
export function markdownToText(markdown) {
  return markdown
    .trim()
    .replace(/^#{1,3}\s+/gm, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/^[*-]\s+/gm, '· ');
}
