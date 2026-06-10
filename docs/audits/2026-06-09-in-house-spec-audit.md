# 2026-06-09 — in-house-spec v1.2.0 audit: deployment-model assessment

**Auditor**: Claude (in-house-spec convergence sweep)
**Spec**: in-house-spec v1.2.0 (`IN-HOUSE-CONVENTIONS.md`)
**Tool**: `in-house-spec/bin/check-spec.py --audit`

## Verdict

**flipoff is NOT an in-house fleet service.** It is a public, open-source,
purely static client-side web app (vanilla HTML/CSS/ES-modules, zero runtime
dependencies, no backend, no network calls). The in-house-spec service profile
(FastAPI + systemd/Docker + Traefik/Authelia) does not apply. Only the cheap
universal repo-hygiene items were applied; no deployment infrastructure was
invented.

## Evidence

- `package.json`: dev-only tooling (eslint, htmlhint, vitest); `"private": true` npm metadata but a public GitHub repo; no server framework, no start script.
- `README.md`: "Zero runtime dependencies… Open the file and go." Quick Start is `git clone` + open `index.html` (or any static file server). No deploy section.
- No `Dockerfile`, no `docker-compose.yml`, no systemd unit, no `deploy.sh`, no Python.
- Wiki (`wiki.simmons.systems`): flipoff appears only in `operations/git-standards-rollout.md` (Wave 0 repo-plumbing rollout) and the Redmine per-repo project list. No `services/` page, no port-map entry, no Traefik router, no SimSysSites/Apache vhost entry (`simsyssites` repo has no flipoff reference).
- App is offline-capable by design; ships its own CSP `<meta>` tag (`default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'`).

## Audit results (`check-spec.py --audit`)

### Before

```
- flipoff: missing required file: requirements.in
- flipoff: missing required file: requirements.lock
- flipoff: missing required file: docs/audits/README.md
- flipoff: missing required file: deploy.sh
- flipoff: .gitignore does not ignore venv/
- flipoff: missing unit file flipoff-host.service (and no compose file for the Docker profile)
```

### After (this audit)

```
- flipoff: missing required file: requirements.in     ← N/A, accepted (no Python)
- flipoff: missing required file: requirements.lock   ← N/A, accepted (no Python)
- flipoff: missing required file: deploy.sh           ← N/A, accepted (not deployed)
- flipoff: missing unit file flipoff-host.service     ← N/A, accepted (no service process)
```

The remaining findings are permanent, documented N/A items for a static
non-service repo — the audit tool has no static-site profile.

## Applied (universal items)

- `.gitignore`: added `venv/`
- `docs/audits/README.md` index + this shard
- `SECURITY.md`: added a short threat-model section (already had a reporting process from the git-standards rollout)

## Spec applicability map

| Spec section | Applicability |
|---|---|
| systemd unit / Docker profile / deploy.sh / deploy validation | **N/A** — no server process; nothing to deploy or harden |
| Ingress & proxy contract, Auth, CSRF, rate limiting | **N/A** — no backend, no auth surface, no state-changing endpoints |
| Health contract, Metrics (`simsys-metrics`) | **N/A** — no process to probe or scrape |
| Dependencies (`requirements.in`/`.lock`) | **N/A** — no Python; JS dev-deps already locked via `package-lock.json` + Dependabot |
| Data storage, secrets, token lifecycle, deprecation | **N/A** — no persisted data, no secrets (verified: repo contains none) |
| Browser security headers | **Partially applies** — CSP shipped as `<meta>` in `index.html`. If this is ever hosted on a fleet vhost (Apache/SimSysSites/Traefik), set `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, and CSP w/ `frame-ancestors 'none'` **at the vhost**, not in the repo |
| SECURITY.md | Applies — present, threat model added |
| docs/audits/ | Applies — added |
| `.gitignore` venv/ | Applies — added |
| Pre-commit hooks | Satisfied — `.pre-commit-config.yaml` present (JS equivalent of the py_compile baseline: eslint + htmlhint) |
| Testing expectations | Satisfied in spirit — vitest suite + CI (`test.yml`), scorecard, CodeQL |

## Recommendation

Leave flipoff out of in-house-spec convergence sweeps (or teach
`check-spec.py` a static-site profile). If it is ever deployed on fleet
infrastructure, the deployment is a vhost concern: add the browser security
headers at the web server and register the vhost in the wiki — no repo-side
service scaffolding is needed.
