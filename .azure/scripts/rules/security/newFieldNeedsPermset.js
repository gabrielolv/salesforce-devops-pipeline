const RULE_ID = 'SF-SEC-002';

export default function newFieldNeedsPermset(changedFiles) {
  const findings = [];

  const newFields = changedFiles.filter(
    f => f.status === 'added' && f.filename.includes('/fields/') && f.filename.endsWith('.xml')
  );

  if (newFields.length === 0) return findings;

  const permsetChanged = changedFiles.some(
    f => f.filename.endsWith('.permissionset-meta.xml')
  );

  if (!permsetChanged) {
    for (const field of newFields) {
      const fieldName = field.filename.replace(/^.*\//, '').replace('.field-meta.xml', '');
      findings.push({
        ruleId: RULE_ID,
        severity: 'warning',
        path: field.filename,
        startLine: 1,
        endLine: 1,
        message: `New field "${fieldName}" added but no Permission Set was updated in this PR`,
        suggestion: 'Add the new field to the appropriate Permission Set(s) so users can access it.',
      });
    }
  }

  return findings;
}
