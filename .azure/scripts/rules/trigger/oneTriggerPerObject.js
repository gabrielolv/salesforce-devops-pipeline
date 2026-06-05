const RULE_ID = 'SF-TRG-001';
const TRIGGER_HEADER_RE = /^\s*trigger\s+\w+\s+on\s+(\w+)\s*\(/im;

export default function oneTriggerPerObject(changedFiles) {
  const findings = [];

  // Only relevant when trigger files are being added
  const addedTriggers = changedFiles.filter(
    f => f.filename.endsWith('.trigger') && f.status === 'added' && f.content
  );

  if (addedTriggers.length === 0) return findings;

  // Parse the object each changed trigger fires on
  const newTriggersByObject = {};
  for (const file of addedTriggers) {
    const m = TRIGGER_HEADER_RE.exec(file.content);
    if (!m) continue;
    const obj = m[1];
    if (!newTriggersByObject[obj]) newTriggersByObject[obj] = [];
    newTriggersByObject[obj].push(file.filename);
  }

  // Also parse existing (non-added) changed triggers to detect conflicts
  const existingTriggers = changedFiles.filter(
    f => f.filename.endsWith('.trigger') && f.status !== 'added' && f.content
  );
  const existingByObject = {};
  for (const file of existingTriggers) {
    const m = TRIGGER_HEADER_RE.exec(file.content);
    if (!m) continue;
    const obj = m[1];
    if (!existingByObject[obj]) existingByObject[obj] = [];
    existingByObject[obj].push(file.filename);
  }

  for (const [obj, files] of Object.entries(newTriggersByObject)) {
    const alreadyHas = existingByObject[obj] || [];
    if (files.length > 1 || alreadyHas.length > 0) {
      const all = [...alreadyHas, ...files];
      findings.push({
        ruleId: RULE_ID,
        severity: 'warning',
        path: files[0],
        startLine: 1,
        endLine: 1,
        message: `Multiple triggers on "${obj}": ${all.map(f => f.replace(/^.*\//, '')).join(', ')}`,
        suggestion: 'Consolidate all event handlers into a single trigger that delegates to a handler class.',
      });
    }
  }

  return findings;
}
