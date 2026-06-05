const RULE_ID = 'SF-META-004';

const CATEGORIES = [
  { name: 'Apex',             test: f => /\.(cls|trigger)$/.test(f.filename) && !f.filename.endsWith('-meta.xml') },
  { name: 'LWC',              test: f => f.filename.includes('/lwc/') },
  { name: 'Flows',            test: f => f.filename.endsWith('.flow-meta.xml') },
  { name: 'Profiles',         test: f => f.filename.includes('/profiles/') },
  { name: 'Permission Sets',  test: f => f.filename.endsWith('.permissionset-meta.xml') },
  { name: 'Objects/Fields',   test: f => f.filename.includes('/objects/') || f.filename.includes('/fields/') },
  { name: 'Static Resources', test: f => f.filename.includes('/staticresources/') },
];

const MIXED_THRESHOLD = 4; // more than this many categories = likely mixed concerns

export default function mixedConcerns(changedFiles) {
  const findings = [];

  const touchedCategories = CATEGORIES
    .filter(cat => changedFiles.some(f => cat.test(f)))
    .map(cat => cat.name);

  if (touchedCategories.length >= MIXED_THRESHOLD) {
    findings.push({
      ruleId: RULE_ID,
      severity: 'notice',
      path: changedFiles[0]?.filename ?? '',
      startLine: 1,
      endLine: 1,
      message: `This PR touches ${touchedCategories.length} different metadata categories: ${touchedCategories.join(', ')}`,
      suggestion: 'Consider splitting into focused PRs by concern (e.g. one for Apex + tests, one for flows) to simplify review and reduce deployment risk.',
    });
  }

  return findings;
}
