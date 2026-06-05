const RULE_ID = 'SF-TRG-003';
// Patterns that indicate a recursion guard is in place
const GUARD_PATTERNS = [
  /static\s+Boolean\s+\w*(run|guard|executed|visited|processed|first)/i,
  /TriggerContext\s*\.\s*hasRun/i,
  /alreadyRun|hasRun|isRunning|firstRun|recursion/i,
];

export default function recursionGuard(changedFiles) {
  const findings = [];

  for (const file of changedFiles) {
    if (!file.filename.endsWith('.trigger') || !file.content) continue;

    // Find the handler class name used in this trigger
    const handlerMatch = file.content.match(/new\s+(\w+)\s*\(/);
    const handlerName = handlerMatch ? handlerMatch[1] : null;

    // Check if the trigger or its handler (if also changed) has a recursion guard
    const triggerHasGuard = GUARD_PATTERNS.some(p => p.test(file.content));

    if (triggerHasGuard) continue;

    // Check changed handler file if it exists in the PR
    if (handlerName) {
      const handlerFile = changedFiles.find(f =>
        f.filename.endsWith(`${handlerName}.cls`) && f.content
      );
      if (handlerFile && GUARD_PATTERNS.some(p => p.test(handlerFile.content))) continue;
    }

    findings.push({
      ruleId: RULE_ID,
      severity: 'notice',
      path: file.filename,
      startLine: 1,
      endLine: 1,
      message: 'No recursion guard detected — this trigger may fire recursively if it updates the same object',
      suggestion: 'Add a static Boolean flag (e.g. "static Boolean hasRun = false;") in the handler to prevent re-entry.',
    });
  }

  return findings;
}
