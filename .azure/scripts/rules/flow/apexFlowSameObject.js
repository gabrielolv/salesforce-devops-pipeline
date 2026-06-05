const RULE_ID = 'SF-FLW-004';
const TRIGGER_HEADER_RE = /trigger\s+\w+\s+on\s+(\w+)\s*\(/i;
// Match <object> tags inside flow XML that indicate the object being processed
const FLOW_OBJECT_RE = /<object>(\w+)<\/object>/gi;

export default function apexFlowSameObject(changedFiles) {
  const findings = [];

  const triggerFiles = changedFiles.filter(f => f.filename.endsWith('.trigger') && f.content);
  const flowFiles    = changedFiles.filter(f => f.filename.endsWith('.flow-meta.xml') && f.content);

  if (triggerFiles.length === 0 || flowFiles.length === 0) return findings;

  const triggerObjects = new Map();
  for (const tf of triggerFiles) {
    const m = TRIGGER_HEADER_RE.exec(tf.content);
    if (m) triggerObjects.set(m[1], tf.filename);
  }

  for (const flow of flowFiles) {
    const flowObjects = new Set();
    let m;
    FLOW_OBJECT_RE.lastIndex = 0;
    while ((m = FLOW_OBJECT_RE.exec(flow.content)) !== null) flowObjects.add(m[1]);

    for (const obj of flowObjects) {
      if (triggerObjects.has(obj)) {
        findings.push({
          ruleId: RULE_ID,
          severity: 'warning',
          path: flow.filename,
          startLine: 1,
          endLine: 1,
          message: `Both a trigger (${triggerObjects.get(obj).replace(/^.*\//, '')}) and this flow operate on "${obj}" — review execution order and recursion risk`,
          suggestion: 'Ensure the trigger and flow are not creating update loops. Consider using a static guard or consolidating automation.',
        });
      }
    }
  }

  return findings;
}
