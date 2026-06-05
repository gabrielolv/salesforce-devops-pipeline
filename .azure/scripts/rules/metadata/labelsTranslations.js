const RULE_ID = 'SF-META-003';

export default function labelsTranslations(changedFiles) {
  const findings = [];

  const labelFiles = changedFiles.filter(
    f => f.filename.endsWith('.labels-meta.xml') && f.patch
  );

  if (labelFiles.length === 0) return findings;

  // Check if any translation file was also updated
  const translationUpdated = changedFiles.some(
    f => f.filename.includes('/translations/') && f.filename.endsWith('.translation-meta.xml')
  );

  if (!translationUpdated) {
    // Count new label entries added
    for (const lf of labelFiles) {
      const newLabels = (lf.patch.match(/^\+\s*<fullName>/gm) || []).length;
      if (newLabels > 0) {
        findings.push({
          ruleId: RULE_ID,
          severity: 'notice',
          path: lf.filename,
          startLine: 1,
          endLine: 1,
          message: `${newLabels} new label(s) added but no translation file was updated in this PR`,
          suggestion: 'Add translations in force-app/main/default/translations/ for all supported languages.',
        });
      }
    }
  }

  return findings;
}
