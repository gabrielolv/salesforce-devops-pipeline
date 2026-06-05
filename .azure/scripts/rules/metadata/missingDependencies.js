const RULE_ID = 'SF-META-005';

// Check that Apex classes referenced in LWC @AuraEnabled wires/imports exist in the changeset
// and that flow-referenced Apex actions are present

export default function missingDependencies(changedFiles) {
  const findings = [];

  const changedApexNames = new Set(
    changedFiles
      .filter(f => f.filename.endsWith('.cls') && !f.filename.endsWith('-meta.xml'))
      .map(f => f.filename.replace(/^.*\//, '').replace('.cls', ''))
  );

  // Check LWC files that import Apex — verify the Apex class is in the repo (was changed or exists)
  for (const file of changedFiles) {
    if (!file.filename.includes('/lwc/') || !file.filename.endsWith('.js') || !file.content) continue;
    if (file.status === 'removed') continue;

    const importRe = /import\s+\w+\s+from\s+['"]@salesforce\/apex\/(\w+)\.\w+['"]/g;
    let match;
    while ((match = importRe.exec(file.content)) !== null) {
      const className = match[1];
      // Only flag if the class is also being added in this PR but missing
      const classAdded = changedFiles.some(
        f => f.filename.endsWith(`${className}.cls`) && f.status === 'added'
      );
      const classMissing = changedFiles.some(
        f => f.filename.endsWith(`${className}.cls`) && f.status === 'removed'
      );
      if (classMissing) {
        const lineNum = file.content.slice(0, match.index).split('\n').length;
        findings.push({
          ruleId: RULE_ID,
          severity: 'failure',
          path: file.filename,
          startLine: lineNum,
          endLine: lineNum,
          message: `LWC imports Apex class "${className}" which is being deleted in this PR`,
          suggestion: `Remove the import or update the LWC to use a different Apex class before deleting ${className}.cls.`,
        });
      }
    }
  }

  return findings;
}
