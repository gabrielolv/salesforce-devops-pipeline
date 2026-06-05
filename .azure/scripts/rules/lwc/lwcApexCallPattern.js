const RULE_ID = 'SF-LWC-005';

export default function lwcApexCallPattern(changedFiles) {
  const findings = [];

  for (const file of changedFiles) {
    if (!file.filename.includes('/lwc/') || !file.filename.endsWith('.js') || !file.content) continue;

    const content = file.content;
    const lines = content.split('\n');

    // Detect imperative Apex calls: apexMethod({ ... }).then(...)
    // Flag if there is .then() without a corresponding .catch()
    const imperativeCallRe = /\w+\s*\(\s*\{[^}]*\}\s*\)\s*\.then\s*\(/g;
    let match;
    while ((match = imperativeCallRe.exec(content)) !== null) {
      const afterCall = content.slice(match.index, match.index + 500);
      if (!afterCall.includes('.catch(') && !afterCall.includes('catch (')) {
        const lineNum = content.slice(0, match.index).split('\n').length;
        findings.push({
          ruleId: RULE_ID,
          severity: 'warning',
          path: file.filename,
          startLine: lineNum,
          endLine: lineNum,
          message: 'Imperative Apex call uses .then() without a .catch() — errors will be silently lost',
          suggestion: 'Chain .catch(error => { ... }) to handle Apex errors and show feedback to the user.',
        });
      }
    }

    // Detect @wire adapters without error property handling
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!/@wire\s*\(/.test(line)) continue;

      // Find the wired property/function — look ahead up to 5 lines
      const block = lines.slice(i, i + 6).join('\n');
      const hasPropDestructure = /\{\s*(data|error)\s*,\s*(data|error)\s*\}/.test(block);
      const hasErrorCheck = /this\.\w+\.error|\.error\b/.test(block) || hasPropDestructure;

      if (!hasErrorCheck && !block.includes('wiredResult') && !block.includes('result')) {
        findings.push({
          ruleId: RULE_ID,
          severity: 'notice',
          path: file.filename,
          startLine: i + 1,
          endLine: i + 1,
          message: '@wire result does not appear to handle the error property',
          suggestion: 'Destructure both { data, error } from the wired result and display or log the error case.',
        });
      }
    }
  }

  return findings;
}
