# Route Confidence System

- Generated: 2026-06-12
- Status: active_reference
- Threshold impact: no direct exposure threshold credit

## Purpose

This record explains how AgentSiteOps should choose a route when a customer provides different project types, evidence levels, and constraints. It is a public reasoning asset, not customer proof.

## Added Assets

| Asset | Role |
|---|---|
| `data/route-confidence-rubric.csv` | Separates high, medium, low, and reject route confidence bands. |
| `data/project-route-fit-matrix.csv` | Maps common project types to stronger routes, weak-route conditions, first assets, and pre-payment evidence. |
| `docs/route-selection-decision-engine.md` | Defines how the route engine must apply the rubric and matrix before selling or delivering a route file. |
| `/methodology/route-selection/` | Public method page that explains the evidence hierarchy and delivery standard. |

## Boundary

- This does not prove search demand, AI citation, visits, qualified replies, payments, usable intake, objections, or revenue.
- This blocks random 0-100 scoring by forcing route confidence to come from evidence bands and fit conditions.
- If evidence is weak, the output must be pilot, narrow, reject, refund, pivot, or stop.
