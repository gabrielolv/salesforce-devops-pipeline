const RULE_ID = 'SF-APEX-004';

function testNameVariants(base) {
  return [
    `${base}Test`,
    `${base}_Test`,
    `Test${base}`,
    `${base}Tests`,
  ];
}

export default function apexTestChanged(changedFiles) {
  const findings = [];

  // Build set of base names for all changed class files (excluding test classes themselves)
  const changedClasses = changedFiles.filter(f =>
    f.filename.endsWith('.cls') &&
    !/[Tt]est/.test(f.filename.replace(/^.*\//, '').replace('.cls', ''))
  );

  if (changedClasses.length === 0) return findings;

  const changedNames = new Set(
    changedFiles.map(f => f.filename.replace(/^.*\//, '').replace('.cls', ''))
  );

  for (const file of changedClasses) {
    const baseName = file.filename.replace(/^.*\//, '').replace('.cls', '');
    const variants = testNameVariants(baseName);

    const testUpdated = variants.some(v => changedNames.has(v));
    if (!testUpdated) {
      findings.push({
        ruleId: RULE_ID,
        severity: 'notice',
        path: file.filename,
        startLine: 1,
        endLine: 1,
        message: `Apex class "${baseName}" changed but no corresponding test class was updated in this PR`,
        suggestion: `Update or add tests in ${variants[0]}.cls to cover the changes.`,
      });
    }
  }

  return findings;
}
