const RULE_ID = 'SF-LWC-003';
const DOM_PATTERNS = [
  { re: /document\.querySelector\s*\(/,         msg: 'document.querySelector accesses the global DOM, bypassing LWC shadow boundary' },
  { re: /document\.getElementById\s*\(/,        msg: 'document.getElementById bypasses the LWC shadow DOM' },
  { re: /document\.getElementsBy/,              msg: 'document.getElementsBy* bypasses the LWC shadow DOM' },
  { re: /\.setAttribute\s*\(\s*['"]style['"]/,  msg: 'Inline style manipulation — prefer CSS classes and conditional rendering' },
];

export default function lwcDomManipulation(changedFiles) {
  const findings = [];

  for (const file of changedFiles) {
    if (!file.filename.includes('/lwc/') || !file.filename.endsWith('.js') || !file.content) continue;

    const lines = file.content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.trim().startsWith('//')) continue;

      for (const { re, msg } of DOM_PATTERNS) {
        if (re.test(line)) {
          findings.push({
            ruleId: RULE_ID,
            severity: 'warning',
            path: file.filename,
            startLine: i + 1,
            endLine: i + 1,
            message: msg,
            suggestion: "Use this.template.querySelector() to stay within the component's shadow boundary.",
          });
          break;
        }
      }
    }
  }

  return findings;
}
