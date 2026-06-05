const RULE_ID = 'SF-SEC-004';
const UNSAFE_PATTERNS = [
  { re: /\.innerHTML\s*=/,          msg: 'innerHTML assignment is an XSS vector' },
  { re: /\.outerHTML\s*=/,          msg: 'outerHTML assignment is an XSS vector' },
  { re: /insertAdjacentHTML\s*\(/,  msg: 'insertAdjacentHTML can introduce XSS if content is user-supplied' },
  { re: /eval\s*\(/,                msg: 'eval() executes arbitrary code — never use with user input' },
  { re: /new\s+Function\s*\(/,      msg: 'new Function() executes arbitrary code — avoid with user input' },
];

export default function lwcInsecureDom(changedFiles) {
  const findings = [];

  for (const file of changedFiles) {
    if (!file.filename.includes('/lwc/') || !file.filename.endsWith('.js') || !file.content) continue;

    const lines = file.content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.trim().startsWith('//')) continue;
      for (const { re, msg } of UNSAFE_PATTERNS) {
        if (re.test(line)) {
          findings.push({
            ruleId: RULE_ID,
            severity: 'failure',
            path: file.filename,
            startLine: i + 1,
            endLine: i + 1,
            message: `Insecure DOM operation in LWC — ${msg}`,
            suggestion: 'Use lwc:ref, tracked properties, or lightning-formatted-* components to safely render dynamic content.',
          });
          break;
        }
      }
    }
  }

  return findings;
}
