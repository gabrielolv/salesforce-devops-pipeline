const RULE_ID = 'SF-SEC-003';
const SENSITIVE = [
  { tag: 'ModifyAllData',     label: 'Modify All Data' },
  { tag: 'ViewAllData',       label: 'View All Data' },
  { tag: 'ManageUsers',       label: 'Manage Users' },
  { tag: 'AuthorApex',        label: 'Author Apex' },
  { tag: 'CustomizeApplication', label: 'Customize Application' },
  { tag: 'ManageProfiles',    label: 'Manage Profiles and Permission Sets' },
  { tag: 'ResetPasswords',    label: 'Reset Passwords' },
  { tag: 'InstallPackaging',  label: 'Download AppExchange Packages' },
];

export default function sensitivePerms(changedFiles) {
  const findings = [];

  for (const file of changedFiles) {
    const isPermFile =
      file.filename.endsWith('.permissionset-meta.xml') ||
      (file.filename.includes('/profiles/') && file.filename.endsWith('.xml'));

    if (!isPermFile || !file.patch) continue;

    // Only look at added lines in the diff
    const addedLines = file.patch.split('\n').filter(l => l.startsWith('+') && !l.startsWith('+++'));

    for (const { tag, label } of SENSITIVE) {
      const pattern = new RegExp(`<${tag}>true</${tag}>`, 'i');
      const match = addedLines.find(l => pattern.test(l));
      if (match) {
        findings.push({
          ruleId: RULE_ID,
          severity: 'failure',
          path: file.filename,
          startLine: 1,
          endLine: 1,
          message: `Sensitive permission "${label}" is being granted in this change`,
          suggestion: 'Confirm this permission grant is intentional and approved. Prefer granting to a named Permission Set, not a broad profile.',
        });
      }
    }
  }

  return findings;
}
