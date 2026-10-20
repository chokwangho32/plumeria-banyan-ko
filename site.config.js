// Site-wide settings used at build time (vite.config.js) and in the browser
// (through import.meta.env). Override any of these with environment variables
// — in GitHub Actions they come from the repo's Settings → Variables.

const env = typeof process !== 'undefined' ? process.env : {};

function withTrailingSlash(url) {
  return url.endsWith('/') ? url : `${url}/`;
}

export const siteConfig = {
  // Public URL of the site root. Change to the custom domain once it is connected.
  siteUrl: withTrailingSlash(env.SITE_URL || 'https://chokwangho32.github.io/plumeria-banyan-ko/'),

  // KakaoTalk channel chat URL, e.g. https://pf.kakao.com/_xxxxx/chat
  kakaoChannelUrl: env.KAKAO_CHANNEL_URL || 'https://pf.kakao.com',

  // Search engine ownership verification codes (content="..." value only).
  googleSiteVerification: env.GOOGLE_SITE_VERIFICATION || '',
  naverSiteVerification: env.NAVER_SITE_VERIFICATION || '',

  // Hawaii tax license numbers shown in the footer. Leave empty to hide the line.
  tatLicense: env.TAT_LICENSE || '',
  getLicense: env.GET_LICENSE || '',
};
