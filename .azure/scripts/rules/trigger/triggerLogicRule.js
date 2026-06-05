const RULE_ID = 'SF-TRG-002';
// Lines that count as "business logic" directly in a trigger body
const LOGIC_PATTERNS = [
  /^\s*(if|for|while|switch)\s*\(/i,
  /^\s*(insert|update|delete|upsert|merge|undelete)\s+/i,
  /\[\s*SELECT\b/i,
  /\.add\(|\.put\(|\.addAll\(/i,
];
// Lines that are acceptable in a trigger body
const ACCEPTABLE = [
  /^\s*(trigger|\/\/|\*|{|})\b/,
  /\bTrigger\.(new|old|newMap|oldMap|isBefore|isAfter|isInsert|isUpdate|isDelete|isUndelete|size|operationType)\b/i,
  /Handler|Controller|Service|Util|Helper/i, // handler delegation calls
  /^\s*$/,
];

export default function triggerLogicRule(changedFiles) {
  const findings = [];

  for (const file of changedFiles) {
    if (!file.filename.endsWith('.trigger') || !file.content) continue;

    const lines = file.content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (ACCEPTABLE.some(r => r.test(line))) continue;
      if (LOGIC_PATTERNS.some(r => r.test(line))) {
        findings.push({
          ruleId: RULE_ID,
          severity: 'warning',
          path: file.filename,
          startLine: i + 1,
          endLine: i + 1,
          message: 'Business logic found directly in trigger body — triggers should only delegate to a handler class',
          suggestion: 'Move this logic to a TriggerHandler class and call it from the trigger.',
        });
        break; // one finding per trigger file is enough
      }
    }
  }

  return findings;
}
