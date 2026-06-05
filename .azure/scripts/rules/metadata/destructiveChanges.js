const RULE_ID = 'SF-META-001';
const SAFE_TO_REMOVE = ['.xml', '.cls-meta.xml', '.trigger-meta.xml']; // meta companion files are fine
const EXCLUDED_EXT   = ['.cls-meta.xml', '.trigger-meta.xml', '.js-meta.xml', '.html'];

export default function destructiveChanges(changedFiles) {
  const findings = [];

  for (const file of changedFiles) {
    if (file.status !== 'removed') continue;
    if (EXCLUDED_EXT.some(e => file.filename.endsWith(e))) continue;
    // Skip pure -meta.xml companion files (they're always removed alongside their main file)
    if (file.filename.endsWith('-meta.xml')) {
      const main = file.filename.replace('-meta.xml', '');
      const mainRemoved = changedFiles.some(f => f.filename === main && f.status === 'removed');
      if (mainRemoved) continue;
    }

    findings.push({
      ruleId: RULE_ID,
      severity: 'warning',
      path: file.filename,
      startLine: 1,
      endLine: 1,
      message: `File "${file.filename.replace(/^.*\//, '')}" is being deleted — confirm this is intentional`,
      suggestion: 'Ensure a destructiveChanges.xml is included in the deployment package if this is an org deletion, and that no other metadata references this component.',
    });
  }

  return findings;
}
