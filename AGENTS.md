# AGENTS.md

This file is the agent-facing entry point for the repository. The source of truth for the detailed rules is `.ai/project.md`.

## Quick rules

- Keep the project focused on the knowledge graph, node details, and interview workflow.
- Do not change stable `id` values unless you also update every reference.
- `links` must point to existing node ids.
- When adding content, fill in `description`, `systemRole`, `problemSolved`, `tradeOffs`, and `tags` when possible.
- Keep Chinese display content in Chinese; keep internal ids in English.
- After changing interview source markdown, regenerate `data/interview/interview-bank.json`.
- Main UI lives in `components/system-atlas-app.tsx`.
- 3D graph lives in `components/knowledge-scene.tsx`.
- Detail panel lives in `components/detail-panel.tsx`.
- Interview page lives in `components/interview-workbench.tsx`.
- Graph data starts in `lib/graph-data.ts`.
- Graph layout, search, and paths live in `lib/graph.ts`.

## Check before finishing

- Confirm docs and data stay in sync.
- Run `npm run lint` for code changes.
- Verify both the home graph and interview page still work when interaction changes are involved.
