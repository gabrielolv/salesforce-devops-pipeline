const RULE_ID = 'SF-APEX-003';
// Patterns that indicate single-record (non-bulk) handling in a trigger context
const SINGLE_RECORD_PATTERNS = [
  { re: /Trigger\.(new|old)\[0\]/i,        msg: 'Trigger.new[0] assumes a single record; triggers can fire with many records' },
  { re: /Trigger\.(new|old)\.get\(0\)/i,   msg: 'Trigger.new.get(0) assumes a single record' },
  { re: /Trigger\.size\s*==?\s*1\b/,        msg: 'Guard on Trigger.size == 1 breaks bulk processing' },
];

export default function bulkifiedLogic(changedFiles) {
  const findings = [];

  for (const file of changedFiles) {
    if (!file.filename.endsWith('.trigger') || !file.content) continue;

    const lines = file.content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.trim().startsWith('//')) continue;

      for (const { re, msg } of SINGLE_RECORD_PATTERNS) {
        if (re.test(line)) {
          findings.push({
            ruleId: RULE_ID,
            severity: 'warning',
            path: file.filename,
            startLine: i + 1,
            endLine: i + 1,
            message: msg,
            suggestion: 'Iterate over Trigger.new with a for-each loop to handle all records in the batch.',
          });
          break;
        }
      }
    }
  }

  return findings;
}
