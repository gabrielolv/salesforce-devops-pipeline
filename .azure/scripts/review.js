import { execSync } from 'child_process';

// ── Rule imports ──────────────────────────────────────────────────────────────
import noSoqlInLoops       from './rules/apex/noSoqlInLoops.js';
import noDmlInLoops        from './rules/apex/noDmlInLoops.js';
import bulkifiedLogic      from './rules/apex/bulkifiedLogic.js';
import apexTestChanged     from './rules/apex/apexTestChanged.js';
import noHardcodedIds      from './rules/apex/noHardcodedIds.js';
import broadCatchRule      from './rules/apex/broadCatchRule.js';
import nonSelectiveQuery   from './rules/apex/nonSelectiveQuery.js';

import oneTriggerPerObject from './rules/trigger/oneTriggerPerObject.js';
import triggerLogicRule    from './rules/trigger/triggerLogicRule.js';
import recursionGuard      from './rules/trigger/recursionGuard.js';

import preferPermissionSets  from './rules/security/preferPermissionSets.js';
import newFieldNeedsPermset  from './rules/security/newFieldNeedsPermset.js';
import sensitivePerms        from './rules/security/sensitivePerms.js';
import lwcInsecureDom        from './rules/security/lwcInsecureDom.js';

import lwcNoHardcodedUrls  from './rules/lwc/lwcNoHardcodedUrls.js';
import lwcNavigation       from './rules/lwc/lwcNavigation.js';
import lwcDomManipulation  from './rules/lwc/lwcDomManipulation.js';
import lwcHardcodedLabels  from './rules/lwc/lwcHardcodedLabels.js';
import lwcApexCallPattern  from './rules/lwc/lwcApexCallPattern.js';

import flowReviewRequired  from './rules/flow/flowReviewRequired.js';
import flowNamingRule      from './rules/flow/flowNamingRule.js';
import largeFlowRule       from './rules/flow/largeFlowRule.js';
import apexFlowSameObject  from './rules/flow/apexFlowSameObject.js';
import fieldFlowImpact     from './rules/flow/fieldFlowImpact.js';

import missingDependencies from './rules/metadata/missingDependencies.js';
import destructiveChanges  from './rules/metadata/destructiveChanges.js';
import profileLargeDiff    from './rules/metadata/profileLargeDiff.js';
import labelsTranslations  from './rules/metadata/labelsTranslations.js';
import mixedConcerns       from './rules/metadata/mixedConcerns.js';

// ── Constants ─────────────────────────────────────────────────────────────────
const RULES = [
  noSoqlInLoops, noDmlInLoops, bulkifiedLogic, apexTestChanged,
  noHardcodedIds, broadCatchRule, nonSelectiveQuery,
  oneTriggerPerObject, triggerLogicRule, recursionGuard,
  preferPermissionSets, newFieldNeedsPermset, sensitivePerms, lwcInsecureDom,
  lwcNoHardcodedUrls, lwcNavigation, lwcDomManipulation, lwcHardcodedLabels, lwcApexCallPattern,
  flowReviewRequired, flowNamingRule, largeFlowRule, apexFlowSameObject, fieldFlowImpact,
  missingDependencies, destructiveChanges, profileLargeDiff, labelsTranslations, mixedConcerns,
];

const SEVERITY_ICON  = { failure: '🔴', warning: '🟡', notice: '🔵' };
const SEVERITY_ORDER = { failure: 0, warning: 1, notice: 2 };

const {
  AZURE_TOKEN,
  PR_ID,
  COLLECTION_URI,
  TEAM_PROJECT,
  REPO_ID,
  HEAD_COMMIT,
  TARGET_BRANCH,
} = process.env;

const orgUrl  = COLLECTION_URI?.replace(/\/$/, '');
const baseUrl = `${orgUrl}/${TEAM_PROJECT}/_apis/git/repositories/${REPO_ID}`;
const authHeaders = {
  Authorization: `Bearer ${AZURE_TOKEN}`,
  'Content-Type': 'application/json',
};

// ── Azure DevOps REST helpers ─────────────────────────────────────────────────
async function apiGet(url) {
  const res = await fetch(url, { headers: authHeaders });
  if (!res.ok) throw new Error(`GET ${url} → ${res.status}: ${await res.text()}`);
  return res.json();
}

