const RULE_ID = 'SF-LWC-004';
// Flag English text literals longer than 3 words directly in LWC HTML templates
// Excludes expressions, attributes, and comments
const TEXT_NODE_RE = /^[\s]*([A-Z][A-Za-z]+([ ][A-Za-z]+){2,}[.!?]?)[\s]*$/;

export default function lwcHardcodedLabels(changedFiles) {
  const findings = [];

  for (const file of changedFiles) {
    if (!file.filename.includes('/lwc/') || !file.filename.endsWith('.html') || !file.content) continue;

    const lines = file.content.split('\n');
    let inComment = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.includes('<!--')) inComment = true;
      if (line.includes('-->')) { inComment = false; continue; }
      if (inComment) continue;

      // Skip lines that are tag lines or contain template expressions
      if (/^\s*</.test(line) || /\{/.test(line)) continue;

      if (TEXT_NODE_RE.test(line)) {
        findings.push({
          ruleId: RULE_ID,
          severity: 'notice',
          path: file.filename,
          startLine: i + 1,
          endLine: i + 1,
          message: `Hardcoded text "${line.trim()}" — consider using a Custom Label for multi-language support`,
          suggestion: "Import the label with @salesforce/label/c.YourLabel and reference it as {label.YourLabel}.",
        });
      }
    }
  }

  return findings;
}
