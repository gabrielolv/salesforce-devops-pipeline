const RULE_ID = 'SF-LWC-001';
const URL_RE = /https?:\/\/[^\s'"]+/g;
// Allow salesforce.com CDN and test/mock URLs in test files
const ALLOWED_DOMAINS = ['salesforce.com', 'force.com', 'example.com', 'localhost'];

export default function lwcNoHardcodedUrls(changedFiles) {
  const findings = [];

  for (const file of changedFiles) {
    if (!file.filename.includes('/lwc/') || !file.content) continue;
    if (file.filename.endsWith('.test.js')) continue;

    const lines = file.content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.trim().startsWith('//') || line.trim().startsWith('*')) continue;

      let match;
      URL_RE.lastIndex = 0;
      while ((match = URL_RE.exec(line)) !== null) {
        const url = match[0];
        if (ALLOWED_DOMAINS.some(d => url.includes(d))) continue;
        findings.push({
          ruleId: RULE_ID,
          severity: 'warning',
          path: file.filename,
          startLine: i + 1,
          endLine: i + 1,
          message: `Hardcoded URL "${url.slice(0, 80)}" will not work across orgs or environments`,
          suggestion: 'Store the URL in a Custom Label or Custom Setting and reference it dynamically.',
        });
        break; // one finding per line
      }
    }
  }

  return findings;
}
