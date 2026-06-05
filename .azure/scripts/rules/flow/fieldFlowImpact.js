const RULE_ID = 'SF-FLW-005';

export default function fieldFlowImpact(changedFiles) {
  const findings = [];

  const changedFields = changedFiles.filter(
    f => f.filename.includes('/fields/') && f.filename.endsWith('.xml') && f.status !== 'added'
  );
  const changedFlows = changedFiles.filter(f => f.filename.endsWith('.flow-meta.xml') && f.content);

  if (changedFields.length === 0 || changedFlows.length === 0) return findings;

  for (const field of changedFields) {
    // Extract field API name from path: .../Object__c/fields/Field__c.field-meta.xml
    const fieldName = field.filename.replace(/^.*\//, '').replace('.field-meta.xml', '');

    for (const flow of changedFlows) {
      if (flow.content.includes(fieldName)) {
        findings.push({
          ruleId: RULE_ID,
          severity: 'warning',
          path: flow.filename,
          startLine: 1,
          endLine: 1,
          message: `Flow references field "${fieldName}" which was also modified in this PR — verify flow still behaves as expected`,
          suggestion: 'Test all flow paths that use this field, especially filters, assignments, and decision conditions.',
        });
        break; // one finding per flow is enough
      }
    }
  }

  return findings;
}
