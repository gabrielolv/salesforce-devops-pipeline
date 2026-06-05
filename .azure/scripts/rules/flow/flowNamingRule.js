const RULE_ID = 'SF-FLW-002';
// Flow file names should be PascalCase with underscores as word separators allowed
// and must include an object or domain prefix
const VALID_FLOW_NAME_RE = /^[A-Z][A-Za-z0-9]+(_[A-Z][A-Za-z0-9]+)*$/;

export default function flowNamingRule(changedFiles) {
  const findings = [];

  for (const file of changedFiles) {
    if (!file.filename.endsWith('.flow-meta.xml') || file.status === 'removed') continue;

    const flowName = file.filename.replace(/^.*\//, '').replace('.flow-meta.xml', '');

    if (!VALID_FLOW_NAME_RE.test(flowName)) {
      findings.push({
        ruleId: RULE_ID,
        severity: 'notice',
        path: file.filename,
        startLine: 1,
        endLine: 1,
        message: `Flow name "${flowName}" does not follow PascalCase naming convention`,
        suggestion: 'Rename to PascalCase with underscore segments, e.g. "Case_SendNotification" or "ARCC_Job_Closed".',
      });
    }
  }

  return findings;
}
