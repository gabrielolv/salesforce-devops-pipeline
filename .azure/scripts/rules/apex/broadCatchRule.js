const RULE_ID = 'SF-APEX-006';
const BROAD_CATCH_RE = /\bcatch\s*\(\s*Exception\s+\w+\s*\)/i;
const EMPTY_CATCH_RE = /\bcatch\s*\([^)]+\)\s*\{?\s*\}?\s*$/;

export default function broadCatchRule(changedFiles) {
  const findings = [];

  for (const file of changedFiles) {
    if (!/\.(cls|trigger)$/.test(file.filename) || !file.content) continue;

    const lines = file.content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.trim().startsWith('//')) continue;

      if (BROAD_CATCH_RE.test(line)) {
        // Check if the catch block body is empty (swallowing the exception)
        const nextLines = lines.slice(i + 1, i + 4).join(' ');
        const isEmpty = /^\s*\{?\s*\}/.test(nextLines) || /\{\s*\}/.test(line);

        findings.push({
          ruleId: RULE_ID,
          severity: isEmpty ? 'failure' : 'warning',
          path: file.filename,
          startLine: i + 1,
          endLine: i + 1,
          message: isEmpty
            ? 'catch(Exception) with an empty body silently swallows all errors'
            : 'catch(Exception) is too broad — catch the most specific exception type instead',
          suggestion: 'Catch specific exception types (e.g. DmlException, QueryException) and log or re-throw.',
        });
      }
    }
  }

  return findings;
}
