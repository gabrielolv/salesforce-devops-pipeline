const RULE_ID = 'SF-APEX-001';
const SOQL_RE = /\[\s*SELECT\b/i;
const LOOP_RE = /\b(for|while|do)\b/;

export default function noSoqlInLoops(changedFiles) {
  const findings = [];

  for (const file of changedFiles) {
    if (!/\.(cls|trigger)$/.test(file.filename) || !file.content) continue;

    const lines = file.content.split('\n');
    let depth = 0;
    const loopDepths = [];
    let pendingLoop = false;

    for (let i = 0; i < lines.length; i++) {
      const code = lines[i].replace(/\/\/.*$/, '');

      if (LOOP_RE.test(code)) pendingLoop = true;

      for (const ch of code) {
        if (ch === '{') {
          depth++;
          if (pendingLoop) { loopDepths.push(depth); pendingLoop = false; }
        } else if (ch === '}') {
          if (loopDepths.length && loopDepths[loopDepths.length - 1] === depth) loopDepths.pop();
          depth--;
        }
      }

      if (loopDepths.length > 0 && SOQL_RE.test(lines[i])) {
        findings.push({
          ruleId: RULE_ID,
          severity: 'failure',
          path: file.filename,
          startLine: i + 1,
          endLine: i + 1,
          message: 'SOQL query inside a loop causes N+1 query issues and may hit governor limits',
          suggestion: 'Move the query outside the loop and store results in a Map or List keyed by Id.',
        });
      }
    }
  }

  return findings;
}
