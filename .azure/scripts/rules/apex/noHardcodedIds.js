const RULE_ID = 'SF-APEX-005';
// Matches 15 or 18-char Salesforce IDs inside string literals
// SF IDs start with a 3-char prefix (object key prefix) followed by alphanumeric chars
const SF_ID_RE = /['"]([A-Za-z0-9]{15}|[A-Za-z0-9]{18})['"]/g;
const VALID_PREFIX_RE = /^[A-Za-z0-9]{3}[0-9A-Za-z]{12}([A-Za-z0-9]{3})?$/;

function looksLikeSfId(str) {
  if (!VALID_PREFIX_RE.test(str)) return false;
  // Exclude strings that are clearly not IDs (all same char, sequential, etc.)
  if (/^(.)\1+$/.test(str)) return false;
  if (/^[0-9]+$/.test(str)) return false;
  return true;
}

export default function noHardcodedIds(changedFiles) {
  const findings = [];

  for (const file of changedFiles) {
    if (!/\.(cls|trigger)$/.test(file.filename) || !file.content) continue;

    const lines = file.content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.trim().startsWith('//') || line.trim().startsWith('*')) continue;

      let match;
      SF_ID_RE.lastIndex = 0;
      while ((match = SF_ID_RE.exec(line)) !== null) {
        const candidate = match[1];
        if (looksLikeSfId(candidate)) {
          findings.push({
            ruleId: RULE_ID,
            severity: 'failure',
            path: file.filename,
            startLine: i + 1,
            endLine: i + 1,
            message: `Possible hardcoded Salesforce ID "${candidate}" — IDs differ between orgs`,
            suggestion: 'Use Custom Labels, Custom Settings, or Custom Metadata to store org-specific IDs.',
          });
          break; // one finding per line is enough
        }
      }
    }
  }

  return findings;
}
