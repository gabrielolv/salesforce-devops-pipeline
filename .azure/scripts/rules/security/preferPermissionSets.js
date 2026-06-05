const RULE_ID = 'SF-SEC-001';

export default function preferPermissionSets(changedFiles) {
  const findings = [];

  for (const file of changedFiles) {
    if (!file.filename.includes('/profiles/') || !file.filename.endsWith('.xml')) continue;

    findings.push({
      ruleId: RULE_ID,
      severity: 'warning',
      path: file.filename,
      startLine: 1,
      endLine: 1,
      message: 'Profile file modified — Salesforce recommends managing access via Permission Sets instead of profiles',
      suggestion: 'Move field/object/tab permissions to a Permission Set and assign it to the relevant profiles.',
    });
  }

  return findings;
}
