# Security Policy

## Supported versions

Only the latest release tag is supported. Fixes will land on `main` and be
cut as a new patch release; older tags will not be back-patched.

## Reporting a vulnerability

Please **do not** open a public GitHub issue for security problems.

Email **Avicennasis@gmail.com** with:

- A description of the issue.
- Steps to reproduce (or a proof-of-concept).
- The version or commit SHA you found it against.
- Any suggested mitigation if you have one.

Expect an acknowledgement within a week. This is a side-project — there is
no bug bounty and no SLA — but security issues are taken seriously and a
fix and disclosure will be coordinated with you.

## Threat model

FlipOff is a purely static, client-side web app: no backend, no accounts, no
auth, no cookies, no network requests at runtime, and no data persistence.

- **Trust boundaries**: none at runtime — all code runs in the visitor's
  browser from files they obtained themselves. There is no server component,
  so server-side classes of vulnerability (auth bypass, CSRF, SSRF, injection
  against a backend) do not apply.
- **In scope**: XSS or content-injection in the page itself, supply-chain
  issues in the repo's dev tooling or CI, and weaknesses in the shipped
  Content-Security-Policy (`index.html` sets
  `default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'`).
- **Hosting note**: anyone serving FlipOff from a web server is responsible
  for transport security and response headers at that server
  (`X-Content-Type-Options: nosniff`, `Referrer-Policy`,
  `Permissions-Policy`, CSP with `frame-ancestors`); the repo only provides
  the in-page CSP meta tag.
- **Sensitive data**: none handled, stored, or transmitted.

## Out of scope

- Issues in upstream dependencies (report upstream).
- Misconfiguration by consumers of this project.
