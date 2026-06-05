const RULE_ID = 'SF-APEX-007';
// Objects that are typically large and require selective queries
const LARGE_OBJECTS = new Set([
  'Case', 'Contact', 'Account', 'Opportunity', 'Lead', 'Task', 'Event',
  'ContentDocument', 'ContentVersion', 'EmailMessage', 'FeedItem',
  'ARCC_Booking__c', 'ARCC_Job__c',
]);

const SOQL_BLOCK_RE = /\[\s*SELECT\s+[\s\S]*?FROM\s+(\w+)([\s\S]*?)\]/gi;

export default function nonSelectiveQuery(changedFiles) {
  const findings = [];

  for (const file of changedFiles) {
    if (!/\.(cls|trigger)$/.test(file.filename) || !file.content) continue;

    const content = file.content;
    let match;
    SOQL_BLOCK_RE.lastIndex = 0;

    while ((match = SOQL_BLOCK_RE.exec(content)) !== null) {
      const objectName = match[1];
      const rest = match[2] || '';
      const hasWhere = /\bWHERE\b/i.test(rest);
      const hasLimit = /\bLIMIT\b/i.test(rest);

      if (!hasWhere && LARGE_OBJECTS.has(objectName)) {
        const lineNum = content.slice(0, match.index).split('\n').length;
        findings.push({
          ruleId: RULE_ID,
          severity: hasLimit ? 'warning' : 'failure',
          path: file.filename,
          startLine: lineNum,
          endLine: lineNum,
          message: `Non-selective query on "${objectName}" without a WHERE clause may scan the full table`,
          suggestion: 'Add a selective WHERE clause (indexed fields: Id, Name, CreatedDate, OwnerId, or a custom indexed field).',
        });
      }
    }
  }

  return findings;
}
