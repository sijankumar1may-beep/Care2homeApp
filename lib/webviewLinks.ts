import { Linking } from 'react-native';

const EXTERNAL_PREFIXES = ['tel:', 'mailto:', 'whatsapp:', 'sms:', 'geo:'];
const EXTERNAL_HOSTS = ['wa.me', 'api.whatsapp.com'];

export function isExternalAppUrl(url: string): boolean {
  if (!url) return false;
  const lower = url.toLowerCase();
  if (EXTERNAL_PREFIXES.some((prefix) => lower.startsWith(prefix))) return true;
  try {
    const host = new URL(lower).hostname;
    return EXTERNAL_HOSTS.some((h) => host.includes(h));
  } catch {
    return lower.includes('wa.me/') || lower.includes('api.whatsapp.com');
  }
}

export async function openExternalUrl(url: string): Promise<boolean> {
  if (!isExternalAppUrl(url)) return false;

  const normalized = url.startsWith('tel:') ? url : url;
  try {
    const canOpen = await Linking.canOpenURL(normalized);
    if (canOpen) {
      await Linking.openURL(normalized);
      return true;
    }
  } catch {
    // fall through to tel dial attempt
  }

  if (normalized.startsWith('tel:')) {
    await Linking.openURL(normalized);
    return true;
  }

  return false;
}

export const WEBVIEW_EMBED_STYLE_SCRIPT = `
(function() {
  var style = document.createElement('style');
  style.id = 'care2home-embed-safe-area';
  style.textContent = [
    'div.fixed.bg-green-600, .fixed.bottom-0.bg-green-600 {',
    '  left: 0 !important;',
    '  right: 0 !important;',
    '  width: 100% !important;',
    '  bottom: 0 !important;',
    '  padding-bottom: env(safe-area-inset-bottom, 0px);',
    '  min-height: unset !important;',
    '  border-radius: 0 !important;',
    '}',
    'div.fixed.bg-green-600 a, .fixed.bottom-0.bg-green-600 a {',
    '  padding-top: 10px !important;',
    '  padding-bottom: 5px !important;',
    '  font-size: 14px !important;',
    '  line-height: 1.25 !important;',
    '}',
    'body {',
    '  padding-bottom: calc(52px + env(safe-area-inset-bottom, 16px)) !important;',
    '}'
  ].join('\\n');
  if (!document.getElementById('care2home-embed-safe-area')) {
    (document.head || document.documentElement).appendChild(style);
  }
  true;
})();
`;

export const WEBVIEW_LINK_INTERCEPT_SCRIPT = `
(function() {
  function shouldIntercept(href) {
    if (!href) return false;
    var lower = href.toLowerCase();
    return lower.indexOf('tel:') === 0
      || lower.indexOf('mailto:') === 0
      || lower.indexOf('whatsapp:') === 0
      || lower.indexOf('sms:') === 0
      || lower.indexOf('wa.me/') !== -1
      || lower.indexOf('api.whatsapp.com') !== -1;
  }

  function interceptClick(event) {
    var target = event.target;
    if (!target) return;
    var link = target.closest ? target.closest('a') : null;
    if (!link) return;
    var href = link.getAttribute('href');
    if (!shouldIntercept(href)) return;
    event.preventDefault();
    event.stopPropagation();
    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'external', url: href }));
  }

  document.addEventListener('click', interceptClick, true);
  true;
})();
`;
