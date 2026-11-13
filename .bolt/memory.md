# Project memory

## Product intent & audience

- Publication website for NISHTHA, a governance-focused initiative.
- Public-facing readers/subscribers browse articles; admins manage content and subscribers.
- Core features: library-themed article shelves, admin panel (pin/sort/delete), newsletter subscription, newsletter PDF generation, subscriber export.

## Brand personality & voice

- Scholarly, institutional, organized — aligned with a governance publication.
- Library metaphor communicates curated knowledge and archives.

## Visual design & UX direction

- Library-themed aesthetic: article "shelves" as a core UI metaphor.
- Responsive across mobile and desktop.
- Stack: Vite + React, Tailwind CSS, Lucide React icons; `@/` path alias for `src/`.
- Admin panel includes actions: pin, sort, delete articles; export subscriber list.

## Decisions, constraints & rationale

- Framework: vite-react (fixed).
- Deployment target: Netlify — `netlify.toml` already present in project.
- Build verified clean and production-ready.
- PDF generation implemented for newsletters (exact library not confirmed).
- Git push to GitHub cannot be performed by the assistant; user must push manually or via Bolt's GitHub integration.

## Open questions & assumptions

- GitHub repository may not yet be initialized or connected.
- Exact NISHTHA branding (colors, logo, typography) not specified — inferred library/scholarly theme.
- PDF generation library and subscriber data persistence approach not yet confirmed.
- Authentication method for admin panel not discussed.