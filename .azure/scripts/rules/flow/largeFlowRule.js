const RULE_ID = 'SF-FLW-003';
const NODE_TAGS = [
  '<decisions>', '<loops>', '<assignments>', '<recordLookups>',
  '<recordCreates>', '<recordUpdates>', '<recordDeletes>',
  '<actionCalls>', '<subflows>', '<screens>',
];
const LARGE_THRESHOLD = 30;
const WARN_THRESHOLD  = 15;

export default function largeFlowRule(changedFiles) {
  const findings = [];

  for (const file of changedFiles) {
    if (!file.filename.endsWith('.flow-meta.xml') || !file.content) continue;

    let nodeCount = 0;
    for (const tag of NODE_TAGS) {
      const matches = file.content.match(new RegExp(tag, 'g'));
      if (matches) nodeCount += matches.length;
    }

    if (nodeCount >= WARN_THRESHOLD) {
      const flowName = file.filename.replace(/^.*\//, '').replace('.flow-meta.xml', '');
      findings.push({
        ruleId: RULE_ID,
        severity: nodeCount >= LARGE_THRESHOLD ? 'warning' : 'notice',
        path: file.filename,
        startLine: 1,
        endLine: 1,
        message: `Flow "${flowName}" has ~${nodeCount} elements — large flows are hard to debug and maintain`,
        suggestion: 'Consider splitting into subflows by responsibility, or moving complex logic to an Apex action.',
      });
    }
  }

  return findings;
}
