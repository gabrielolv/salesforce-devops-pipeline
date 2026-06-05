const RULE_ID = 'SF-META-002';
const LARGE_DIFF_LINES = 100;

export default function profileLargeDiff(changedFiles) {
  const findings = [];

  for (const file of changedFiles) {
    if (!file.filename.includes('/profiles/') || !file.filename.endsWith('.xml')) continue;
    if (!file.patch) continue;

    const addedLines   = file.patch.split('\n').filter(l => l.startsWith('+')).length;
    const removedLines = file.patch.split('\n').filter(l => l.startsWith('-')).length;
    const totalChanged = addedLines + removedLines;

    if (totalChanged > LARGE_DIFF_LINES) {
      findings.push({
        ruleId: RULE_ID,
        severity: 'warning',
        path: file.filename,
        startLine: 1,
        endLine: 1,
        message: `Profile "${file.filename.replace(/^.*\//, '')}" has a very large diff (${totalChanged} changed lines) — likely contains unrelated permission noise`,
        suggestion: 'Review the diff carefully. Large profile diffs often include auto-generated permission entries. Consider retrieving only the relevant sections.',
      });
    }
  }

  return findings;
}
