const RULE_ID = 'SF-FLW-001';

export default function flowReviewRequired(changedFiles) {
  const findings = [];

  for (const file of changedFiles) {
    if (!file.filename.endsWith('.flow-meta.xml')) continue;

    const flowName = file.filename.replace(/^.*\//, '').replace('.flow-meta.xml', '');
    findings.push({
      ruleId: RULE_ID,
      severity: 'notice',
      path: file.filename,
      startLine: 1,
      endLine: 1,
      message: `Flow "${flowName}" was ${file.status} — flows require manual functional testing in a sandbox`,
      suggestion: 'Verify the flow runs end-to-end in a sandbox before merging. Check entry criteria, decision branches, and fault paths.',
    });
  }

  return findings;
}
