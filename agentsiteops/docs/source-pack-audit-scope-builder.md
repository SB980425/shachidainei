# Source Pack: Audit Scope Builder

Status: first-party workflow source.

## Purpose

This source pack defines which records support claims on `/tools/audit-scope-builder/`.

## Supported Claims

| Claim | Source | Status |
|---|---|---|
| The tool is local-only | `components/AuditScopeBuilder.tsx` | Supported by client-side state and clipboard output only |
| The tool does not submit a request | `components/AuditScopeBuilder.tsx` | Supported; no form action or network submit exists |
| The tool does not collect payment | `/services/ai-website-opportunity-audit/`, `reports/commercial-validation-gate.md` | Supported while checkout remains disabled |
| The tool helps scope a manual audit | `lib/site.ts`, `docs/page-registry.csv` | Supported by visible page copy and route registry |
| YMYL topics remain blocked | `lib/site.ts`, `/authors/`, `/editorial-policy/` | Supported by trust and editorial policy |

## Disallowed Claims

- The tool guarantees audit acceptance.
- The tool creates a customer account or service request.
- The tool proves search demand, AI citations, traffic, revenue, or payback.
- The tool replaces qualified review for legal, medical, financial, tax, safety, or regulated topics.

## Required Review

Run the content quality gate, analytics gate, commercial validation gate, technical SEO CI, and crawler audit before publishing changes to this page.
