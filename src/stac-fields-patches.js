import Registry from '@radiantearth/stac-fields/registry';
import { Formatters } from '@radiantearth/stac-fields';

const HTML_ESCAPES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => HTML_ESCAPES[char]);
}

// Formatters.formatWKT2 wraps the unescaped, user-controlled `proj:wkt2` value in `<pre>`.
// The result is rendered via `v-html`, so the value needs to be escaped before it is wrapped.
const wkt2Spec = Registry.getSpecification('proj:wkt2');
if (wkt2Spec.format === 'WKT2') {
  // `format` takes precedence over `formatter` in stac-fields, so it must be removed.
  const patched = { ...wkt2Spec, formatter: formatWKT2 };
  delete patched.format;
  Registry.addMetadataField('proj:wkt2', patched);
}

function formatWKT2(value, ...args) {
  const html = Formatters.formatWKT2(value, ...args);
  const match = typeof html === 'string' ? html.match(/^<pre>([\s\S]*)<\/pre>$/) : null;
  return match ? `<pre>${escapeHtml(match[1])}</pre>` : html;
}
