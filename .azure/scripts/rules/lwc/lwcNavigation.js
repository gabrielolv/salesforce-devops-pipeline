const RULE_ID = 'SF-LWC-002';
const UNSAFE_NAV = [
  { re: /window\.location\s*=/,         msg: 'window.location assignment bypasses LWC navigation lifecycle' },
  { re: /window\.location\.href\s*=/,   msg: 'window.location.href assignment bypasses LWC navigation lifecycle' },
  { re: /window\.open\s*\(/,            msg: 'window.open() may be blocked by popup blockers; prefer NavigationMixin' },
  { re: /location\.replace\s*\(/,       msg: 'location.replace() bypasses LWC navigation lifecycle' },
];

export default function lwcNavigation(changedFiles) {
  const findings = [];

  for (const file of changedFiles) {
    if (!file.filename.includes('/lwc/') || !file.filename.endsWith('.js') || !file.content) continue;

    const lines = file.content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.trim().startsWith('//')) continue;

      for (const { re, msg } of UNSAFE_NAV) {
        if (re.test(line)) {
          findings.push({
            ruleId: RULE_ID,
            severity: 'warning',
            path: file.filename,
            startLine: i + 1,
            endLine: i + 1,
            message: msg,
            suggestion: "Use NavigationMixin.Navigate() from 'lightning/navigation' to handle routing correctly in Salesforce.",
          });
          break;
        }
      }
    }
  }

  return findings;
}
