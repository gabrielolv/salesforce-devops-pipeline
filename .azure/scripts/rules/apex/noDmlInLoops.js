const RULE_ID = 'SF-APEX-002';
const DML_RE = /^\s*(insert|update|delete|upsert|merge|undelete)\s+/i;
const LOOP_RE = /\b(for|while|do)\b/;

export default function noDmlInLoops(changedFiles) {
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

      if (loopDepths.length > 0 && DML_RE.test(lines[i])) {
        const op = lines[i].trim().split(/\s+/)[0];
        findings.push({
          ruleId: RULE_ID,
          severity: 'failure',
          path: file.filename,
          startLine: i + 1,
          endLine: i + 1,
          message: `DML operation "${op}" inside a loop will consume one DML statement per iteration`,
          suggestion: 'Collect records into a List and perform a single bulk DML operation after the loop.',
        });
      }
    }
  }

  return findings;
}