async function apiPost(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${url} → ${res.status}: ${await res.text()}`);
  return res.json();
}

// ── PR data fetching ──────────────────────────────────────────────────────────
async function getChangedFiles() {
  const { value: iterations } = await apiGet(
    `${baseUrl}/pullRequests/${PR_ID}/iterations?api-version=7.1`
  );
  const latestId = iterations[iterations.length - 1].id;

  const { changeEntries } = await apiGet(
    `${baseUrl}/pullRequests/${PR_ID}/iterations/${latestId}/changes?api-version=7.1`
  );

  return changeEntries
    .filter(c => !c.item.isFolder)
    .map(c => ({
      filename: c.item.path.replace(/^\//, ''),
      status: mapStatus(c.changeType),
    }));
}

function mapStatus(changeType) {
  const t = (changeType ?? '').toLowerCase();
  if (t.includes('add'))    return 'added';
  if (t.includes('delete')) return 'removed';
  if (t.includes('rename')) return 'renamed';
  return 'modified';
}

async function getFileContent(filePath) {
  try {
    const url =
      `${baseUrl}/items` +
      `?path=${encodeURIComponent('/' + filePath)}` +
      `&versionDescriptor.versionType=commit` +
      `&versionDescriptor.version=${HEAD_COMMIT}` +
      `&api-version=7.1`;
    const res = await fetch(url, { headers: authHeaders });
    if (!res.ok) return null;
    return res.text();
  } catch {
    return null;
  }
}

function getFilePatch(filename) {
  const branch = (TARGET_BRANCH || 'develop').replace(/^refs\/heads\//, '');
  try {
    return execSync(`git diff "origin/${branch}" -- "${filename}" 2>/dev/null`, {
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024,
    }) || null;
  } catch {
    return null;
  }
}

// ── Comment posting ───────────────────────────────────────────────────────────
async function postThread(content, threadContext = null) {
  const body = {
    comments: [{ parentCommentId: 0, content, commentType: 1 }],
    status: 1,
  };
  if (threadContext) body.threadContext = threadContext;
  await apiPost(`${baseUrl}/pullRequests/${PR_ID}/threads?api-version=7.1`, body);
}

async function postInlineComment(finding) {
  const icon = SEVERITY_ICON[finding.severity] ?? '⚪';
  let content = `${icon} **[${finding.ruleId}]** ${finding.message}`;
  if (finding.suggestion) content += `\n\n> **Suggestion:** ${finding.suggestion}`;

  await postThread(content, {
    filePath: '/' + finding.path,
    rightFileStart: { line: finding.startLine, offset: 1 },
    rightFileEnd:   { line: finding.endLine ?? finding.startLine, offset: 1 },
  });
}

function buildSummaryBody(findings) {
  if (findings.length === 0) {
    return '## Salesforce PR Review ✅\n\nNo issues found. All best-practice checks passed.';
  }

  const failures = findings.filter(f => f.severity === 'failure');
  const warnings = findings.filter(f => f.severity === 'warning');
  const notices  = findings.filter(f => f.severity === 'notice');

  const lines = ['## Salesforce PR Review'];

  const summary = [];
  if (failures.length) summary.push(`${SEVERITY_ICON.failure} **${failures.length} failure(s)**`);
  if (warnings.length) summary.push(`${SEVERITY_ICON.warning} **${warnings.length} warning(s)**`);
  if (notices.length)  summary.push(`${SEVERITY_ICON.notice} **${notices.length} notice(s)**`);
  lines.push(summary.join('  ·  '), '');

  const sorted = [...findings].sort(
    (a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]
  );

  lines.push('| Severity | Rule | File | Line | Message |');
  lines.push('|----------|------|------|------|---------|');

  for (const f of sorted) {
    const icon = SEVERITY_ICON[f.severity] ?? '⚪';
    const file = f.path ? `\`${f.path}\`` : '—';
    const line = f.startLine ? `L${f.startLine}` : '—';
    const msg  = f.message.replace(/\|/g, '\\|');
    lines.push(`| ${icon} ${f.severity} | ${f.ruleId} | ${file} | ${line} | ${msg} |`);
  }

  const withSuggestions = sorted.filter(f => f.suggestion);
  if (withSuggestions.length) {
    lines.push('', '<details><summary>Suggestions</summary>', '');
    for (const f of withSuggestions) {
      lines.push(`**${f.ruleId}** — ${f.suggestion}`, '');
    }
    lines.push('</details>');
  }

  return lines.join('\n');
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`Reviewing PR #${PR_ID} in ${TEAM_PROJECT} (repo: ${REPO_ID})`);

  const rawFiles = await getChangedFiles();
  console.log(`Changed files: ${rawFiles.length}`);

  const enrichedFiles = await Promise.all(
    rawFiles.map(async f => ({
      ...f,
      content: f.status !== 'removed' ? await getFileContent(f.filename) : null,
      patch:   f.status !== 'removed' ? getFilePatch(f.filename) : null,
    }))
  );

  const findings = [];

  for (const rule of RULES) {
    try {
      const results = rule(enrichedFiles, enrichedFiles);
      if (Array.isArray(results)) findings.push(...results);
    } catch (err) {
      console.error(`Rule "${rule.name}" error: ${err.message}`);
    }
  }

  console.log(`Total findings: ${findings.length}`);
  findings.forEach(f => console.log(`  [${f.severity}] ${f.ruleId} — ${f.path ?? 'n/a'}`));

  for (const f of findings.filter(f => f.path && f.startLine)) {
    await postInlineComment(f).catch(err =>
      console.error(`Inline comment failed: ${err.message}`)
    );
  }

  await postThread(buildSummaryBody(findings));
  console.log(`Review posted — ${findings.length} finding(s)`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
