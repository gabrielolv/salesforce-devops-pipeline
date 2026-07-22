# Salesforce DevOps Pipeline

![alt text](<Sandbox and Pipeline.png>)

A ready-to-use CI/CD pipeline for Salesforce, for **GitHub Actions** and **Azure DevOps**. It deploys only what changed, runs the right tests, and reviews pull requests automatically.

## What it does

- **Delta deployments** — `sfdx-git-delta` deploys only the metadata that changed between commits.
- **Smart test selection** — `GenerateSfdxCommand.js` reads the delta `package.xml` and runs only the relevant Apex tests, then falls back to a full run.
- **JWT authentication** — no passwords; uses a Connected App + private key.
- **Pre/post deployment Apex** — anonymous Apex runs before and after each deploy.
- **PR validation** — pull requests are validated (dry-run deploy) before merge.
- **PR review bot** — static rules + an optional Claude AI reviewer post findings on the PR.
- **Vlocity/OmniStudio (optional)** — a parallel track deploys OmniStudio datapacks when present.

## Repository layout

```
force-app/            # Salesforce source (the metadata being deployed)
manifest/             # package.xml manifests
documentation/        # Detailed guides (see "More docs" below)

.github/
├── workflows/        # One workflow per environment + PR validation + review bot
├── actions/          # Reusable composite actions (install, delta, login, deploy…)
└── scripts/          # PR review bot + Vlocity delta scripts

.azure/
├── pipelines/        # azure-pipelines.yml (branch-aware) + PR review + baseline
├── templates/        # Reusable pipeline steps
└── scripts/          # Pre/post deployment Apex + review bot
```

## GitHub Actions

Each environment has its own workflow. Deploy workflows run **validate → deploy**; validation-only workflows run the dry-run without deploying.

| Workflow | Trigger | Purpose |
|---|---|---|
| `sfdev.yml` | push → `develop` | Validate + deploy to Dev |
| `sfqa.yml` | push → `qa` | Validate + deploy to QA |
| `sfstage.yml` | push → `stage` | Validate + deploy to Stage |
| `sfprod.yml` | push → `main` | Validate + deploy to Prod |
| `sfdevprvalidation` | PR → `develop` | Validation only (dry-run) |
| `sfprodprvalidation` | PR → `main` | Validation only (dry-run) |
| `sfpreprodvalidation.yml` | push → `pre-prod-validation` | Validation only |
| `salesforce-pr-review.yml` | PR → `develop` | PR review bot |
| `first-run-baseline.yml` | manual | Seed the baseline commit (run once per branch) |

Deploy workflows run two jobs:

1. **Validate** — resolve the commit range, generate the delta, pick tests, and dry-run the deploy.
2. **Deploy** — regenerate the delta, run pre-deployment Apex, deploy metadata (and Vlocity, if any), run post-deployment Apex. Skipped automatically when there's nothing to deploy.

Gate production with GitHub **environment protection rules** on the `sfprod` environment.

## Azure DevOps

A single branch-aware pipeline, `.azure/pipelines/azure-pipelines.yml`, triggers on `develop`, `qa`, `uat`, `PreProd`, and `main`. It picks the right variable group from the branch name and runs the same **Build & Validate → Deploy** stages. Additional pipelines cover PR review (`sfpr-review-azure-pipelines.yml`), prod validation, and baseline setup.

Auth uses variable groups per org: `Salesforce_Connector_Dev`, `_QA`, `_UAT`, `_PROD`.

## Setup

### 1. Secrets (JWT Bearer Flow)

Store these as **GitHub environment secrets** (one environment per org: `sfdev`, `sfqa`, `sfstage`, `sfprod`) or **Azure variable groups**:

| Secret | Description |
|---|---|
| `SF_CLIENT_ID` | Connected App Consumer Key |
| `SF_JWT_KEY` | Private key PEM contents (`server.key`) |
| `SF_USERNAME` | Integration user's Salesforce username |
| `SF_LOGIN_URL` | `https://login.salesforce.com` (prod) or `https://test.salesforce.com` (sandbox) |
| `ANTHROPIC_API_KEY` | *(Optional)* Enables the AI PR reviewer; skipped if absent |

### 2. First run

Before the first deploy on a branch, run **Actions → first-run-baseline** for that branch. It records a successful run so delta generation has a starting commit.

## Optional features

### PR review bot

Runs on every PR to `develop` and posts inline comments plus a summary:

- **Static rules** — 30+ deterministic checks across Apex, Triggers, LWC, Flow, Security, and Metadata. Always runs, no cost.
- **AI reviewer** — a read-only Claude agent that reads changed logic files and related repo files to catch cross-file issues static rules can't (e.g. a field rename breaking other metadata). Runs only when `ANTHROPIC_API_KEY` is set and the PR touches logic; XML-only PRs cost nothing.

See [documentation/SF_PR_REVIEW_BOT.md](documentation/SF_PR_REVIEW_BOT.md) for the full rule list and cost controls.

### Pre/post deployment Apex

Drop `.apex` files in:

- GitHub: `.github/pre-deployment/` and `.github/post-deployment/`
- Azure: `.azure/scripts/pre-deployment/` and `.azure/scripts/post-deployment/`

They run in order via `sf apex run` around each deploy.

### Vlocity / OmniStudio

If your org stores OmniStudio components as `vlocity_cmt` managed-package datapacks, export them to a `vlocity/` directory at the repo root. The `vlocity-deploy` action deploys changed datapacks after the standard metadata (which they depend on). Point `vlocity_root` at your export folder if it's named differently. Orgs on native OmniStudio need no extra setup — the standard metadata track handles them.

## More docs

The `documentation/` folder has the detailed guides:

- [PIPELINE.md](documentation/PIPELINE.md) — full pipeline walkthrough
- [RELEASE_ROLLBACK.md](documentation/RELEASE_ROLLBACK.md) — release and rollback procedures
- [SF_PR_REVIEW_BOT.md](documentation/SF_PR_REVIEW_BOT.md) — PR review bot reference
